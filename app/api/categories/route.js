import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireOutletAccess, applyOutletFilter } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/categories
// SUPER_ADMIN → all categories (optionally filtered by ?outlet=)
// MANAGER/STAFF → only their outlet's categories + global (outletId=null) categories
export async function GET(request) {
  const session = getSessionFromRequest(request);

  await connectDB();

  const { searchParams } = new URL(request.url);
  const outletFilter = searchParams.get('outlet');

  let query = {};

  if (session) {
    if (session.isSuperAdmin) {
      // Super Admin: all categories, with optional outlet filter
      if (outletFilter && outletFilter !== 'all') {
        query.outletId = outletFilter;
      }
    } else {
      // Managers/Staff: their outlet + global categories
      query = {
        $or: [
          { outletId: session.outletId },
          { outletId: null },
        ],
      };
    }
  }
  // Unauthenticated (public) requests get all categories (for storefront)

  try {
    const categories = await Category.find(query).populate('outletId', 'name slug').sort({ name: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/categories — authenticated admins only
export async function POST(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  try {
    const body = await request.json();

    // Managers can only create categories for their own outlet
    if (!session.isSuperAdmin) {
      body.outletId = session.outletId;
    }

    if (body.outletId) {
      const access = requireOutletAccess(session, body.outletId);
      if (!access.ok) return access.response;
    }

    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
