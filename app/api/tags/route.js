import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tag from '@/models/Tag';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const tags = await Tag.find({});
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const tag = await Tag.create(body);
    return NextResponse.json({ success: true, data: tag }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
