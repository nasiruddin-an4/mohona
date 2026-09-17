import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import OutletProduct from '@/models/OutletProduct';
import Outlet from '@/models/Outlet';

export async function GET(request) {
  try {
    await connectDB();

    // Find all active outlets
    const outlets = await Outlet.find({ status: 'Active' });
    
    const featuredProducts = [];

    // For each outlet, find featured products
    for (const outlet of outlets) {
      // Find all featured products for this outlet
      const outletFeatured = await OutletProduct.find({ 
        outletId: outlet._id, 
        status: 'Publish',
        featured: true
      }).populate('productId').populate('categoryId').limit(8);

      if (outletFeatured.length > 0) {
        for (const fp of outletFeatured) {
          const productObj = fp.toObject();
          productObj.outletSlug = outlet.slug;
          productObj.outletName = outlet.name;
          featuredProducts.push(productObj);
        }
      }
      
      // If we still have less than 8 total, add newest non-featured products
      if (featuredProducts.length < 8) {
        const featuredIds = outletFeatured.map(p => p._id);
        const additional = await OutletProduct.find({
          outletId: outlet._id,
          status: 'Publish',
          _id: { $nin: featuredIds }
        }).sort({ createdAt: -1 }).limit(8 - featuredProducts.length)
          .populate('productId').populate('categoryId');

        for (const fp of additional) {
          const productObj = fp.toObject();
          productObj.outletSlug = outlet.slug;
          productObj.outletName = outlet.name;
          featuredProducts.push(productObj);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    console.error('Error in /api/featured-outlet-products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
