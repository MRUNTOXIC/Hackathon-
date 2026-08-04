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
import { Crown } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  registrationNumber: z.string().length(11, 'Registration number must be exactly 11 digits').regex(/^\d{11}$/, 'Only digits allowed'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
  teamName: z.string().min(2, 'Team name required'),
  projectTrack: z.string().min(2, 'Project track required'),
  problemStatement: z.string().min(20, 'Please describe in at least 2 sentences (min 20 characters)'),
  department: z.string().min(2, 'Department required'),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;
const tracks = ['AI/ML', 'Web Development', 'Mobile App', 'Blockchain', 'IoT', 'Cybersecurity', 'Open Innovation'];

export default function RegisterLeaderPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await registerUser('/auth/register-leader', data as unknown as Record<string, string>);
      router.push('/dashboard');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Full Error:", err);
        console.error("Response:", err.response);
        console.error("Data:", err.response?.data);
        console.error("Status:", err.response?.status);
        console.error("Message:", err.message);
        const message = err.response?.data?.message || err.message || 'Registration failed';
        setError(message === 'Email already registered'
          ? 'This email is already registered. Please use another email or log in instead.'
          : message);
      } else {
        console.error("Unexpected error:", err);
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8 animate-fadein">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-6 h-6 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Register Team</h1>
        <p className="text-slate-400 text-sm mt-1">Create your team and become the leader</p>
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
            <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
            <Input label="Registration No." placeholder="16219424088" error={errors.registrationNumber?.message} {...register('registrationNumber')} />
          </div>
          <Input label="College Email" type="email" placeholder="john@college.edu" error={errors.email?.message} {...register('email')} />
          <Input label="Phone Number" placeholder="+91 9876543210" error={errors.phone?.message} {...register('phone')} />
          <Input label="Department" placeholder="Computer Science" error={errors.department?.message} {...register('department')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          </div>
          <Input label="Team Name" placeholder="Team Nexus" error={errors.teamName?.message} {...register('teamName')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-400 font-medium">Project Track</label>
            <select
              {...register('projectTrack')}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/60 transition-all"
            >
              <option value="" className="bg-[#0a0f2e]">Select track</option>
              {tracks.map((t) => <option key={t} value={t} className="bg-[#0a0f2e]">{t}</option>)}
            </select>
            {errors.projectTrack && <p className="text-xs text-red-400">{errors.projectTrack.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-400 font-medium">Problem Statement</label>
            <textarea
              {...register('problemStatement')}
              placeholder="Describe your project problem statement in at least 2 sentences..."
              rows={3}
              className={`bg-white/5 border ${errors.problemStatement ? 'border-red-500/60' : 'border-white/10'} rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all resize-none`}
            />
            {errors.problemStatement && <p className="text-xs text-red-400">{errors.problemStatement.message}</p>}
          </div>

          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full mt-2">Create Team & Register</Button>
        </form>
      </div>

      <p className="text-center text-slate-500 text-sm mt-6">
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300">← Back to options</Link>
      </p>
    </div>
  );
}
