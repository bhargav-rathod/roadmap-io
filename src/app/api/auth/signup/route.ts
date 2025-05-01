import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '../../../../lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '../../../../lib/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and name are required' }),
        { status: 400, headers }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toString().toLowerCase() },
    })

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 409, headers }
      )
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 12)
    const verificationToken = uuidv4()
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    const user = await prisma.user.create({
      data: {
        email: email.toString().toLowerCase(),
        name: name.toString(),
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        verified: false,
      },
    })

    // Send verification email
    await sendVerificationEmail(user.email, user.name ?? "", verificationToken)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User created successfully. Please check your email to verify your account. (If you are unable to find the email in your Inbox, please check Spam folder as well.)' 
      }),
      { status: 201, headers }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { status: 500, headers }
    )
  }
}