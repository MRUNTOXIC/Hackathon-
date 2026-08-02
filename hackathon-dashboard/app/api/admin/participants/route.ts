import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import { getAllParticipants } from '@/lib/backend/controllers/adminController';

export async function GET(req: NextRequest) {
  try {
    const data = await getAllParticipants();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
