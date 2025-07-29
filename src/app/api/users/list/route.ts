import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/prisma';
import { authOptions } from '@/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.user_role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      user_role: true,
      credits: true,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(users);
} 