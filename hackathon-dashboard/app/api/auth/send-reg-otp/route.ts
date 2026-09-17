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

    // Block if already registered
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { message: 'This email is already registered. Please log in instead.' },
        { status: 409 }
      );
    }

    // Invalidate previous unused OTPs for this email
    await OTP.updateMany(
      { email: email.toLowerCase().trim(), used: false },
      { $set: { used: true } }
    );

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OTP.create({ email: email.toLowerCase().trim(), code, expiresAt });

    try {
      await sendOtpEmail(email.toLowerCase().trim(), code, email.split('@')[0]);
    } catch (mailErr: any) {
      console.error('OTP email send failed:', mailErr?.message);
      return NextResponse.json({ message: 'Failed to send OTP email. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 });
  } catch (err: any) {
    console.error('send-reg-otp error:', err?.message);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
