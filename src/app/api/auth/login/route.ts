// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

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

    const response = NextResponse.json({ success: true });
    return response;

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