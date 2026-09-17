import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getSessionFromRequest } from '@/lib/auth';
import { applyOutletFilter } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/orders
// SUPER_ADMIN → all orders (optional ?outlet= filter)
// MANAGER/STAFF → only their outlet's orders
export async function GET(request) {
  try {
    await connectDB();

    const session = getSessionFromRequest(request);
    const { searchParams } = new URL(request.url);
    const outletFilter = searchParams.get('outlet');
    const status = searchParams.get('status');

    let query = {};

    if (session && !session.isSuperAdmin) {
      // Managers/Staff are locked to their outlet
      query = applyOutletFilter(session, {}, null);
    } else if (session && session.isSuperAdmin && outletFilter && outletFilter !== 'all') {
      query.outletId = outletFilter;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/orders — public (customer-facing checkout)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Generate order number ORD-XXXXXX
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    body.order_number = `ORD-${randomHex}`;

    // Optionally attach outletId if provided in body (from outlet-aware checkout)
    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
