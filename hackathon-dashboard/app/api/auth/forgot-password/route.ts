import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import User from '@/lib/backend/models/User';
import OTP from '@/lib/backend/models/OTP';
import { sendOtpEmail } from '@/lib/backend/utils/mailer';

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: 'Email is required' }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return 200 to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If that email is registered, a reset code has been sent.' }, { status: 200 });
    }

    // Invalidate old unused OTPs
    await OTP.updateMany(
      { email: email.toLowerCase().trim(), used: false },
      { $set: { used: true } }
    );

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OTP.create({ email: email.toLowerCase().trim(), code, expiresAt });

    try {
      await sendOtpEmail(user.email, code, user.name);
    } catch (mailErr: any) {
      console.error('Reset OTP email send failed:', mailErr?.message);
      return NextResponse.json({ message: 'Failed to send reset email. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ message: 'If that email is registered, a reset code has been sent.' }, { status: 200 });
  } catch (err: any) {
    console.error('forgot-password error:', err?.message);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
