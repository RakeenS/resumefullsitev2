import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { jobInfo, stage, tone } = await req.json();

    // Validate input
    if (!jobInfo || !stage || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a prompt based on the job stage and tone
    const prompt = `Generate a professional email response for a job ${stage.replace('-', ' ')} with a ${tone} tone. 
    
Job Information:
${jobInfo}

Requirements:
1. The email should be professional and well-structured
2. Use a ${tone} tone throughout the email
3. Include appropriate greeting and closing
4. Keep the email concise but comprehensive
5. Include any relevant specific details from the job information
6. Maintain proper email etiquette
7. For follow-ups, express continued interest and enthusiasm
8. For interview follow-ups, include gratitude for the interviewer's time
9. For offer negotiations, be respectful and professional
10. For rejection responses, maintain professionalism and gratitude

Please generate the complete email response.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert in professional communication and job search correspondence. Your task is to generate appropriate email responses for various stages of the job application process."
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

    const email = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ email });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}
