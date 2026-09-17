import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Journal from '@/models/Journal';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/journals - Fetch all journals
export async function GET(request) {
  try {
    await connectDB();
    
    // Check auth for admin, but allow public for published
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const isPublic = searchParams.get('public') === 'true';

    let query = {};
    if (isPublic) {
      query.status = 'Publish';
    } else if (status) {
      query.status = status;
    }

    const journals = await Journal.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: journals });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/journals - Create a new journal
export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    await connectDB();

    const data = await request.json();

    // Auto generate slug if not provided or empty
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const journal = await Journal.create({
      title: data.title,
      slug: data.slug,
      content: data.content,
      author: data.author || 'Admin',
      image_url: data.image_url || '',
      status: data.status || 'Draft',
      publishedAt: data.status === 'Publish' ? new Date() : null,
    });

    return NextResponse.json({ success: true, data: journal }, { status: 201 });
  } catch (error) {
    // Check for duplicate slug
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'A journal with this slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
