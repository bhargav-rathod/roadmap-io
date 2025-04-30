// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(request.url);
    
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
    // Clear all auth cookies
    response.cookies.set({
      name: 'next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    response.cookies.set({
      name: '__Secure-next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
    });

    return response;

  } catch (error) {
    const url = new URL(request.url);
    return NextResponse.redirect(new URL('/login?logout=error', url.origin));
  }
}