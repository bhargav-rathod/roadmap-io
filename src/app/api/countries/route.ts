// app/api/countries/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}