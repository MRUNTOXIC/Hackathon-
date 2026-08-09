import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { getDashboard } from '@/lib/backend/controllers/dashboardController';
import connectDB from '@/lib/backend/db';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const data = await getDashboard(user._id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({
      user: user || null,
      team: null,
      judgeScores: [],
      pendingInvitations: [],
      incomingInvitations: [],
    });
  }
}
