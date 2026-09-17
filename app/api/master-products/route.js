import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MasterProduct from '@/models/MasterProduct';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, requireRole } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/master-products — any authenticated admin
export async function GET(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const query = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const [products, total] = await Promise.all([
    MasterProduct.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    MasterProduct.countDocuments(query),
  ]);

  return NextResponse.json({ success: true, data: products, total, page, limit });
}

// POST /api/master-products — SUPER_ADMIN only
export async function POST(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;
  
  const roleCheck = requireRole(session, ['SUPER_ADMIN']);
  if (!roleCheck.ok) return roleCheck.response;

  await connectDB();

  try {
    const body = await request.json();

    // Generate slug from name
    if (body.name && !body.slug) {
      const baseSlug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      body.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const product = await MasterProduct.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
