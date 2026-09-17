import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import OTP from '@/lib/backend/models/OTP';
import jwt from 'jsonwebtoken';

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

    if (!otpRecord) {
      return NextResponse.json(
        { message: 'OTP has expired or is invalid. Please request a new one.' },
        { status: 401 }
      );
    }

    if (otpRecord.code !== code.trim()) {
      return NextResponse.json({ message: 'Incorrect OTP code' }, { status: 401 });
    }

    // Mark as used
    otpRecord.used = true;
    await otpRecord.save();

    // Issue a short-lived "email verified" token the register routes will check
    const JWT_SECRET = process.env.JWT_SECRET || 'atlas_only_secret_2026_hackathon';
    const verifiedToken = jwt.sign(
      { emailVerified: email.toLowerCase().trim(), purpose: 'registration' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return NextResponse.json({ verifiedToken }, { status: 200 });
  } catch (err: any) {
    console.error('verify-reg-otp error:', err?.message);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
