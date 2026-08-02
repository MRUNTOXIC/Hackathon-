import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import { markAttendance } from '@/lib/backend/controllers/adminController';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await markAttendance(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
