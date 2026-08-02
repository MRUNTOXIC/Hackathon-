import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { inviteMember } from '@/lib/backend/controllers/teamController';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (!user.teamId) return NextResponse.json({ message: 'You are not in a team' }, { status: 400 });

  try {
    const { email } = await req.json();
    const data = await inviteMember(user._id, user.teamId, email);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
