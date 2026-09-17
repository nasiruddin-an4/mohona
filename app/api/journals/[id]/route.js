import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Journal from '@/models/Journal';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/journals/[id]
export async function GET(request, { params }) {
  const resolvedParams = await params;
  try {
    await connectDB();
    const journal = await Journal.findById(resolvedParams.id);
    
    if (!journal) {
      return NextResponse.json({ success: false, error: 'Journal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: journal });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/journals/[id]
export async function PUT(request, { params }) {
  const resolvedParams = await params;
  try {
    const session = getSessionFromRequest(request);
    
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    await connectDB();
    const data = await request.json();

    // Auto generate slug if title is changed and no slug provided
    if (data.title && !data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (data.status === 'Publish' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const journal = await Journal.findByIdAndUpdate(
      resolvedParams.id,
      data,
      { new: true, runValidators: true }
    );

    if (!journal) {
      return NextResponse.json({ success: false, error: 'Journal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: journal });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'A journal with this slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/journals/[id]
export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  try {
    const session = getSessionFromRequest(request);
    
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    await connectDB();

    const journal = await Journal.findByIdAndDelete(resolvedParams.id);

    if (!journal) {
      return NextResponse.json({ success: false, error: 'Journal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
