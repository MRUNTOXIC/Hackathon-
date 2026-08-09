import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncements } from '@/lib/backend/controllers/announcementController';
import connectDB from '@/lib/backend/db';

export async function GET(req: NextRequest) {
  try {
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('Announcements route falling back because DB connection failed:', dbError);
    }

    const data = await getAnnouncements();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
