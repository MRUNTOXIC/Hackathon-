'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Routes that should never trigger a redirect to /login
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
];

const isPublicPath = (path: string) =>
  PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'));

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Never redirect away from auth/public pages
    if (isPublicPath(pathname)) return;
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router, pathname]);

  // Fallback timeout — only redirect if not on a public path
  useEffect(() => {
    if (isPublicPath(pathname)) return;
    if (loading) {
      const timer = setTimeout(() => {
        if (loading && !user) {
          console.warn('ProtectedRoute: Loading timed out, redirecting to login');
          router.replace('/login');
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [loading, user, router, pathname]);

  // On public paths, always render children — no protection needed
  if (isPublicPath(pathname)) return <>{children}</>;

  // user from cache renders immediately, no spinner flash
  if (!user && loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );

  if (!user) return null;
  return <>{children}</>;
}
