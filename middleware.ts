// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authOptions } from './auth';
import { getServerSession } from 'next-auth';

export async function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const pathname = request.nextUrl.pathname;

  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};