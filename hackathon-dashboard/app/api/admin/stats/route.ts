import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import { getStats } from '@/lib/backend/controllers/adminController';

export async function GET(req: NextRequest) {
  try {
    const data = await getStats();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
