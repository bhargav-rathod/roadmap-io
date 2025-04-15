import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';
import { generateRoadmap } from '../../../lib/openai';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(roadmaps);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { userId, ...roadmapData } = data;

  try {
    // Create roadmap in DB
    const roadmap = await prisma.roadmap.create({
      data: {
        ...roadmapData,
        userId: session.user.id,
        status: 'processing',
      },
    });

    // Trigger async processing
    generateRoadmap(roadmap.id);

    return NextResponse.json({ id: roadmap.id });
  } catch (error) {
    console.error('Failed to create roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to create roadmap' },
      { status: 500 }
    );
  }
}