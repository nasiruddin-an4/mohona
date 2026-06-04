import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne({ key: 'singleton' });
    if (!settings) {
      settings = await SiteSettings.create({ key: 'singleton' });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Ensure we don't accidentally update the 'key'
    delete body.key;

    let settings = await SiteSettings.findOne({ key: 'singleton' });
    if (!settings) {
       settings = await SiteSettings.create({ key: 'singleton', ...body });
    } else {
       settings = await SiteSettings.findOneAndUpdate(
         { key: 'singleton' },
         { $set: body },
         { new: true, runValidators: true }
       );
    }
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
