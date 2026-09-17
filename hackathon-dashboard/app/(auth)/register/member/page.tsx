'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import OtpInput from '@/components/ui/OtpInput';
import { Users, Mail, RefreshCw } from 'lucide-react';

// ── Step 1 schema: just email ─────────────────────────────────────────────
const emailSchema = z.object({
  email: z.string().email('Valid email required'),
});
type EmailData = z.infer<typeof emailSchema>;

// ── Step 2 schema: full registration form ────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, 'Name required'),
  registrationNumber: z
    .string()
    .length(11, 'Registration number must be exactly 11 digits')
    .regex(/^\d{11}$/, 'Only digits allowed'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  department: z.string().min(2, 'Department required'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterMemberPage() {
  const router = useRouter();
  const { sendRegOtp, verifyRegOtp, register: registerUser } = useAuth();

  type Step = 'email' | 'otp' | 'form';
  const [step, setStep] = useState<Step>('email');
  const [pendingEmail, setPendingEmail] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [error, setError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  const startCooldown = () => {
    setCooldown(60);
    cooldownRef.current = setInterval(() => {
      setCooldown((p) => { if (p <= 1) { clearInterval(cooldownRef.current!); return 0; } return p - 1; });
    }, 1000);
  };

  // ── Step 1: send OTP ────────────────────────────────────────────────────
  const {
    register: regEmail,
    handleSubmit: handleEmail,
    formState: { errors: emailErrors, isSubmitting: emailSubmitting },
  } = useForm<EmailData>({ resolver: zodResolver(emailSchema) });

  const onEmailSubmit = async (data: EmailData) => {
    try {
      setError('');
      await sendRegOtp(data.email.trim().toLowerCase());
      setPendingEmail(data.email.trim().toLowerCase());
      setStep('otp');
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const onResend = async () => {
    if (cooldown > 0) return;
    try {
      setError('');
      await sendRegOtp(pendingEmail);
      setOtpCode('');
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  // ── Step 2: verify OTP ──────────────────────────────────────────────────
  const onVerifyOtp = async () => {
    if (otpCode.length !== 6) { setError('Enter the full 6-digit code'); return; }
    setOtpLoading(true);
    setError('');
    try {
      const token = await verifyRegOtp(pendingEmail, otpCode);
      setVerifiedToken(token);
      setStep('form');
    } catch (err: any) {
      setError('Wrong OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Step 3: full form ───────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onRegisterSubmit = async (data: RegisterData) => {
    try {
      setError('');
      await registerUser('/auth/register-member', {
        ...(data as unknown as Record<string, string>),
        email: pendingEmail,
        verifiedToken,
      });
      router.push('/dashboard');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8 animate-fadein">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">
          {step === 'form' ? 'Complete Registration' : 'Join as Member'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {step === 'email' && 'First, verify your email'}
          {step === 'otp' && <>Code sent to <span className="text-cyan-400 font-medium">{pendingEmail}</span></>}
          {step === 'form' && 'Register and wait for a team invitation'}
        </p>
      </div>

      <div className="glass-strong rounded-2xl p-8 animate-fadein">

        {/* ── Step 1: Email ── */}
        {step === 'email' && (
          <form onSubmit={(e) => { e.preventDefault(); handleEmail(onEmailSubmit)(e); }} noValidate className="space-y-4">
            <Input
              label="College Email"
              type="email"
              placeholder="you@college.edu"
              error={emailErrors.email?.message}
              {...regEmail('email')}
            />
            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
            <Button type="submit" loading={emailSubmitting} className="w-full mt-2">
              Send Verification Code
            </Button>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 pb-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Mail className="w-7 h-7 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Enter the 6-digit code from your email.&nbsp;
                <span className="text-slate-400">Expires in 10 minutes.</span>
              </p>
            </div>

            <OtpInput onChange={setOtpCode} />

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">
                {error}
              </p>
            )}

            <Button onClick={onVerifyOtp} loading={otpLoading} className="w-full">
              Verify Email
            </Button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); }}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Change email
              </button>
              <button
                type="button"
                onClick={onResend}
                disabled={cooldown > 0}
                className="flex items-center gap-1 text-sm text-cyan-500 hover:text-cyan-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Full Form ── */}
        {step === 'form' && (
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(onRegisterSubmit)(e); }}
            method="POST"
            noValidate
            className="space-y-4"
          >
            {/* Verified email badge */}
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-green-300 text-sm font-medium">{pendingEmail}</span>
              <span className="text-green-500 text-xs ml-auto">verified</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
              <Input label="Registration No." placeholder="16219424088" error={errors.registrationNumber?.message} {...register('registrationNumber')} />
            </div>
            <Input label="Phone Number" placeholder="+91 9876543210" error={errors.phone?.message} {...register('phone')} />
            <Input label="Department" placeholder="Computer Science" error={errors.department?.message} {...register('department')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
              <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-blue-300">
              After registration, you&apos;ll receive an invitation from a team leader.
            </div>

            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              Register
            </Button>
          </form>
        )}
      </div>

      <p className="text-center text-slate-500 text-sm mt-6">
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300">← Back to options</Link>
      </p>
    </div>
  );
}
