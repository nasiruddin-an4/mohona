import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Generate order number ORD-XXXXXX
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    body.order_number = `ORD-${randomHex}`;

    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
