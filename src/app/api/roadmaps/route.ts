import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { 
        userId,
        expiresAt: { gt: new Date() } // Only non-expired roadmaps
      },
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

  // Check user credits
  if (session.user.credits <= 0) {
    return NextResponse.json(
      { error: 'Insufficient credits to create roadmap' },
      { status: 400 }
    );
  }

  try {
    const { 
      language, 
      targetDuration,
      companyOther, // Extract these from the request
      roleOther,
      ...roadmapData 
    } = await request.json();

    // Validate required fields
    if (!roadmapData.roleType || !roadmapData.company || !roadmapData.role) {
      return NextResponse.json(
        { error: 'Role type, company, and role are required' },
        { status: 400 }
      );
    }

    // Handle "Other" company
    let companyName = roadmapData.company;
    if (roadmapData.company === 'Other' && companyOther) {
      companyName = companyOther;
      // Create new company if it doesn't exist
      await prisma.company.upsert({
        where: { name: companyName },
        update: {},
        create: { 
          name: companyName, 
          type: roadmapData.roleType === 'Non-IT' ? 'Non-IT' : 'IT' 
        }
      });
    }

    // Handle "Other" role
    let roleName = roadmapData.role;
    if (roadmapData.role === 'Other' && roleOther) {
      roleName = roleOther;
      // Create new role if it doesn't exist
      await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { 
          name: roleName, 
          type: roadmapData.roleType === 'Non-IT' ? 'Non-IT' : 'IT' 
        }
      });
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

    // Generate content with OpenAI (simplified example)
    const prompt = `Create a roadmap for ${roleName} at ${companyName} with ${roadmapData.yearsOfExperience || 0} years experience. Target duration: ${targetDuration} months.`;
    const content = await generateRoadmapContent(prompt); // Implement this function

    // Calculate expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create roadmap - only include fields that exist in the schema
    const roadmap = await prisma.roadmap.create({
      data: {
        title: `${roleName} at ${companyName}`,
        roleType: roadmapData.roleType,
        company: companyName,
        role: roleName,
        yearsOfExperience: roadmapData.yearsOfExperience,
        monthsOfExperience: roadmapData.monthsOfExperience,
        programmingLanguage: language || null,
        targetDuration: targetDuration || '3',
        includeSimilarCompanies: roadmapData.includeSimilarCompanies || false,
        includeCompensationData: roadmapData.includeCompensationData || false,
        content,
        userId: session.user.id,
        expiresAt,
      },
    });

    // Deduct credit
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } }
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

async function generateRoadmapContent(prompt: string): Promise<string> {
  // Implement your OpenAI API call here
  return "Generated roadmap content based on the prompt";
}