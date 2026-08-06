import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { contact_number } = body;

    if (!contact_number) {
      return NextResponse.json({ success: false, error: 'Contact number is required' }, { status: 400 });
    }

    // Find all orders matching the exact contact number, sorted by newest first
    const orders = await Order.find({ contact_number: contact_number }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}
