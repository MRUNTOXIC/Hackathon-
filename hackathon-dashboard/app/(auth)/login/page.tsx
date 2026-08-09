'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Zap } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await login(data.email.trim().toLowerCase(), data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8 animate-fadein">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">HackDash</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-slate-400 text-sm mt-1">Sign in to your dashboard</p>
      </div>

      <div className="glass-strong rounded-2xl p-8 animate-fadein">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          method="POST"
          noValidate
          className="space-y-4"
        >
          <Input label="College Email" type="email" placeholder="you@college.edu" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full mt-2">Sign In</Button>
        </form>
      </div>

      <p className="text-center text-slate-500 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">Register</Link>
      </p>
    </div>
  );
}
