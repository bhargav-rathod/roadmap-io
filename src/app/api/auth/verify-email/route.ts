import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/auth/verification-failed', request.url))
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date() // Check if token is not expired
        }
      }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/verification-failed', request.url))
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      }
    })

    return NextResponse.redirect(new URL('/auth/verification-success', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/auth/verification-failed', request.url))
  }
}