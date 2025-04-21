// app/api/programmingLanguages/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const languages = await prisma.programmingLanguage.findMany({
      select: { name: true, type: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(languages);
  } catch (error) {
    console.error('Failed to fetch languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}