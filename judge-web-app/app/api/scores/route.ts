import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import JudgeScore from '@/lib/backend/models/JudgeScore';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { teamId, judgeName, scores, comments, suggestions, round } = body;

    if (!teamId || !judgeName || !scores || !round) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Prevent duplicate reviews for the same team in the same round
    const existing = await JudgeScore.findOne({ team: teamId, round });
    if (existing) {
      return NextResponse.json({
        message: `Team has already been reviewed for ${round} by ${existing.judgeName}`
      }, { status: 400 });
    }

    const scoreDoc = await JudgeScore.create({
      team: teamId,
      judgeName,
      scores,
      comments,
      suggestions,
      round
    });

    return NextResponse.json({ ok: true, id: scoreDoc._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
