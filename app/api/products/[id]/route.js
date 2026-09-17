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
    const { id } = resolvedParams; // this is either OutletProduct._id, MasterProduct._id, or MasterProduct.slug
    
    // Default to 'dhaka' outlet for the public catalog
    const outlet = await Outlet.findOne({ slug: 'dhaka' });
    if (!outlet) {
      return NextResponse.json({ success: false, error: 'Outlet not found' }, { status: 404 });
    }
    
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    
    let product;
    if (isMongoId) {
      // Could be OutletProduct ID or MasterProduct ID
      product = await OutletProduct.findOne({ 
        outletId: outlet._id, 
        $or: [{ _id: id }, { productId: id }] 
      }).populate('productId').populate('categoryId');
    } else {
      // It's a slug. We must find the MasterProduct first.
      const masterProduct = await MasterProduct.findOne({ slug: id });
      if (masterProduct) {
        product = await OutletProduct.findOne({
          outletId: outlet._id,
          productId: masterProduct._id
        }).populate('productId').populate('categoryId');
      }
    }
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
