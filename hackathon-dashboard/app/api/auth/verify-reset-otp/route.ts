import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import OTP from '@/lib/backend/models/OTP';

/**
 * Validates a reset OTP without consuming it.
 * The actual consumption happens in /api/auth/reset-password.
 * This lets the UI verify the code before showing the new-password step.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ message: 'Email and code are required' }, { status: 400 });
    }

    await connectDB();

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase().trim(),
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.code !== code.trim()) {
      return NextResponse.json({ message: 'Wrong OTP' }, { status: 401 });
    }

    return NextResponse.json({ message: 'OTP verified' }, { status: 200 });
  } catch (err: any) {
    console.error('verify-reset-otp error:', err?.message);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
