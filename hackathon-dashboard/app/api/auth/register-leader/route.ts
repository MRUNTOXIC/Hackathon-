import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import { registerLeader } from '@/lib/backend/controllers/authController';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Require a verified email token issued by /api/auth/verify-reg-otp
    const JWT_SECRET = process.env.JWT_SECRET || 'atlas_only_secret_2026_hackathon';
    const { verifiedToken, ...rest } = body;

    if (!verifiedToken) {
      return NextResponse.json({ message: 'Email verification required. Please verify your email first.' }, { status: 403 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(verifiedToken, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: 'Email verification token is invalid or expired. Please verify your email again.' }, { status: 403 });
    }

    if (decoded.purpose !== 'registration') {
      return NextResponse.json({ message: 'Invalid verification token.' }, { status: 403 });
    }

    // Make sure the token email matches the submitted email
    if (decoded.emailVerified !== rest.email?.toLowerCase().trim()) {
      return NextResponse.json({ message: 'Verified email does not match the submitted email.' }, { status: 403 });
    }

    const result = await registerLeader(rest);

    const response = NextResponse.json(result, { status: 201 });
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
