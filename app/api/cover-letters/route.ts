import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Cover Letters API endpoint" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Cover letter creation endpoint", data: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}