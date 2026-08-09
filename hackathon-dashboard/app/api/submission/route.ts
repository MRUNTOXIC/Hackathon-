import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { getSubmission, submitProject } from '@/lib/backend/controllers/submissionController';
import connectDB from '@/lib/backend/db';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const data = await getSubmission(user.teamId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(null);
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    const data = await submitProject(user.teamId, body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
