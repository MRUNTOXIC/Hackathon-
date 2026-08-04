'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

interface Admin { id: string; username: string; }
interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);
const CACHE_KEY = 'hd_admin';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const setAndCache = (a: Admin | null) => {
    setAdmin(a);
    if (a) localStorage.setItem(CACHE_KEY, JSON.stringify(a));
    else localStorage.removeItem(CACHE_KEY);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      // Add a safety timeout
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Admin check timeout')), 8000)
      );

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          setAdmin(JSON.parse(cached));
          setLoading(false); // Show admin UI immediately if cached
        }

        const token = getAdminToken();
        if (token) {
          // Verify token validity with a simple stats call
          await Promise.race([
            api.get('/admin/stats', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            timeout
          ]);
        } else {
          setAndCache(null);
        }
      } catch (err: any) {
        console.warn('Admin check failed or timed out:', err.message);
        // If auth failure, clear cache
        if (err.response?.status === 401) {
          setAndCache(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await api.post('/admin/login', { username, password });
    localStorage.setItem('adminToken', data.token);
    setAndCache(data.admin);
  };

  const logout = async () => {
    try {
        await api.post('/admin/logout');
    } catch {}
    localStorage.removeItem('adminToken');
    setAndCache(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function getAdminToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('adminToken') || '';
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
