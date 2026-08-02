'use client';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  const { admin } = useAdmin();

  if (!admin) return null;

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
  const { admin, loading } = useAdmin();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !loading && !admin) router.replace('/admin-login');
  }, [admin, loading, mounted, router]);

  if (!mounted) return null;

  if (loading && !admin)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );

  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}
