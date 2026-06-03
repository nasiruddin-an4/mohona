import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Review from '@/models/Review';
import Product from '@/models/Product'; // needed for population

export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    await connectDB();
    
    // Fetch reviews and populate product details
    let reviews = await Review.find()
      .populate({
        path: 'product_id',
        select: 'name image_url cover_image',
        model: Product
      })
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ success: true, data: reviews }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
