import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireRole } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/users/[id] — SUPER_ADMIN only
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { id } = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN', 'OUTLET_MANAGER']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  const user = await User.findById(id).select('-password').populate('outletId', 'name slug');
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: user });
}

// PUT /api/users/[id] — SUPER_ADMIN only
export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const { id } = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  try {
    const body = await request.json();

    // If password is being updated, hash it
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 12);
    } else {
      delete body.password; // Don't overwrite with empty
    }

    const user = await User.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).select('-password').populate('outletId', 'name slug');

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE /api/users/[id] — SUPER_ADMIN only
export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const { id } = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'User deleted successfully' });
}
