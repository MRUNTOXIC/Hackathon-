'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { LayoutDashboard, Users, Users2, Megaphone, KeyRound, LogOut, Shield, Star, UserCheck, X } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/participants', label: 'Participants', icon: Users },
  { href: '/admin/teams', label: 'Teams', icon: Users2 },
  { href: '/admin/attendance', label: 'Attendance', icon: UserCheck },
  { href: '/admin/judge-reviews', label: 'Judge Reviews', icon: Star },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/passwords', label: 'Passwords', icon: KeyRound },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { admin, logout } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin-login');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 flex flex-col z-50 border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Admin Panel</p>
              <p className="text-xs text-red-400">{admin?.username}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => onClose()}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:translate-x-1 ${
                  active ? 'bg-gradient-to-r from-red-500/20 to-orange-600/20 text-red-400 border border-red-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
