'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Announcement } from '@/types';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import { Megaphone, Clock } from 'lucide-react';

const priorityStyles = {
  high: 'border-red-500/30 bg-red-500/5',
  medium: 'border-yellow-500/30 bg-yellow-500/5',
  low: 'border-green-500/30 bg-green-500/5',
};
const priorityBadge = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/announcements').then(({ data }) => setAnnouncements(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="Announcements" />
      <div className="p-6 space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)
        ) : announcements.length === 0 ? (
          <GlassCard className="text-center py-16">
            <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No announcements yet</p>
          </GlassCard>
        ) : (
          announcements.map((a, i) => (
            <div key={a._id}
              className={`glass rounded-2xl p-5 border animate-fadein ${priorityStyles[a.priority]}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{a.title}</h3>
                  <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{a.content}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${priorityBadge[a.priority]}`}>
                  {a.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
