import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, role, company } = await req.json();

    const prompt = `As an expert resume writer, enhance the following job experience description for a ${role} position at ${company}. 
    Make it more impactful by:
    1. Using strong action verbs
    2. Quantifying achievements where possible
    3. Highlighting specific skills and technologies
    4. Focusing on results and impact
    5. Keeping it concise and professional
    6. Making it ATS-friendly

    Original text:
    ${text}

    Please provide only the enhanced description without any additional commentary.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 200,
    });

    return NextResponse.json({
      optimizedText: completion.choices[0].message.content?.trim(),
    });
  } catch (error) {
    console.error('Error optimizing experience:', error);
    return NextResponse.json(
      { error: 'Failed to optimize experience description' },
      { status: 500 }
    );
  }
}
