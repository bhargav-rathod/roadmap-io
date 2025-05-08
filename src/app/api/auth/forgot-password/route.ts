import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendPasswordResetEmail } from "../../../../lib/email";
import { generateToken } from "../../../../lib/utils";

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
      // For security, don't reveal if user doesn't exist
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = generateToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Send password reset email using Resend
    await sendPasswordResetEmail(user.email, user.name || "User", resetToken);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { details: error.stack })
      },
      { status: 500 }
    );
  }
}