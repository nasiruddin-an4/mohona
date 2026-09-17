import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import OutletProduct from '@/models/OutletProduct';
import MasterProduct from '@/models/MasterProduct'; // Ensure model is loaded for populate
import Category from '@/models/Category'; // Ensure model is loaded for populate

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Default to 'dhaka' outlet for the public catalog
    const outlet = await Outlet.findOne({ slug: 'dhaka' });
    if (!outlet) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    let query = {
      outletId: outlet._id,
      available: true,
      status: 'Publish'
    };
    
    if (category && category !== 'All') {
      const cat = await Category.findOne({ name: category });
      if (cat) {
        query.categoryId = cat._id;
      } else {
        // if category passed as ID
        query.categoryId = category;
      }
    }
    
    const products = await OutletProduct.find(query)
      .populate('productId')
      .populate('categoryId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: products }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
