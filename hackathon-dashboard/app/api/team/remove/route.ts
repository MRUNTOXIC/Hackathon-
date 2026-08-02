import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { removeMember } from '@/lib/backend/controllers/teamController';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!user.teamId) return NextResponse.json({ message: 'Not in a team' }, { status: 400 });

  try {
    const { memberId } = await req.json();
    const data = await removeMember(user._id, user.teamId, memberId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
