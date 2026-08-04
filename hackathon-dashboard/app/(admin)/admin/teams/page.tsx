'use client';
import { useEffect, useState } from 'react';
import { Users2, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import { getAdminToken } from '@/context/AdminContext';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import AdminNavbar from '@/components/AdminNavbar';

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/teams', { headers: { Authorization: `Bearer ${getAdminToken()}` } })
      .then(({ data }) => { setTeams(data); setLoading(false); });
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <AdminNavbar title="Teams" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team Overview</h2>
          <p className="text-slate-400 text-sm mt-1">{teams.length} teams registered</p>
        </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => (
            <div key={team._id} className="glass rounded-2xl overflow-hidden animate-fadein">
              <button onClick={() => setExpanded(expanded === team._id ? null : team._id)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                    <Users2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">{team.teamName}</p>
                    <p className="text-xs text-slate-400">{team.teamNumber} · {team.projectTrack}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                  </span>
                  {expanded === team._id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {expanded === team._id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                    <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest mb-1.5">Problem Statement</p>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      {team.problemStatement ? `"${team.problemStatement}"` : "No problem statement provided."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Team Members</p>
                    {team.members.map((m: any) => (
                    <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                        {m.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.email} · {m.registrationNumber}</p>
                      </div>
                      {team.leaderId._id === m._id && (
                        <span className="flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          <Crown className="w-3 h-3" /> Leader
                        </span>
                      )}
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && teams.length === 0 && (
        <GlassCard className="text-center py-12">
          <Users2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">No teams registered yet</p>
        </GlassCard>
      )}
    </div>
    </div>
  );
}
