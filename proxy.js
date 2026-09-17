import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'mohona-rbac-secret-change-in-production';

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const cookieToken = request.cookies.get('admin_token')?.value;

    if (!cookieToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload: session } = await jwtVerify(cookieToken, secret);

      // Attach decoded role info to request headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', session.userId || '');
      requestHeaders.set('x-user-role', session.role || '');
      requestHeaders.set('x-outlet-id', session.outletId || '');
      requestHeaders.set('x-outlet-name', session.outletName || '');

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err) {
      // Token is invalid or expired — force re-login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
