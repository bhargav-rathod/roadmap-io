import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

interface Company {
  name: string;
}

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(companies.map((c: Company) => c.name));
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}