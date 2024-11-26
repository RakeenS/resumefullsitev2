import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function ensureResumesTableExists(supabase: any) {
  try {
    // Check if table exists
    const { error: queryError } = await supabase
      .from('resumes')
      .select('id')
      .limit(1);

    if (queryError && queryError.message.includes('does not exist')) {
      // Create table if it doesn't exist
      const { error: createError } = await supabase.rpc('create_resumes_table');
      if (createError) {
        console.error('Error creating resumes table:', createError);
        throw createError;
      }
    }
  } catch (error) {
    console.error('Error checking/creating resumes table:', error);
    // Continue anyway, as the table might already exist
  }
}

export async function POST(req: Request) {
  try {
    console.log('Starting resume parsing process...');

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.id);

    // Ensure resumes table exists
    await ensureResumesTableExists(supabase);

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No valid file provided');
      return NextResponse.json(
        { error: 'No valid file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (!file.type || (!file.type.toLowerCase().includes('pdf') && !file.type.toLowerCase().includes('application/pdf'))) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert file to text
    let text;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const textDecoder = new TextDecoder('utf-8');
      text = textDecoder.decode(arrayBuffer);
      console.log('File converted to text, length:', text.length);
    } catch (error) {
      console.error('File reading error:', error);
      return NextResponse.json(
        { error: 'Failed to read file content' },
        { status: 500 }
      );
    }

    // Use OpenAI to analyze the resume
    let formattedContent;
    try {
      console.log('Sending text to OpenAI...');
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that reads resumes. Format the resume content in a clean, readable way. Include sections for Personal Information, Work Experience, Education, and Skills. Make it easy to read."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.2,
      });

      formattedContent = completion.choices[0].message.content;
      console.log('Received formatted content from OpenAI');
    } catch (error: any) {
      console.error('OpenAI error:', error.response?.data || error);
      return NextResponse.json(
        { error: 'Failed to process resume content: ' + (error.message || 'Unknown error') },
        { status: 500 }
      );
    }

    console.log('Successfully processed resume');
    return NextResponse.json({
      success: true,
      resumeData: {
        fileName: file.name,
        content: formattedContent
      }
    });
  } catch (error: any) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
