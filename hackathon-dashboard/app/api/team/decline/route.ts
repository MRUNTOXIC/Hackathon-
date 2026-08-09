import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { declineInvitation } from '@/lib/backend/controllers/teamController';
import connectDB from '@/lib/backend/db';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { invitationId } = await req.json();
    const data = await declineInvitation(user._id, invitationId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
