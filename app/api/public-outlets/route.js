import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const outlets = await Outlet.find({ status: 'Active' }).sort({ name: 1 });
    return NextResponse.json({ success: true, data: outlets });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
