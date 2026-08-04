'use client';
import { useEffect, useState } from 'react';
import { UserCheck, Search, Users, Calendar, Filter } from 'lucide-react';
import api from '@/lib/api';
import { getAdminToken } from '@/context/AdminContext';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import AdminNavbar from '@/components/AdminNavbar';

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRound, setFilterRound] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = { Authorization: `Bearer ${getAdminToken()}` };
        const [recRes, statRes] = await Promise.all([
          api.get('/attendance', { headers }),
          api.get('/attendance/stats', { headers })
        ]);
        setRecords(recRes.data);
        setStats(statRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = records.filter(r => {
    const userName = r.user?.name || '';
    const regNum = r.user?.registrationNumber || '';
    const matchesSearch =
      userName.toLowerCase().includes(search.toLowerCase()) ||
      regNum.toLowerCase().includes(search.toLowerCase());
    const matchesRound = filterRound === 'All' || r.round === filterRound;
    return matchesSearch && matchesRound;
  });

  const rounds = ['All', 'Registration', 'Round 1', 'Round 2'];

  return (
    <div className="flex flex-col flex-1">
      <AdminNavbar title="Attendance" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Attendance Logs</h2>
            <p className="text-slate-400 text-sm mt-1">Live tracking of participant presence</p>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => <LoadingSkeleton key={i} className="h-24" />)
        ) : (
          ['Registration', 'Round 1', 'Round 2'].map(r => {
            const count = stats.find(s => s._id === r)?.count || 0;
            return (
              <GlassCard key={r}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{r}</p>
                    <p className="text-xl font-bold text-white">{count}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name or registration number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 w-full"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filterRound}
            onChange={(e) => setFilterRound(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none outline-none"
          >
            {rounds.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden border-white/5 !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-semibold">Participant</th>
                <th className="px-6 py-4 font-semibold">Reg Number</th>
                <th className="px-6 py-4 font-semibold">Round</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4"><LoadingSkeleton className="h-6 w-full" /></td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r._id} className="text-sm hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{r.user?.name || 'Unknown User'}</p>
                        <p className="text-xs text-slate-500">{r.user?.department || r.user || '—'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono">{r.user?.registrationNumber || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-medium">
                        {r.round}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-emerald-400 capitalize">{r.status}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    No attendance records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
    </div>
  );
}
