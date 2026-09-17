import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MasterProduct from '@/models/MasterProduct';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireRole } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();
  const product = await MasterProduct.findById(resolvedParams.id);
  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: product });
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  // Only SUPER_ADMIN can edit master product definitions
  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  try {
    const body = await request.json();
    const product = await MasterProduct.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();
  const product = await MasterProduct.findByIdAndDelete(resolvedParams.id);
  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Master product deleted' });
}
