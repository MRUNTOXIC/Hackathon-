'use client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { Settings, LogOut, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="Settings" />
      <div className="p-6 max-w-lg space-y-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Account</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Email', value: user?.email },
              { label: 'Role', value: user?.role },
              { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between p-3 rounded-xl bg-white/3">
                <span className="text-slate-500">{label}</span>
                <span className="text-white capitalize">{value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-white">Danger Zone</h3>
          </div>
          <Button variant="danger" onClick={logout} className="w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
