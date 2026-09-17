import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import OutletProduct from '@/models/OutletProduct';
import MasterProduct from '@/models/MasterProduct';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  try {
    await connectDB();
    const { slug: outletSlug, productSlug } = resolvedParams;

    // Find the outlet by slug
    const outlet = await Outlet.findOne({ slug: outletSlug });
    if (!outlet) {
      return NextResponse.json({ success: false, error: 'Outlet not found' }, { status: 404 });
    }

    const isMongoId = productSlug.match(/^[0-9a-fA-F]{24}$/);

    let product;
    if (isMongoId) {
      product = await OutletProduct.findOne({
        outletId: outlet._id,
        $or: [{ _id: productSlug }, { productId: productSlug }]
      }).populate('productId').populate('categoryId');
    } else {
      // It's a slug — find the MasterProduct first
      const masterProduct = await MasterProduct.findOne({ slug: productSlug });
      if (masterProduct) {
        product = await OutletProduct.findOne({
          outletId: outlet._id,
          productId: masterProduct._id
        }).populate('productId').populate('categoryId');
      }
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found in this outlet' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching outlet product by slug:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
