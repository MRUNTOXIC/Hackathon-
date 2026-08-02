'use client';
import { useEffect, useState } from 'react';
import { Users, Users2, Crown, UserCheck } from 'lucide-react';
import api from '@/lib/api';
import { getAdminToken } from '@/context/AdminContext';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = () => {
      api.get('/admin/stats', { headers: { Authorization: `Bearer ${getAdminToken()}` } })
        .then(({ data }) => setStats(data))
        .catch(() => {});
    };

    loadStats();
    const interval = setInterval(loadStats, 60000); // Auto-refresh stats every minute
    return () => clearInterval(interval);
  }, []);

  const cards = stats ? [
    { label: 'Total Participants', value: stats.totalUsers, icon: Users, color: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/10 border-cyan-500/20' },
    { label: 'Total Teams', value: stats.totalTeams, icon: Users2, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-600/10 border-blue-500/20' },
    { label: 'Leaders', value: stats.totalLeaders, icon: Crown, color: 'text-yellow-400', bg: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20' },
    { label: 'Members', value: stats.totalMembers, icon: UserCheck, color: 'text-green-400', bg: 'from-green-500/10 to-green-600/10 border-green-500/20' },
  ] : [];

  return (
    <div className="flex flex-col flex-1">
      <AdminNavbar title="Overview" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Status</h2>
          <p className="text-slate-400 text-sm mt-1">Live hackathon statistics</p>
        </div>

      {!stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`glass rounded-2xl p-6 bg-gradient-to-br border animate-fadein ${bg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-xs mb-1">{label}</p>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </div>
                <Icon className={`w-6 h-6 ${color} opacity-60`} />
              </div>
            </div>
          ))}
        </div>
      )}

      <GlassCard>
        <h3 className="font-semibold text-white mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'View Participants', href: '/admin/participants', color: 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' },
            { label: 'View Teams', href: '/admin/teams', color: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' },
            { label: 'Announcements', href: '/admin/announcements', color: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10' },
            { label: 'Upload Passwords', href: '/admin/passwords', color: 'border-green-500/30 text-green-400 hover:bg-green-500/10' },
          ].map(({ label, href, color }) => (
            <a key={href} href={href} className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${color}`}>
              {label}
            </a>
          ))}
        </div>
      </GlassCard>
    </div>
    </div>
  );
}
