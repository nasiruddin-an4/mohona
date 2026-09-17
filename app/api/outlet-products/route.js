import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import OutletProduct from '@/models/OutletProduct';
import MasterProduct from '@/models/MasterProduct';
import Category from '@/models/Category';
import Outlet from '@/models/Outlet';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireRole, requireOutletAccess, applyOutletFilter } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/outlet-products
// SUPER_ADMIN → all (optional ?outlet= filter)
// MANAGER/STAFF → only their outlet's products
export async function GET(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const outletFilter = searchParams.get('outlet');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const available = searchParams.get('available');

    let query = applyOutletFilter(session, {}, outletFilter);
    if (category) query.categoryId = category;
    if (status) query.status = status;
    if (available !== null && available !== undefined && available !== '') {
      query.available = available === 'true';
    }

    const outletProducts = await OutletProduct.find(query)
      .populate('productId', 'name slug image_url brand tags')
      .populate('outletId', 'name slug')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: outletProducts });
  } catch (error) {
    console.error('API Error in GET /api/outlet-products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/outlet-products — create an outlet listing for a master product
export async function POST(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  try {
    const body = await request.json();

    // Managers can only create for their own outlet — enforce on backend
    if (!session.isSuperAdmin) {
      body.outletId = session.outletId;
    }

    // Validate outlet ownership
    const access = requireOutletAccess(session, body.outletId);
    if (!access.ok) return access.response;

    let productId = body.productId;

    if (!productId && body.name) {
      // Unified flow: auto-create the MasterProduct
      const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      const newMaster = await MasterProduct.create({
        name: body.name,
        description: body.description || '',
        image_url: body.image_url || '',
        cover_image: body.image_url || '',
        product_images: body.image_url ? [body.image_url] : [],
        slug: slug,
        brand: body.brand || ''
      });
      productId = newMaster._id;
    }

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Master product ID or product Name is required' }, { status: 400 });
    }

    body.productId = productId;

    const outletProduct = await OutletProduct.create(body);
    const populated = await OutletProduct.findById(outletProduct._id)
      .populate('productId', 'name slug image_url brand')
      .populate('outletId', 'name slug')
      .populate('categoryId', 'name');

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'This product is already listed for this outlet' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
