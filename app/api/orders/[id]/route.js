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
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'Cancelled') {
        updateData.payment_status = 'Cancelled';
      }
    }
    
    if (body.payment_status !== undefined) updateData.payment_status = body.payment_status;
    if (body.items !== undefined) updateData.items = body.items;
    if (body.subtotal !== undefined) updateData.subtotal = body.subtotal;
    if (body.total_amount !== undefined) updateData.total_amount = body.total_amount;
    if (body.shipping_cost !== undefined) updateData.shipping_cost = body.shipping_cost;
    if (body.tracking_number !== undefined) updateData.tracking_number = body.tracking_number;
    if (body.courier_name !== undefined) updateData.courier_name = body.courier_name;

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
