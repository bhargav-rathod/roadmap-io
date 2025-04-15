import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  try {
    // Test all models
    const companies = await prisma.company.findMany()
    const roles = await prisma.role.findMany()
    const roadmaps = await prisma.roadmap.findMany()

    return NextResponse.json({
      success: true,
      companies,
      roles, 
      roadmaps
    })
  } catch (error) {
    console.error('Prisma test error:', error)
    return NextResponse.json(
      { error: 'Prisma client not working properly' },
      { status: 500 }
    )
  }
}