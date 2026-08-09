'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import { ReactNode } from 'react';

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { isOpen, close } = useSidebar();
  return (
    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar isOpen={isOpen} onClose={close} />
      <main className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
