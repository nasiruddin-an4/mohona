import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mohona-rbac-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Sign a JWT token containing user session data.
 * @param {object} payload - { userId, email, role, outletId }
 * @returns {string} signed JWT token
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object|null} decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extract and verify session from a Next.js Request object.
 * Reads the admin_token cookie.
 * @param {Request} request
 * @returns {{ userId, email, role, outletId, isSuperAdmin } | null}
 */
export function getSessionFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
  if (!tokenMatch) return null;

  const decoded = verifyToken(decodeURIComponent(tokenMatch[1]));
  if (!decoded) return null;

  return {
    userId: decoded.userId,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
    outletId: decoded.outletId || null,
    outletName: decoded.outletName || null,
    outletSlug: decoded.outletSlug || null,
    isSuperAdmin: decoded.role === 'SUPER_ADMIN',
  };
}
