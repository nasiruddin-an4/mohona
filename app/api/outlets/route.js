import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireRole, applyOutletFilter } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/outlets
// SUPER_ADMIN → all outlets
// OUTLET_MANAGER/STAFF → only own outlet
export async function GET(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  let outlets;
  if (session.isSuperAdmin) {
    outlets = await Outlet.find().sort({ name: 1 });
  } else {
    outlets = await Outlet.find({ _id: session.outletId });
  }

  return NextResponse.json({ success: true, data: outlets });
}

// POST /api/outlets  — SUPER_ADMIN only
export async function POST(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  try {
    const body = await request.json();

    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const outlet = await Outlet.create(body);
    return NextResponse.json({ success: true, data: outlet }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
