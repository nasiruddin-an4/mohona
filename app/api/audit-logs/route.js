import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AuditLog from '@/models/AuditLog';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth, applyOutletFilter } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// GET /api/audit-logs
// SUPER_ADMIN → all logs; OUTLET_MANAGER → own outlet's logs
export async function GET(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const outletFilter = searchParams.get('outlet');
  const limit = parseInt(searchParams.get('limit') || '100');

  const query = applyOutletFilter(session, {}, outletFilter);

  const logs = await AuditLog.find(query)
    .populate('userId', 'name email')
    .populate('outletId', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit);

  return NextResponse.json({ success: true, data: logs });
}
