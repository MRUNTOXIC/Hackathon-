'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Wifi, Eye, EyeOff, Copy, Check } from 'lucide-react';


const schema = z.object({ password: z.string().min(1, 'Password required') });
type FormData = z.infer<typeof schema>;

export default function InternetPage() {
  const [internetId, setInternetId] = useState('');
  const [revealedPassword, setRevealedPassword] = useState('');
  const [showReveal, setShowReveal] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.get('/internet').then(({ data }) => setInternetId(data.internetId));
  }, []);

  const onReveal = async (data: FormData) => {
    try {
      setError('');
      const res = await api.post('/internet/reveal', data);
      setRevealedPassword(res.data.internetPassword);
      setShowReveal(false);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Incorrect password');
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="Internet Credentials" />
      <div className="p-6 max-w-lg">
        <GlassCard>
          <div className="flex items-center gap-2 mb-6">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Your Internet Credentials</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/3 border border-white/5">
              <p className="text-xs text-slate-500 mb-1">Internet ID</p>
              <div className="flex items-center justify-between">
                <p className="text-white font-mono font-medium">{internetId || '—'}</p>
                <button onClick={() => copy(internetId)} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/3 border border-white/5">
              <p className="text-xs text-slate-500 mb-1">Internet Password</p>
              {revealedPassword ? (
                <div className="flex items-center justify-between animate-fadein">
                  <p className="text-white font-mono font-medium">{revealedPassword}</p>
                  <div className="flex gap-2">
                    <button onClick={() => copy(revealedPassword)} className="text-slate-400 hover:text-cyan-400 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => setRevealedPassword('')} className="text-slate-400 hover:text-red-400 transition-colors">
                      <EyeOff className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 font-mono">••••••••••••</p>
                  <button onClick={() => setShowReveal(true)} className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    <Eye className="w-4 h-4" /> Reveal
                  </button>
                </div>
              )}
            </div>
          </div>

          {showReveal && (
              <div className="mt-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 animate-fadein">
                <p className="text-sm text-slate-300 mb-3">Enter your login password to reveal</p>
                <form onSubmit={handleSubmit(onReveal)} className="flex gap-3">
                  <div className="flex-1">
                    <Input type="password" placeholder="Your password" error={errors.password?.message} {...register('password')} />
                  </div>
                  <Button type="submit" loading={isSubmitting}>Verify</Button>
                </form>
                {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
              </div>
            )}
        </GlassCard>
      </div>
    </div>
  );
}
