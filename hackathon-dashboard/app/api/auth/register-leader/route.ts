import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import { registerLeader } from '@/lib/backend/controllers/authController';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const result = await registerLeader(body);

    const response = NextResponse.json(result, { status: 201 });
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: false, // Disabled for mobile access over local IP (HTTP)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
