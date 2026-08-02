'use client';
import { useAdmin } from '@/context/AdminContext';
import { useSidebar } from '@/context/SidebarContext';
import { Bell, Menu, Shield } from 'lucide-react';

interface AdminNavbarProps {
  title: string;
}

export default function AdminNavbar({ title }: AdminNavbarProps) {
  const { admin } = useAdmin();
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-slate-300 hidden md:block truncate max-w-[100px]">{admin?.username}</span>
        </div>
      </div>
    </header>
  );
}
