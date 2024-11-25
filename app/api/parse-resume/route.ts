import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for pdf.js
const PDFJS_WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
if (typeof window === 'undefined') {
  // Server-side
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
} else {
  // Client-side
  pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + PDFJS_WORKER_URL;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractResumeData(text: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts structured information from resumes. Parse the resume text and return a JSON object with the following structure: { personalInfo: { name, email, phone, location, summary }, experience: [{ company, title, startDate, endDate, description }], education: [{ school, degree, field, graduationDate }], skills: [] }"
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('Error extracting resume data:', error);
    throw new Error('Failed to extract resume data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function POST(req: Request) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No valid file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type || (!file.type.toLowerCase().includes('pdf') && !file.type.toLowerCase().includes('application/pdf'))) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();

    try {
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      if (!fullText.trim()) {
        return NextResponse.json(
          { error: 'No text content found in PDF' },
          { status: 400 }
        );
      }

      // Create storage bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'resumes')) {
        const { error: bucketError } = await supabase.storage.createBucket('resumes', {
          public: false,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['application/pdf']
        });
        
        if (bucketError) {
          console.error('Bucket creation error:', bucketError);
          return NextResponse.json(
            { error: 'Failed to create storage bucket' },
            { status: 500 }
          );
        }
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload file to storage: ' + uploadError.message },
          { status: 500 }
        );
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Extract structured data using OpenAI
      let parsedData;
      try {
        parsedData = await extractResumeData(fullText);
      } catch (error) {
        console.error('Data extraction error:', error);
        return NextResponse.json(
          { error: 'Failed to extract resume data' },
          { status: 500 }
        );
      }

      // Save resume data in the database
      const { error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_url: publicUrl,
          file_type: file.type,
          parsed_data: parsedData,
          raw_text: fullText,
          status: 'completed'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: 'Failed to save resume data: ' + dbError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: publicUrl,
          lastModified: new Date(file.lastModified).toISOString(),
        },
        parsedData,
        preview: {
          text: fullText,
          pageCount: pdfDocument.numPages,
          info: {
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          }
        }
      });
    } catch (error) {
      console.error('PDF processing error:', error);
      return NextResponse.json(
        { error: 'Failed to process PDF: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
