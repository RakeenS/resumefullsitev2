import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const prompt = `As a professional resume writer, rewrite the following professional summary to be more impactful and ATS-friendly. Focus on quantifiable achievements, industry-specific keywords, and clear value propositions. Maintain a professional tone and keep it concise:

${text}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer with years of experience in crafting ATS-friendly resumes that get results. Your goal is to help professionals present their experience in the most impactful way possible."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const optimizedText = completion.choices[0].message.content;

    return NextResponse.json({ optimizedText });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize text' },
      { status: 500 }
    );
  }
}
