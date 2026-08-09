import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import Team from '@/lib/backend/models/Team';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const teams = await Team.find({}, 'teamName teamNumber projectTrack').sort({ teamNumber: 1 });
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
