import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import prisma from './src/lib/prisma';

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    // Check session validity on each request
    const token = await getToken({ req });
    
    if (token) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            sessionToken: true,
            lastActive: true
          }
        });

        if (!user || user.sessionToken !== token.sessionToken) {
          // Invalidate session
          await prisma.user.update({
            where: { id: token.id as string },
            data: {
              sessionToken: null,
              lastActive: null
            }
          });
          return NextResponse.redirect(new URL('/login?error=SessionInvalid', req.url));
        }

        // Check inactivity (10 minutes)
        const currentTime = Math.floor(Date.now() / 1000);
        const lastActive = user.lastActive ? Math.floor(user.lastActive.getTime() / 1000) : 0;
        
        if (currentTime - lastActive > 600) { // 10 minutes in seconds
          // Invalidate session
          await prisma.user.update({
            where: { id: token.id as string },
            data: {
              sessionToken: null,
              lastActive: null
            }
          });
          return NextResponse.redirect(new URL('/login?error=SessionExpired', req.url));
        }

        // Update last active time if more than 1 minute has passed
        if (currentTime - lastActive > 60) {
          await prisma.user.update({
            where: { id: token.id as string },
            data: {
              lastActive: new Date()
            }
          });
        }
      } catch (error) {
        console.error('Session validation error:', error);
        return NextResponse.redirect(new URL('/login?error=SessionError', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This is just a placeholder, actual auth is handled in the function above
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     * - public folders
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|images|icons|fonts).*)',
    '/dashboard/:path*'
  ],
};