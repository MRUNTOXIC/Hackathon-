'use client';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  return (
    <div className="flex min-h-screen bg-[#050816]">
      <AdminSidebar isOpen={isOpen} onClose={close} />
      <main className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { admin } = useAdmin();
  const router = useRouter();
  // mounted ensures server and client render the same thing on first pass
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !admin) {
      router.replace('/admin-login');
    }
  }, [mounted, admin, router]);

  // Server render + first client render: both output the same spinner → no mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  // After mount: localStorage is readable, admin state is resolved
  if (!admin) return null;

  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}
