import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    // Parse the resume content
    const resume = JSON.parse(content);

    // For now, just return the same content
    // TODO: Implement AI optimization when ready
    return new NextResponse(JSON.stringify(resume), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resume optimization error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to optimize resume' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
