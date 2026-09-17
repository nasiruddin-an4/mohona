import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireRole, applyOutletFilter } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/users
// SUPER_ADMIN → all users (with optional ?outlet= filter)
// OUTLET_MANAGER → users in own outlet
export async function GET(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  // Only admins and managers can list users
  const roleCheck = requireRole(session, ['SUPER_ADMIN', 'OUTLET_MANAGER']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const outletFilter = searchParams.get('outlet');

  const query = applyOutletFilter(session, {}, outletFilter);

  const users = await User.find(query)
    .select('-password')
    .populate('outletId', 'name slug')
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: users });
}

// POST /api/users — SUPER_ADMIN only
export async function POST(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  try {
    const body = await request.json();
    const { name, email, password, role, outletId, status } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate: non-super-admin must have an outletId
    if (role !== 'SUPER_ADMIN' && !outletId) {
      return NextResponse.json(
        { success: false, message: 'outletId is required for OUTLET_MANAGER and OUTLET_STAFF' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      outletId: role === 'SUPER_ADMIN' ? null : outletId,
      status: status || 'Active',
    });

    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
