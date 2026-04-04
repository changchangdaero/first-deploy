import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
} from './src/lib/admin-auth';

function isAdminLoginPath(pathname: string) {
  return pathname === '/admin/login';
}

function isProtectedAdminPath(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (isAdminLoginPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie || !process.env.ADMIN_ACCESS_CODE?.trim()) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const expectedSession = await createAdminSessionValue();

  if (sessionCookie !== expectedSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
