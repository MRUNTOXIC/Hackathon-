'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (endpoint: string, payload: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const CACHE_KEY = 'hd_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAndCache = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(CACHE_KEY, JSON.stringify(u));
    else localStorage.removeItem(CACHE_KEY);
  };

  const refresh = async () => {
    // Add a safety timeout to prevent getting stuck in loading state
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Auth refresh timeout')), 8000)
    );

    try {
      const { data } = await Promise.race([
        api.get('/auth/me'),
        timeout
      ]) as any;
      setAndCache(data);
    } catch (err: any) {
      console.warn('Auth refresh failed or timed out:', err.message);
      // Only clear cache if the error is definitely an auth failure (401)
      // This prevents logging out on transient network errors
      if (err.response?.status === 401) {
        setAndCache(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Read cache on client only after mount to avoid hydration mismatch
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setUser(JSON.parse(cached));
        setLoading(false); // We have a user, show UI immediately
      }
    } catch {}
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    await api.post('/auth/login', { email, password });
    await refresh();
  };

  const register = async (endpoint: string, payload: Record<string, string>) => {
    await api.post(endpoint, payload);
    await refresh();
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setAndCache(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
