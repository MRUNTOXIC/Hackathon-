import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/db';
import User from '@/lib/backend/models/User';
import OTP from '@/lib/backend/models/OTP';

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: 'Email, code and new password are required' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
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

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // The User model's pre-save hook will bcrypt this automatically
    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully. You can now log in.' }, { status: 200 });
  } catch (err: any) {
    console.error('reset-password error:', err?.message);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
