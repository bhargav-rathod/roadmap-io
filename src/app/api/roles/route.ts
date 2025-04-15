import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

interface Role {
  name: string;
}

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(roles.map((r: Role) => r.name));
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}