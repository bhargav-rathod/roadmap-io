// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../../../lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json(
        { error: "Already logged in" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.verified) {
      // Generate new verification token if none exists or expired
      let verificationToken = user.verificationToken;
      let needsNewToken = false;
      
      if (!verificationToken || 
          (user.verificationTokenExpires && new Date() > user.verificationTokenExpires)) {
        verificationToken = require('crypto').randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            verificationToken,
            verificationTokenExpires
          }
        });
        
        needsNewToken = true;
      }

      // Send verification email if new token was generated
      if (needsNewToken) {
        await sendVerificationEmail(user.email, user.name, verificationToken);
      }

      return NextResponse.json(
        { 
          error: "Email not verified",
          unverified: true,
          email: user.email,
          resent: needsNewToken
        },
        { status: 403 }
      );
    }

    // If everything is valid, return success
    // (Actual authentication will be handled by NextAuth)
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}