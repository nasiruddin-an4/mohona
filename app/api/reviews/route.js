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

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    let query = {};
    if (productId) {
      query.product_id = productId;
      query.status = 'Published'; // Only show published reviews on the frontend
    }
    
    // Fetch reviews and populate product details
    let reviews = await Review.find(query)
      .populate({
        path: 'product_id',
        select: 'name image_url cover_image product_images slug',
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

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { product_id, user_name, review_text, rating } = body;

    if (!product_id || !user_name || !review_text || !rating) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const review = await Review.create({
      product_id,
      user_name,
      review_text,
      rating: Number(rating),
      status: 'Published' // default
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
