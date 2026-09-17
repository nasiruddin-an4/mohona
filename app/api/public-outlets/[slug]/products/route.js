import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import OutletProduct from '@/models/OutletProduct';

export const dynamic = 'force-dynamic';

/**
 * GET /api/outlets/[slug]/products
 * Public endpoint — resolves outlet slug → outletId → returns available OutletProducts
 * Used by customer-facing storefront pages.
 */
export async function GET(request, { params }) {
  const resolvedParams = await params;
  try {
    await connectDB();

    const outlet = await Outlet.findOne({ slug: resolvedParams.slug, status: 'Active' });
    if (!outlet) {
      return NextResponse.json({ success: false, message: 'Outlet not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query = {
      outletId: outlet._id,
      available: true,
      status: 'Publish',
    };

    if (category && category !== 'all') {
      query.categoryId = category;
    }

    const products = await OutletProduct.find(query)
      .populate('productId', 'name slug description image_url cover_image product_images brand tags')
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 });

    // Filter by search if provided
    const filtered = search
      ? products.filter(p =>
          p.productId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.productId?.brand?.toLowerCase().includes(search.toLowerCase())
        )
      : products;

    return NextResponse.json({
      success: true,
      outlet: {
        id: outlet._id,
        name: outlet.name,
        slug: outlet.slug,
        address: outlet.address,
        phone: outlet.phone,
      },
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching outlet products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
