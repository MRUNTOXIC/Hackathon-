import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { getTeam } from '@/lib/backend/controllers/teamController';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const data = await getTeam(user.teamId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(null);
  }
}
