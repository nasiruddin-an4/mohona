import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import OutletProduct from '@/models/OutletProduct';
import MasterProduct from '@/models/MasterProduct';
import Category from '@/models/Category';
import Outlet from '@/models/Outlet';
import AuditLog from '@/models/AuditLog';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireOutletAccess, requireRole } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  const product = await OutletProduct.findById(resolvedParams.id)
    .populate('productId', 'name slug image_url brand tags description')
    .populate('outletId', 'name slug')
    .populate('categoryId', 'name');

  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }

  const access = requireOutletAccess(session, product.outletId._id);
  if (!access.ok) return access.response;

  return NextResponse.json({ success: true, data: product });
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  // Find the product and verify ownership BEFORE updating
  const existing = await OutletProduct.findById(resolvedParams.id);
  if (!existing) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }

  const access = requireOutletAccess(session, existing.outletId);
  if (!access.ok) return access.response;

  try {
    const body = await request.json();
    // Prevent outletId from being changed by managers
    if (!session.isSuperAdmin) {
      delete body.outletId;
    }

    // Unified flow: Update MasterProduct if name or image is provided
    if (body.name || body.image_url) {
      const masterUpdates = {};
      if (body.name) masterUpdates.name = body.name;
      if (body.description !== undefined) masterUpdates.description = body.description;
      if (body.image_url) {
        masterUpdates.image_url = body.image_url;
        masterUpdates.cover_image = body.image_url;
        masterUpdates.product_images = [body.image_url];
      }
      
      await MasterProduct.findByIdAndUpdate(
        existing.productId,
        masterUpdates,
        { runValidators: true }
      );
    }

    const oldValue = existing.toObject();
    const updated = await OutletProduct.findByIdAndUpdate(
      resolvedParams.id,
      body,
      { new: true, runValidators: true }
    ).populate('productId', 'name slug image_url')
     .populate('outletId', 'name slug')
     .populate('categoryId', 'name');

    // Write audit log
    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      userRole: session.role,
      outletId: existing.outletId,
      action: 'UPDATE_OUTLET_PRODUCT',
      entity: 'OutletProduct',
      entityId: resolvedParams.id,
      oldValue: { price: oldValue.price, stock_qty: oldValue.stock_qty, available: oldValue.available },
      newValue: { price: updated.price, stock_qty: updated.stock_qty, available: updated.available },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  const product = await OutletProduct.findById(resolvedParams.id);
  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }

  const access = requireOutletAccess(session, product.outletId);
  if (!access.ok) return access.response;

  // Staff cannot delete
  const roleCheck = requireRole(session, ['SUPER_ADMIN', 'OUTLET_MANAGER']);
  if (!roleCheck.ok) return roleCheck.response;

  await OutletProduct.findByIdAndDelete(resolvedParams.id);
  return NextResponse.json({ success: true, message: 'Outlet product removed' });
}
