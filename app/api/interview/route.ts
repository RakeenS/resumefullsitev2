import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize OpenAI with error handling
let openai: OpenAI;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
}

export async function POST(req: Request) {
  console.log('Interview API called');
  try {
    // Check if OpenAI is properly initialized
    if (!openai) {
      console.error('OpenAI client not initialized');
      return new NextResponse('OpenAI configuration error', { status: 500 });
    }

    console.log('Checking authentication');
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('Unauthorized request - no session');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Session found:', session.user.email);

    const body = await req.json();
    console.log('Received request body:', body);

    const { industry, position, currentQuestion, userAnswer, isFirstQuestion } = body;

    // Validate required fields
    if (!industry || !position) {
      console.error('Missing required fields:', { industry, position });
      return new NextResponse('Missing required fields', { status: 400 });
    }

    let prompt;
    if (isFirstQuestion) {
      prompt = `You are an experienced interviewer conducting a job interview for a ${position} position in the ${industry} industry.

Your task is to generate a relevant first interview question.

CRITICAL: You must respond with ONLY a JSON object in this exact format, no other text:
{
  "question": "your interview question here"
}

Example response:
{
  "question": "Can you tell me about your experience with Python programming?"
}`;
    } else {
      if (!currentQuestion || !userAnswer) {
        console.error('Missing required fields for follow-up:', { currentQuestion, userAnswer });
        return new NextResponse('Missing required fields for follow-up', { status: 400 });
      }

      prompt = `You are an experienced interviewer conducting a job interview for a ${position} position in the ${industry} industry.

Previous question: "${currentQuestion}"
Candidate's answer: "${userAnswer}"

Your task is to evaluate the answer and provide the next question.

CRITICAL: You must respond with ONLY a JSON object in this exact format, no other text:
{
  "feedback": "detailed feedback about the answer",
  "score": "score out of 10 based on the quality of the answer",
  "nextQuestion": "your next interview question"
}

Example response:
{
  "feedback": "Your answer demonstrated good understanding of the concept...",
  "score": 8,
  "nextQuestion": "How would you handle error cases in this scenario?"
}`;
    }

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a JSON-only response generator. You must ONLY output valid JSON objects exactly matching the requested format. Never include any other text, markdown, or explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    console.log('OpenAI response:', response.choices[0].message.content);

    if (!response.choices[0].message.content) {
      console.error('Empty response from OpenAI');
      return new NextResponse('Failed to generate interview content', { status: 500 });
    }

    let result;
    try {
      const content = response.choices[0].message.content.trim();
      // Remove any potential markdown code block markers
      const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      result = JSON.parse(jsonStr);
      
      // Validate the response format
      if (isFirstQuestion && !result.question) {
        throw new Error('Response missing question field');
      } else if (!isFirstQuestion && (!result.feedback || !result.score || !result.nextQuestion)) {
        throw new Error('Response missing required fields');
      }

      // Ensure score is a number between 0 and 10
      if (!isFirstQuestion) {
        result.score = Number(result.score);
        if (isNaN(result.score) || result.score < 0 || result.score > 10) {
          throw new Error('Invalid score value');
        }
      }
      
      console.log('Parsed result:', result);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      return new NextResponse('Invalid response format from AI', { status: 500 });
    }

    return new NextResponse(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Interview API error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal error',
      { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }
}
