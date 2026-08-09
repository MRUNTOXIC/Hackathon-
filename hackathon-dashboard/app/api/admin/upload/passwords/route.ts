import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import { uploadPasswords } from '@/lib/backend/controllers/adminController';
import connectDB from '@/lib/backend/db';

export async function POST(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    const data = await uploadPasswords(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
