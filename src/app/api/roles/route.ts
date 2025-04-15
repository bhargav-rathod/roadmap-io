// app/api/roles/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      select: { name: true, type: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}