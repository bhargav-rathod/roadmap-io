//app/api/generate/route

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: any) {
  const body = await req.json();
  const { prompt } = body;

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a career coach generating job preparation roadmaps.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return NextResponse.json({
    roadmap: chatResponse.choices[0].message.content,
  });
}
