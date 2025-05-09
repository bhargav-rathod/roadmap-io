import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  // Get auth status
const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user.id;

  try {
    if (key) {
      // Single key requested - now using findFirst since key is unique
      const config = await prisma.config.findFirst({
        where: { 
          key: key,
          isActive: true
        },
      });

      if (!config) {
        return NextResponse.json(
          { error: 'Config not found' },
          { status: 404 }
        );
      }

      if (config.isProtected && !isAuthenticated) {
        return NextResponse.json(
          { error: 'Unauthorized access to protected config' },
          { status: 403 }
        );
      }

      return NextResponse.json({ [config.key]: config.value });
    } else {
      // All configs requested
      const whereClause = isAuthenticated
        ? { isActive: true }
        : { isActive: true, isProtected: false };

      const configs = await prisma.config.findMany({
        where: whereClause,
      });

      const result = configs.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}