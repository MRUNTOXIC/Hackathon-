'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Submission } from '@/types';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { GitBranch, ExternalLink, FileText, CheckCircle } from 'lucide-react';

const schema = z.object({
  github: z.string().url('Valid GitHub URL required'),
  demo: z.string().url('Valid URL').or(z.literal('')),
  presentation: z.string().url('Valid URL').or(z.literal('')),
  description: z.string().min(20, 'Min 20 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SubmissionPage() {
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.get('/submission').then(({ data }) => {
      setSubmission(data);
      if (data) reset(data);
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    const res = await api.post('/submission', data);
    setSubmission(res.data);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const isLeader = user?.role === 'leader';

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="Project Submission" />
      <div className="p-6 max-w-2xl">
        {submission && !isLeader && (
          <GlassCard className="mb-6 bg-green-500/5 border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Submitted Project</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'GitHub', value: submission.github, icon: GitBranch },
                { label: 'Demo', value: submission.demo, icon: ExternalLink },
                { label: 'Presentation', value: submission.presentation, icon: FileText },
              ].filter(({ value }) => value).map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">{label}:</span>
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">{value}</a>
                </div>
              ))}
              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-300">{submission.description}</p>
              </div>
            </div>
          </GlassCard>
        )}

        {isLeader && (
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white">{submission ? 'Update Submission' : 'Submit Project'}</h3>
            </div>

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2 animate-fadein">
                <CheckCircle className="w-4 h-4" /> Project submitted successfully!
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="GitHub Repository URL" placeholder="https://github.com/team/project" error={errors.github?.message} {...register('github')} />
              <Input label="Demo Link (optional)" placeholder="https://demo.example.com" error={errors.demo?.message} {...register('demo')} />
              <Input label="Presentation PDF URL (optional)" placeholder="https://drive.google.com/..." error={errors.presentation?.message} {...register('presentation')} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-400 font-medium">Project Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe your project, tech stack, and key features..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all resize-none"
                />
                {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
              </div>
              <Button type="submit" loading={isSubmitting} className="w-full">
                {submission ? 'Update Submission' : 'Submit Project'}
              </Button>
            </form>
          </GlassCard>
        )}

        {!isLeader && !submission && !loading && (
          <GlassCard className="text-center py-12">
            <GitBranch className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No submission yet. Your team leader will submit the project.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
