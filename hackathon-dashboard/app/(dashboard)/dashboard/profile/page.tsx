'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { User } from '@/types';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User as UserIcon, CheckCircle } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  department: z.string().min(2),
  year: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.get('/dashboard/profile').then(({ data }) => {
      if (data) {
        setProfile(data);
        reset({
          name: data.name || '',
          phone: data.phone || '',
          department: data.department || '',
          year: data.year || ''
        });
      }
    });
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    const { data: updatedProfile } = await api.put('/dashboard/profile', data);
    setProfile(updatedProfile);
    await refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="Profile" />
      <div className="p-6 max-w-lg">
        <GlassCard>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 capitalize mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            {[
              { label: 'Registration No.', value: profile?.registrationNumber },
              { label: 'Email', value: profile?.email },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm p-3 rounded-xl bg-white/3">
                <span className="text-slate-500">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2 animate-fadein">
              <CheckCircle className="w-4 h-4" /> Profile updated!
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" error={errors.name?.message} {...register('name')} />
            <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
            <Input label="Department" error={errors.department?.message} {...register('department')} />
            <Input label="Year" placeholder="1st / 2nd / 3rd / 4th" error={errors.year?.message} {...register('year')} />
            <Button type="submit" loading={isSubmitting} className="w-full">Save Changes</Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
