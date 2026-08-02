'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Megaphone, Trash2, Plus } from 'lucide-react';
import api from '@/lib/api';
import { getAdminToken } from '@/context/AdminContext';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AdminNavbar from '@/components/AdminNavbar';

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  content: z.string().min(5, 'Content required'),
  priority: z.enum(['low', 'medium', 'high']),
});
type FormData = z.infer<typeof schema>;

const priorityStyles: Record<string, string> = {
  high: 'border-red-500/30 bg-red-500/5 text-red-400',
  medium: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
  low: 'border-green-500/30 bg-green-500/5 text-green-400',
};

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const headers = { Authorization: `Bearer ${getAdminToken()}` };

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' },
  });

  const load = async () => {
    const { data } = await api.get('/admin/announcements', { headers });
    setAnnouncements(data);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: FormData) => {
    await api.post('/admin/announcements', data, { headers });
    reset();
    load();
  };

  const deleteAnn = async (id: string) => {
    if (!confirm('Delete announcement?')) return;
    await api.delete(`/admin/announcements/${id}`, { headers });
    load();
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminNavbar title="Announcements" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Broadcast Center</h2>
          <p className="text-slate-400 text-sm mt-1">Send updates to all participants</p>
        </div>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Create Announcement</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Title" placeholder="Important Update" error={errors.title?.message} {...register('title')} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400 font-medium">Content</label>
              <textarea {...register('content')} rows={3} placeholder="Announcement details..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all resize-none" />
              {errors.content && <p className="text-xs text-red-400">{errors.content.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400 font-medium">Priority</label>
              <select {...register('priority')}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/60 transition-all">
                <option value="low" className="bg-[#0a0f2e]">Low</option>
                <option value="medium" className="bg-[#0a0f2e]">Medium</option>
                <option value="high" className="bg-[#0a0f2e]">High</option>
              </select>
            </div>
            <Button type="submit" loading={isSubmitting}>Post Announcement</Button>
          </form>
        </GlassCard>

        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a._id} className={`glass rounded-2xl p-5 border flex items-start justify-between gap-4 animate-fadein ${priorityStyles[a.priority]}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Megaphone className="w-4 h-4" />
                  <p className="font-semibold text-white">{a.title}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 capitalize">{a.priority}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{a.content}</p>
                <p className="text-xs text-slate-500 mt-2">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => deleteAnn(a._id)}
                className="p-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-all flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {announcements.length === 0 && (
            <GlassCard className="text-center py-12">
              <Megaphone className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">No announcements yet</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
