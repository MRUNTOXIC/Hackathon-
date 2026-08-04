'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Team, Announcement, JudgeScore, Invitation } from '@/types';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { Users, Hash, Cpu, Trophy, Bell, Clock, Star, MessageSquare, Mail, UserPlus, X } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [judgeScores, setJudgeScores] = useState<JudgeScore[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [incomingInvitations, setIncomingInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [dashRes, annRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/announcements'),
      ]);
      setTeam(dashRes.data.team);
      setJudgeScores(dashRes.data.judgeScores || []);
      setPendingInvitations(dashRes.data.pendingInvitations || []);
      setIncomingInvitations(dashRes.data.incomingInvitations || []);
      setAnnouncements(annRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const respond = async (invitationId: string, action: 'accept' | 'decline') => {
    await api.post(`/team/${action}`, { invitationId });
    load();
  };

  const priorityColor = { high: 'text-red-400 bg-red-500/10 border-red-500/20', medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', low: 'text-green-400 bg-green-500/10 border-green-500/20' };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Navbar title="Main Dashboard" />
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome */}
        <GlassCard className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm">Welcome back,</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">{user?.name} 👋</h2>
              <p className="text-cyan-400 text-xs mt-1 capitalize">{user?.role} · {user?.registrationNumber}</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </GlassCard>

        {/* Problem Statement Quick View */}
        {team?.problemStatement && (
          <div className="animate-fadein">
            <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <MessageSquare className="w-16 h-16 text-cyan-400" />
               </div>
               <div className="relative z-10">
                 <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest mb-2">Project Problem Statement</p>
                 <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic">"{team.problemStatement}"</p>
               </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-28" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Team Name', value: team?.teamName || 'No Team', icon: Trophy, color: 'text-cyan-400' },
              { label: 'Team ID', value: team?.teamNumber || '—', icon: Hash, color: 'text-blue-400' },
              { label: 'Track', value: team?.projectTrack || '—', icon: Cpu, color: 'text-purple-400' },
              { label: 'Size', value: team?.members?.length ?? 0, icon: Users, color: 'text-green-400' },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <GlassCard key={label} delay={i * 0.05} className="!p-4 sm:!p-6">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">{label}</p>
                    <p className={`text-sm sm:text-lg font-bold truncate ${color}`}>{value}</p>
                  </div>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color} opacity-60 flex-shrink-0`} />
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Overview */}
          {team?.problemStatement && (
            <GlassCard delay={0.15} className="lg:col-span-2 bg-cyan-500/5 border-cyan-500/20">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Project Problem Statement</h3>
              </div>
              <p className="text-slate-300 leading-relaxed italic sm:text-lg">
                "{team.problemStatement}"
              </p>
            </GlassCard>
          )}

          {/* Team Members */}
          <GlassCard delay={0.2}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Team Members</h3>
              </div>
              {team && (
                <span className="text-xs text-slate-500">{team.members.length} Members</span>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <LoadingSkeleton key={i} className="h-12" />)}</div>
            ) : team?.members?.length ? (
              <div className="space-y-2">
                {team.members.map((m) => (
                  <div key={m._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {m.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{m.name}</p>
                      <p className="text-xs text-slate-500 truncate">{m.registrationNumber}</p>
                    </div>
                    {team.leaderId._id === m._id && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 font-bold uppercase tracking-wider">Leader</span>
                    )}
                  </div>
                ))}

                {/* Pending Members */}
                {pendingInvitations.map((inv) => (
                  <div key={inv._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/1 border border-dashed border-white/10 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                      {(inv.receiver as any).name?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-400 truncate">{(inv.receiver as any).name}</p>
                      <p className="text-xs text-slate-600 truncate">{(inv.receiver as any).registrationNumber}</p>
                    </div>
                    <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-0.5 rounded-full border border-white/5 font-bold uppercase tracking-wider">Pending</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-slate-500 text-sm mb-4">No team yet. Wait for an invitation or register as a leader.</p>

                {/* Incoming Invitations for students without a team */}
                {incomingInvitations.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Incoming Invitations</p>
                    </div>
                    {incomingInvitations.map((inv) => (
                      <div key={inv._id} className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-white">{inv.teamId.teamName}</p>
                            <p className="text-xs text-slate-400">From: {inv.sender.name}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => respond(inv._id, 'accept')}
                              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                              title="Accept"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => respond(inv._id, 'decline')}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Decline"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          {/* Announcements */}
          <GlassCard delay={0.25}>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Announcements</h3>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <LoadingSkeleton key={i} className="h-16" />)}</div>
            ) : announcements.length ? (
              <div className="space-y-3">
                {announcements.slice(0, 4).map((a) => (
                  <div key={a._id} className={`p-3 rounded-xl border ${priorityColor[a.priority]}`}>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs opacity-70 mt-0.5 line-clamp-2">{a.content}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs opacity-50">
                      <Clock className="w-3 h-3" />
                      {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No announcements yet.</p>
            )}
          </GlassCard>

          {/* Judge Feedback */}
          <GlassCard delay={0.3} className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">Judging Feedback & Scores</h3>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => <LoadingSkeleton key={i} className="h-32" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Round 1', 'Round 2'].map((roundName) => {
                  const score = judgeScores.find(s => s.round === roundName);

                  if (!score) {
                    return (
                      <div key={roundName} className="p-6 rounded-2xl bg-white/2 border border-dashed border-white/10 flex flex-col items-center justify-center text-center group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-purple-500/10 transition-colors">
                          <Clock className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">{roundName} Results</p>
                        <p className="text-xs text-slate-600 mt-1 uppercase tracking-widest font-bold italic">Pending Evaluation</p>
                      </div>
                    );
                  }

                  const avgScore = Object.values(score.scores).reduce((a, b) => a + b, 0) / Object.keys(score.scores).length;

                  return (
                    <div key={roundName} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all animate-fadein">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-bold uppercase tracking-wider mb-2 inline-block">
                            {roundName}
                          </span>
                          <p className="text-xs text-slate-500 mb-0.5">Judge</p>
                          <p className="text-sm font-bold text-white truncate max-w-[150px]">{score.judgeName}</p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <p className="text-xs text-slate-500 mb-1">Avg Score</p>
                          <div className="flex items-center gap-1 text-purple-400 font-bold text-lg">
                            <Star className="w-4 h-4 fill-current" />
                            {avgScore.toFixed(1)}/10
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {Object.entries(score.scores).map(([crit, val]) => (
                          <div key={crit} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tight">
                              <span className="text-slate-400 truncate pr-2">{crit}</span>
                              <span className="text-white">{val}</span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full bg-purple-500 transition-all" style={{ width: `${val * 10}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {score.suggestions && (
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-3 h-3 text-purple-400" />
                            <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Suggestions</p>
                          </div>
                          <p className="text-sm text-slate-300 italic">"{score.suggestions}"</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
