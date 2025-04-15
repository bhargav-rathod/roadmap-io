import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookie } from './src/lib/cookies'

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"],
};