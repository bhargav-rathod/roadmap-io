import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import prisma from '../lib/prisma';

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function validateSession(sessionToken: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      sessionToken: true,
      lastActive: true
    }
  });

  if (!user || user.sessionToken !== sessionToken) {
    return false;
  }

  // Check inactivity (10 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  const lastActive = user.lastActive ? Math.floor(user.lastActive.getTime() / 1000) : 0;
  
  if (currentTime - lastActive > 600) { // 10 minutes in seconds
    return false;
  }

  return true;
}