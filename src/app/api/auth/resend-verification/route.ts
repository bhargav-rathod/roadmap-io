// app/api/auth/resend-verification/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendVerificationEmail } from "../../../../lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires
      }
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    return NextResponse.json({ 
      success: true,
      message: "Verification email resent"
    });

  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}