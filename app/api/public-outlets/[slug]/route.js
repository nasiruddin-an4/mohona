import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  try {
    await connectDB();
    const { slug } = params;
    const outlet = await Outlet.findOne({ slug, status: 'Active' });
    if (!outlet) {
      return NextResponse.json({ success: false, message: 'Outlet not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: outlet });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
