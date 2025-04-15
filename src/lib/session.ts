import { NextResponse } from 'next/server';
import prisma from './prisma';
import { Session } from '@prisma/client';
import { randomBytes } from 'crypto';
import { createSetCookieHeader } from './cookies';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function directSignIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}

export async function createSession(userId: string) {
  const sessionToken = randomBytes(32).toString('hex');
  
  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  response.cookies.set({
    name: 'next-auth.session-token',
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
  
  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || new Date() > session.expires) {
    return null;
  }

  return session.user;
}

export async function destroySession() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

  if (sessionToken) {
    // Delete session from database
    await prisma.session.delete({
      where: { sessionToken }
    });
  }

  // Return response with cleared cookies
  const response = new NextResponse(null, { status: 200 });
  response.cookies.delete('next-auth.session-token');
  return response;
}