'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Team } from '@/types';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, UserMinus, UserPlus, Crown, Hash, Cpu, Trophy } from 'lucide-react';

const inviteSchema = z.object({ email: z.string().email('Valid email required') });
type InviteForm = z.infer<typeof inviteSchema>;

export default function TeamPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviteError, setInviteError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  });

  const load = async () => {
    try {
      const { data } = await api.get('/team');
      setTeam(data);
    } catch {
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onInvite = async (data: InviteForm) => {
    try {
      setInviteError('');
      setInviteMsg('');
      await api.post('/team/invite', data);
      setInviteMsg('Invitation sent successfully!');
      reset();
    } catch (err: any) {
      setInviteError(err.response?.data?.message || 'Failed to send invitation');
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('Remove this member?')) return;
    await api.post('/team/remove', { memberId });
    load();
  };

  const isLeader = user?.role === 'leader';

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="Team" />
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <LoadingSkeleton key={i} className="h-32" />)}</div>
        ) : !team ? (
          <GlassCard>
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">
                {isLeader ? 'Team not found' : 'No Team Yet'}
              </p>
              <p className="text-slate-400 text-sm">
                {isLeader ? 'Something went wrong. Please contact support.' : 'Wait for a team leader to invite you.'}
              </p>
            </div>
          </GlassCard>
        ) : (
          <>
            {/* Team Info */}
            <GlassCard className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: 'Team Name', value: team.teamName, icon: Trophy, color: 'text-cyan-400' },
                  { label: 'Team Number', value: team.teamNumber, icon: Hash, color: 'text-blue-400' },
                  { label: 'Project Track', value: team.projectTrack, icon: Cpu, color: 'text-purple-400' },
                  { label: 'Status', value: team.status, icon: Users, color: 'text-green-400' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                    <p className={`text-sm font-semibold capitalize ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Members */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Members ({team.members.length})</h3>
                {team.members.length === 1 && isLeader && (
                  <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
                    Solo
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {team.members.map((m) => (
                  <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                      {m.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.email} · {m.registrationNumber}</p>
                    </div>
                    {team.leaderId._id === m._id ? (
                      <span className="flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        <Crown className="w-3 h-3" /> Leader
                      </span>
                    ) : isLeader && (
                      <Button variant="danger" className="text-xs px-3 py-1.5" onClick={() => removeMember(m._id)}>
                        <UserMinus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Invite — only for leaders */}
            {isLeader && (
              <GlassCard>
                <div className="flex items-center gap-2 mb-4">
                  <UserPlus className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">Invite Member</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">Enter the college email of a registered participant to invite them.</p>
                <form onSubmit={handleSubmit(onInvite)} className="flex gap-3">
                  <div className="flex-1">
                    <Input placeholder="member@college.edu" error={errors.email?.message} {...register('email')} />
                  </div>
                  <Button type="submit" loading={isSubmitting}>Send Invite</Button>
                </form>
                {inviteMsg && <p className="text-sm text-green-400 mt-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">{inviteMsg}</p>}
                {inviteError && <p className="text-sm text-red-400 mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{inviteError}</p>}
              </GlassCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}
