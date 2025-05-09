import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  try {
    if (key) {
      // Single key requested
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

      // Only check auth for protected keys
      if (config.isProtected) {
        const session = await getServerSession(authOptions);
        const isAuthenticated = !!session?.user.id;
        
        if (!isAuthenticated) {
          return NextResponse.json(
            { error: 'Unauthorized access to protected config' },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({ [config.key]: config.value });
    } else {
      // All configs requested - public endpoint returns only non-protected
      const configs = await prisma.config.findMany({
        where: {
          isActive: true,
          isProtected: false
        },
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