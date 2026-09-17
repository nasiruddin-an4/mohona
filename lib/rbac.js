import { NextResponse } from 'next/server';

/**
 * RBAC helper library.
 * All API routes that write data should call these helpers.
 */

/**
 * Returns 401 JSON response.
 */
export function unauthorized(msg = 'Unauthorized') {
  return NextResponse.json({ success: false, message: msg }, { status: 401 });
}

/**
 * Returns 403 JSON response.
 */
export function forbidden(msg = 'Forbidden — insufficient permissions') {
  return NextResponse.json({ success: false, message: msg }, { status: 403 });
}

/**
 * Require the request to have a valid session.
 * Returns the session or a 401 response.
 * @param {object|null} session
 * @returns {{ ok: true, session } | { ok: false, response }}
 */
export function requireAuth(session) {
  if (!session) {
    return { ok: false, response: unauthorized() };
  }
  return { ok: true, session };
}

/**
 * Require the session user to have one of the allowed roles.
 * @param {object} session
 * @param {string[]} roles - allowed roles e.g. ['SUPER_ADMIN']
 * @returns {{ ok: true } | { ok: false, response }}
 */
export function requireRole(session, roles) {
  if (!roles.includes(session.role)) {
    return { ok: false, response: forbidden() };
  }
  return { ok: true };
}

/**
 * For a given session + target outletId, verify the user has access.
 * SUPER_ADMIN always passes.
 * OUTLET_MANAGER / OUTLET_STAFF can only access their own outlet.
 * @param {object} session
 * @param {string} targetOutletId
 * @returns {{ ok: true } | { ok: false, response }}
 */
export function requireOutletAccess(session, targetOutletId) {
  if (session.isSuperAdmin) return { ok: true };
  if (!session.outletId) return { ok: false, response: forbidden() };
  if (session.outletId.toString() !== targetOutletId?.toString()) {
    return { ok: false, response: forbidden('You can only access your own outlet') };
  }
  return { ok: true };
}

/**
 * Build a MongoDB query filter that scopes to the user's outlet.
 * SUPER_ADMIN: no filter added (optionally filter by ?outlet= query param).
 * Others: force outletId = session.outletId.
 * @param {object} session
 * @param {object} baseQuery - existing query object
 * @param {string|null} requestedOutletId - from query param (Super Admin only)
 * @returns {object} query with outlet filter applied
 */
export function applyOutletFilter(session, baseQuery = {}, requestedOutletId = null) {
  if (session.isSuperAdmin) {
    if (requestedOutletId && requestedOutletId !== 'all') {
      return { ...baseQuery, outletId: requestedOutletId };
    }
    return baseQuery; // Super Admin sees all
  }
  // Managers and staff are always locked to their outlet
  return { ...baseQuery, outletId: session.outletId };
}
