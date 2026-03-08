import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Identify the target: Where is the user trying to go?
  const path = request.nextUrl.pathname;

  // 2. Restricted zone: Routes that require authentication
  const isProtectedRoute =
    path.startsWith('/dashboard') || path.startsWith('/ideas');

  // 3. Check for authentication token in cookies
  const token = request.cookies.get('token')?.value;

  // 4. Attempt to access protected routes without a token → redirect to Login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Already authenticated but visiting Login → redirect to Dashboard
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 6. All checks passed → allow the request to proceed
  return NextResponse.next();
}

// Optimization: Only run middleware for these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ideas/:path*',
    '/login',
  ],
};