import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '../../../../lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // Explicitly set runtime

export async function POST(request: Request) {
  // First set the response headers
  const headers = {
    'Content-Type': 'application/json',
  }

  try {
    // Parse the request body
    const body = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and name are required' }),
        { status: 400, headers }
      )
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toString().toLowerCase() },
    })

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 409, headers }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.toString(), 12)

    // Create user
    await prisma.user.create({
      data: {
        email: email.toString().toLowerCase(),
        name: name.toString(),
        password: hashedPassword,
      },
    })

    return new Response(
      JSON.stringify({ success: true, message: 'User created successfully' }),
      { status: 201, headers }
    )

  } catch (error: any) {
    console.error('Signup error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { status: 500, headers }
    )
  }
}