'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Handle case where loading might get stuck
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        if (loading && !user) {
          console.warn('ProtectedRoute: Loading timed out, redirecting to login');
          router.replace('/login');
        }
      }, 10000); // 10s fallback timeout
      return () => clearTimeout(timer);
    }
  }, [loading, user, router]);

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
