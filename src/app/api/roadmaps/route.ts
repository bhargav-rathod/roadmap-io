// app/api/roadmaps/route.ts
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

  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        companyRef: { select: { name: true } },
        roleRef: { select: { name: true } },
      },
    });
    return NextResponse.json(roadmaps);
  } catch (error) {
    console.error('Failed to fetch roadmaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roadmaps' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { language, ...roadmapData } = await request.json();

    // Validate required fields
    if (!roadmapData.roleType || !roadmapData.company || !roadmapData.role) {
      return NextResponse.json(
        { error: 'Role type, company, and role are required' },
        { status: 400 }
      );
    }

    // Ensure programming language exists
    if (language) {
      await prisma.programmingLanguage.upsert({
        where: { name: language },
        update: {},
        create: { 
          name: language, 
          type: roadmapData.roleType === 'Non-IT' ? 'Non-IT' : 'IT' 
        }
      });
    }

    // Create roadmap
    const roadmap = await prisma.roadmap.create({
      data: {
        ...roadmapData,
        programmingLanguage: language || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(roadmap);

  } catch (error: any) {
    console.error('Roadmap creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create roadmap',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}