import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import { deleteAnnouncement } from '@/lib/backend/controllers/adminController';
import connectDB from '@/lib/backend/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
  try {
    await connectDB();
    const result = await deleteAnnouncement(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
