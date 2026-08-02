import { NextRequest, NextResponse } from 'next/server';
import { markAttendance } from '@/lib/backend/controllers/attendanceController';
import connectDB from '@/lib/backend/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = await markAttendance(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
