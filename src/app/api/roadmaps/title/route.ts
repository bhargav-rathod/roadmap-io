import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roadmapId = searchParams.get('id');

  if (!roadmapId) {
    return NextResponse.json(
      { error: 'Roadmap ID is required' },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: {
        id: roadmapId,
        userId: session.user.id // Ensure user owns the roadmap
      },
      select: {
        title: true
      }
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ title: roadmap.title });
  } catch (error) {
    console.error('Error fetching roadmap title:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}