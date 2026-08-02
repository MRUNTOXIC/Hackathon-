'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Invitation } from '@/types';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { Mail, Check, X, Clock } from 'lucide-react';

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/team/invitations');
      setInvitations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (invitationId: string, action: 'accept' | 'decline') => {
    await api.post(`/team/${action}`, { invitationId });
    load();
  };

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="Invitations" />
      <div className="p-6">
        <GlassCard>
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Pending Invitations</h3>
            {invitations.length > 0 && (
              <span className="ml-auto bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full border border-cyan-500/20">
                {invitations.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No pending invitations</p>
              <p className="text-slate-600 text-sm mt-1">Team leaders will invite you once you register</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((inv, i) => (
                <div key={inv._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all animate-fadein">
                  <div>
                    <p className="font-medium text-white">{inv.teamId.teamName}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {inv.teamId.teamNumber} · {inv.teamId.projectTrack}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Invited by {inv.sender.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" className="px-3 py-2" onClick={() => respond(inv._id, 'accept')}>
                      <Check className="w-4 h-4" /> Accept
                    </Button>
                    <Button variant="danger" className="px-3 py-2" onClick={() => respond(inv._id, 'decline')}>
                      <X className="w-4 h-4" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
