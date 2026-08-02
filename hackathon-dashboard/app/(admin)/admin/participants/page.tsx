'use client';
import { useEffect, useState } from 'react';
import { Download, Search, Trash2, Users } from 'lucide-react';
import api from '@/lib/api';
import { getAdminToken } from '@/context/AdminContext';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import AdminNavbar from '@/components/AdminNavbar';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const headers = { Authorization: `Bearer ${getAdminToken()}` };

  const load = async () => {
    const { data } = await api.get('/admin/participants', { headers });
    setParticipants(data);
    setFiltered(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(participants.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.registrationNumber.toLowerCase().includes(q) ||
      (p.teamId?.teamName || '').toLowerCase().includes(q)
    ));
  }, [search, participants]);

  const downloadCSV = async () => {
    const res = await api.get('/admin/export/csv', { headers, responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`, { headers });
    load();
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminNavbar title="Participants" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">User Management</h2>
            <p className="text-slate-400 text-sm mt-1">{participants.length} registered</p>
          </div>
          <button onClick={downloadCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, reg. number or team..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none" />
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <LoadingSkeleton key={i} className="h-14" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-white/5">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Reg. No.</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Team</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-white/3 transition-all">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {p.name[0].toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 font-mono text-xs">{p.registrationNumber}</td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{p.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                        p.role === 'leader' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20' : 'bg-slate-500/20 text-slate-400 border-slate-500/20'
                      }`}>{p.role}</span>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{p.teamId?.teamName || '—'}</td>
                    <td className="py-3">
                      <button onClick={() => deleteUser(p._id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400">No participants found</p>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
    </div>
  );
}
