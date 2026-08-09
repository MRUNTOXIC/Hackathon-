'use client';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { Bell, Menu } from 'lucide-react';

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { user } = useAuth();
  const { toggle } = useSidebar();

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-all hidden sm:block">
          <Bell className="w-5 h-5 text-slate-400" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-slate-300 hidden md:block truncate max-w-[100px]">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
