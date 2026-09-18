'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import OtpInput, { OtpInputHandle } from '@/components/ui/OtpInput';
import { KeyRound, Mail, RefreshCw, CheckCircle } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Valid email required'),
});
type EmailData = z.infer<typeof emailSchema>;

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type PasswordData = z.infer<typeof passwordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { sendResetOtp, verifyResetOtp, resetPassword } = useAuth();

  type Step = 'email' | 'otp' | 'newpassword' | 'done';
  const [step, setStep] = useState<Step>('email');
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const otpRef = useRef<OtpInputHandle>(null);
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

  // ── Step 1: Email ──────────────────────────────────────────────────────
  const {
    register: regEmail,
    handleSubmit: handleEmail,
    formState: { errors: emailErrors, isSubmitting: emailSubmitting },
  } = useForm<EmailData>({ resolver: zodResolver(emailSchema) });

  const onEmailSubmit = async (data: EmailData) => {
    try {
      setError('');
      await sendResetOtp(data.email.trim().toLowerCase());
      setPendingEmail(data.email.trim().toLowerCase());
      setStep('otp');
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    }
  };

  const onResend = async () => {
    if (cooldown > 0) return;
    try {
      setError('');
      await sendResetOtp(pendingEmail);
      otpRef.current?.reset();
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────
  const onVerifyOtp = async () => {
    if (otpCode.length !== 6) { setError('Enter the full 6-digit code'); return; }
    setError('');
    setOtpLoading(true);
    try {
      await verifyResetOtp(pendingEmail, otpCode);
      setStep('newpassword');
    } catch {
      setError('Incorrect OTP. Please re-enter.');
      otpRef.current?.reset();
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Step 3: New password ───────────────────────────────────────────────
  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onPasswordSubmit = async (data: PasswordData) => {
    try {
      setError('');
      await resetPassword(pendingEmail, otpCode, data.newPassword);
      setStep('done');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
      // If OTP was wrong / expired, send them back to OTP step
      if (err.response?.status === 401) setStep('otp');
    }
  };

  // ── Heading helpers ────────────────────────────────────────────────────
  const headings: Record<Step, { title: string; sub: React.ReactNode }> = {
    email: { title: 'Forgot password?', sub: "Enter your email and we'll send a reset code" },
    otp: { title: 'Check your email', sub: <>Code sent to <span className="text-cyan-400 font-medium">{pendingEmail}</span></> },
    newpassword: { title: 'Set new password', sub: 'Choose a strong password for your account' },
    done: { title: 'Password reset!', sub: 'You can now sign in with your new password' },
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8 animate-fadein">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
          {step === 'done'
            ? <CheckCircle className="w-6 h-6 text-green-400" />
            : <KeyRound className="w-6 h-6 text-cyan-400" />
          }
        </div>
        <h1 className="text-2xl font-bold text-white">{headings[step].title}</h1>
        <p className="text-slate-400 text-sm mt-1">{headings[step].sub}</p>
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
              Send Reset Code
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

            <OtpInput ref={otpRef} onChange={setOtpCode} />

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">
                {error}
              </p>
            )}

            <Button onClick={onVerifyOtp} loading={otpLoading} className="w-full">
              Continue
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

        {/* ── Step 3: New Password ── */}
        {step === 'newpassword' && (
          <form onSubmit={(e) => { e.preventDefault(); handlePwd(onPasswordSubmit)(e); }} noValidate className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={pwdErrors.newPassword?.message}
              {...regPwd('newPassword')}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={pwdErrors.confirmPassword?.message}
              {...regPwd('confirmPassword')}
            />
            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
            <Button type="submit" loading={pwdSubmitting} className="w-full mt-2">
              Reset Password
            </Button>
          </form>
        )}

        {/* ── Step 4: Done ── */}
        {step === 'done' && (
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-slate-300 text-sm text-center">
              Your password has been updated. You can now sign in.
            </p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </div>
        )}
      </div>

      {step !== 'done' && (
        <p className="text-center text-slate-500 text-sm mt-6">
          Remember it?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
        </p>
      )}
    </div>
  );
}
