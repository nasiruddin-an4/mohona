import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Review from '@/models/Review';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const { status } = body;
    const { id } = await params;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status are required' }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
