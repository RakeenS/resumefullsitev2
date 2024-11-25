import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { name, jobDescription, jobUrl } = await req.json();

    if (!name || !jobDescription) {
      return NextResponse.json(
        { error: 'Name and job description are required' },
        { status: 400 }
      );
    }

    const prompt = `Write a professional cover letter for ${name} based on the following job description:
    
${jobDescription}

${jobUrl ? `Job posting URL: ${jobUrl}` : ''}

The cover letter should:
1. Be professionally formatted
2. Highlight relevant skills and experiences that match the job requirements
3. Show enthusiasm for the role and company
4. Be concise but compelling
5. Include a strong opening and closing
6. Not exceed one page

Please write the cover letter in a professional business format with proper spacing and paragraphs.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional cover letter writer with expertise in creating compelling, personalized cover letters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({ coverLetter: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
