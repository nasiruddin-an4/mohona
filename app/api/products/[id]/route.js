import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isMongoId ? { _id: id } : { slug: id };
    const product = await Product.findOne(query);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isMongoId ? { _id: id } : { slug: id };
    const body = await request.json();
    const product = await Product.findOneAndUpdate(query, body, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isMongoId ? { _id: id } : { slug: id };
    const product = await Product.findOneAndDelete(query);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
