import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/me
 * Returns the current session (decoded from JWT cookie).
 * Used by AuthContext to hydrate user state on the frontend.
 */
export async function GET(request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      userId: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
      outletId: session.outletId,
      outletName: session.outletName,
      outletSlug: session.outletSlug,
      isSuperAdmin: session.isSuperAdmin,
    },
  });
}
