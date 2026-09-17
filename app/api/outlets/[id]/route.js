import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireRole, requireOutletAccess } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/outlets/[id]
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const access = requireOutletAccess(session, resolvedParams.id);
  if (!access.ok) return access.response;

  await connectDB();

  const outlet = await Outlet.findById(resolvedParams.id);
  if (!outlet) {
    return NextResponse.json({ success: false, message: 'Outlet not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: outlet });
}

// PUT /api/outlets/[id] — SUPER_ADMIN only
export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  try {
    const body = await request.json();
    const outlet = await Outlet.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!outlet) {
      return NextResponse.json({ success: false, message: 'Outlet not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: outlet });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE /api/outlets/[id] — SUPER_ADMIN only
export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  const outlet = await Outlet.findByIdAndDelete(resolvedParams.id);
  if (!outlet) {
    return NextResponse.json({ success: false, message: 'Outlet not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Outlet deleted' });
}
