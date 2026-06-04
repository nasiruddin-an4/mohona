import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isMongoId ? { _id: id } : { order_number: id };
    
    const order = await Order.findOne(query).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isMongoId ? { _id: id } : { order_number: id };
    
    const body = await request.json();
    
    // Only allow specific fields to be updated
    const updateData = {};
    if (body.status) updateData.status = body.status;
    if (body.payment_status) updateData.payment_status = body.payment_status;

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
