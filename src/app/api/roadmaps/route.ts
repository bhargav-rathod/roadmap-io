import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';
import { OpenAI } from 'openai';

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
        countryRef: { select: { name: true } }
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
      companyOther,
      roleOther,
      ...roadmapData 
    } = await request.json();

    console.log('--->' + request.json());

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
      if(process.env.PUSH_OTHER_ENTRY_IN_DB === "true")
      {
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
    }

    // Handle "Other" role
    let roleName = roadmapData.role;
    if (roadmapData.role === 'Other' && roleOther) {
      roleName = roleOther;
      if(process.env.PUSH_OTHER_ENTRY_IN_DB === "true")
      {
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
    var prompt = "";
    if(roadmapData.roleType == "IT"){
      prompt = `Do a deep research and web search, and generate a detailed roadmap for ${roleName} at ${companyName} India with ${roadmapData.yearsOfExperience || 0} years experience. Give interview pattern and 150+ recently asked interview questions with detailed and accurate answers for the same role. Add 150+ recently asked DSA questions with solutions in programming language: ${language}). Also give 5 recent compensation package for this role.`;
      if(targetDuration > 0){
        prompt += "Target duration is: ${targetDuration} months.";
      }
    }
    else{
      prompt = `Do a deep research and web search, and generate a detailed roadmap for ${roleName} at ${companyName} with ${roadmapData.yearsOfExperience || 0} years experience. Target duration is: ${targetDuration} months. Give interview pattern and 150+ recently asked interview questions with detailed and accurate answers for the same role. Also give 5 recent compensation package for this role.`;

    }
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
        isFresher: roadmapData.isFresher || false,
        yearsOfExperience: roadmapData.yearsOfExperience,
        monthsOfExperience: roadmapData.monthsOfExperience,
        programmingLanguage: language || null,
        targetDuration: targetDuration || null,
        includeSimilarCompanies: roadmapData.includeSimilarCompanies || false,
        includeCompensationData: roadmapData.includeCompensationData || false,
        includeOtherDetails: roadmapData.includeOtherDetails || false,
        otherDetails: roadmapData.otherDetails,
        content,
        userId: session.user.id,
        expiresAt,
      },
    });

    // Deduct credit and get updated user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    });

    return NextResponse.json({
      roadmap,
      updatedCredits: updatedUser.credits
    });

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

    try {
      const response = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert career counselor who generates detailed, actionable roadmaps for users based on their career goals.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
  
      console.log(response);
      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No content received from OpenAI');
      
      return content.trim();
    } catch (error: any) {
      console.error('Error generating roadmap content:', error);
      throw new Error('Failed to generate roadmap content');
    }
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1', // Important!
  });

  