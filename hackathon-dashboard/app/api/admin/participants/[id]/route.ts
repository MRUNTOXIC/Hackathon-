import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import { getParticipantById } from '@/lib/backend/controllers/adminController';
import connectDB from '@/lib/backend/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await connectDB();
    const data = await getParticipantById(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }
}
