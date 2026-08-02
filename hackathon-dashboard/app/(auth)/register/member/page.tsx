'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Users } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  registrationNumber: z.string().length(9, 'Registration number must be exactly 9 digits').regex(/^\d{9}$/, 'Only digits allowed'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  department: z.string().min(2, 'Department required'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterMemberPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await registerUser('/auth/register-member', data as unknown as Record<string, string>);
      router.push('/dashboard');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Full Error:", err);
        console.error("Response:", err.response);
        console.error("Data:", err.response?.data);
        console.error("Status:", err.response?.status);
        console.error("Message:", err.message);
        setError(err.response?.data?.message || err.message || 'Registration failed');
      } else {
        console.error("Unexpected error:", err);
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8 animate-fadein">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Join as Member</h1>
        <p className="text-slate-400 text-sm mt-1">Register and wait for a team invitation</p>
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
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
            <Input label="Registration No." placeholder="240102107" error={errors.registrationNumber?.message} {...register('registrationNumber')} />
          </div>
          <Input label="College Email" type="email" placeholder="jane@college.edu" error={errors.email?.message} {...register('email')} />
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
          <Button type="submit" loading={isSubmitting} className="w-full mt-2">Register</Button>
        </form>
      </div>

      <p className="text-center text-slate-500 text-sm mt-6">
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300">← Back to options</Link>
      </p>
    </div>
  );
}
