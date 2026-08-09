import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import { getStats } from '@/lib/backend/controllers/adminController';
import connectDB from '@/lib/backend/db';

export async function GET(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const data = await getStats();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
