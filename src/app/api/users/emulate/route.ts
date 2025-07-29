import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/prisma';
import { authOptions } from '@/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.user_role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      user_role: true,
      credits: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
} 