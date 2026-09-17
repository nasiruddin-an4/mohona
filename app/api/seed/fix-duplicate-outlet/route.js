import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import OutletProduct from '@/models/OutletProduct';
import MasterProduct from '@/models/MasterProduct';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

/**
 * Fix: Move all outlet products from the duplicate "dhaka" outlet
 * to the real "mohona-shop-dhaka" outlet, then delete the duplicate.
 */
export async function POST() {
  try {
    await connectDB();

    const duplicateOutlet = await Outlet.findOne({ slug: 'dhaka' });
    const realOutlet = await Outlet.findOne({ slug: 'mohona-shop-dhaka' });

    if (!duplicateOutlet) {
      return NextResponse.json({ success: true, message: 'No duplicate "dhaka" outlet found. Nothing to fix.' });
    }
    if (!realOutlet) {
      return NextResponse.json({ success: false, message: 'Real "mohona-shop-dhaka" outlet not found.' }, { status: 404 });
    }

    // Move seeded outlet products from duplicate to real outlet
    const dupeProducts = await OutletProduct.find({ outletId: duplicateOutlet._id });
    let moved = 0;
    let skipped = 0;

    for (const op of dupeProducts) {
      // Check if this product already exists in the real outlet
      const existing = await OutletProduct.findOne({
        outletId: realOutlet._id,
        productId: op.productId,
      });

      if (existing) {
        // Already exists, just delete the duplicate entry
        await OutletProduct.deleteOne({ _id: op._id });
        skipped++;
      } else {
        // Move to real outlet
        op.outletId = realOutlet._id;
        await op.save();
        moved++;
      }
    }

    // Also move any categories that were created for the duplicate outlet
    await Category.updateMany(
      { outletId: duplicateOutlet._id },
      { outletId: realOutlet._id }
    );

    // Delete the duplicate outlet
    await Outlet.deleteOne({ _id: duplicateOutlet._id });

    return NextResponse.json({
      success: true,
      message: `Fixed! Moved ${moved} products, skipped ${skipped} duplicates. Deleted "dhaka" outlet.`,
    });
  } catch (error) {
    console.error('Error fixing duplicate outlet:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
