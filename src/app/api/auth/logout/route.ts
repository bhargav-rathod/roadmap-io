import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(request.url);
    
    if (session?.user?.id) {
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id
        }
      });
    }

    const response = NextResponse.redirect(new URL('/login?logout=success', url.origin));
    
    // Clear all auth cookies
    response.cookies.set({
      name: 'next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    response.cookies.set({
      name: 'next-auth.callback-url',
      value: '',
      expires: new Date(0),
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    const url = new URL(request.url);
    return NextResponse.redirect(new URL('/login?logout=error', url.origin));
  }
}