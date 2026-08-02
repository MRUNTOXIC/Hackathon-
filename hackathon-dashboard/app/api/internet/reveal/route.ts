import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { revealPassword } from '@/lib/backend/controllers/internetController';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = await revealPassword(user._id, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
