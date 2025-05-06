// users/add-credits/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/prisma';
import { authOptions } from '@/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, credits } = await req.json();

  // Verify the user making the request is the same as the user getting credits
  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Update user's credits
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: parseInt(credits)
      }
    }
  });

  return NextResponse.json({ credits: updatedUser.credits });
}