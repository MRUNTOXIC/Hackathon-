import { NextRequest, NextResponse } from 'next/server';
import { getJudgeTeams } from '@/lib/backend/controllers/judgeController';
import connectDB from '@/lib/backend/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const judgeName = searchParams.get('judgeName') || undefined;

  try {
    await connectDB();
    const data = await getJudgeTeams(judgeName);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
