import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

/**
 * GET /api/outlets/[slug]/categories
 * Public endpoint — returns active categories for a given outlet slug.
 * Used by customer-facing storefront category navigation.
 */
export async function GET(request, { params }) {
  const resolvedParams = await params;
  try {
    await connectDB();

    const outlet = await Outlet.findOne({ slug: resolvedParams.slug, status: 'Active' });
    if (!outlet) {
      return NextResponse.json({ success: false, message: 'Outlet not found' }, { status: 404 });
    }

    // Fetch outlet-specific + global categories
    const categories = await Category.find({
      $or: [
        { outletId: outlet._id },
        { outletId: null },
      ],
      status: 'Active',
    }).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      outlet: { name: outlet.name, slug: outlet.slug },
      data: categories,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
