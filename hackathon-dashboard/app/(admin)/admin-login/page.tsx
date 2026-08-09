'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const schema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await login(data.username, data.password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050816]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#0a0f2e] to-[#050816]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-sm animate-fadein">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Hackathon Management</p>
        </div>
        <div className="glass-strong rounded-2xl p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            method="POST"
            noValidate
            className="space-y-4"
          >
            <Input label="Username" placeholder="admin" error={errors.username?.message} {...register('username')} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
            <Button type="submit" loading={isSubmitting} className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500">
              Sign In as Admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
