import { ReactNode } from 'react';
import { AdminProvider } from '@/context/AdminContext';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
