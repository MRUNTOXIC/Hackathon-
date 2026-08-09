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
const TOKEN_KEY = 'adminToken';

/** Decode a JWT payload without verifying the signature (client-side only). */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns true if the token exists, has role=admin, and is not expired. */
function isTokenValid(token: string): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  if (payload.role !== 'admin') return false;
  if (payload.exp && Date.now() / 1000 > payload.exp) return false;
  return true;
}

/** Resolve initial admin state synchronously from localStorage. */
function resolveInitialAdmin(): { admin: Admin | null; loading: false } {
  if (typeof window === 'undefined') {
    return { admin: null, loading: false };
  }
  try {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    const cached = localStorage.getItem(CACHE_KEY);
    if (token && isTokenValid(token) && cached) {
      return { admin: JSON.parse(cached), loading: false };
    }
  } catch {}
  return { admin: null, loading: false };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  // Initialise state synchronously — no loading spinner needed
  const [admin, setAdmin] = useState<Admin | null>(() => resolveInitialAdmin().admin);
  const [loading, setLoading] = useState(false); // always starts false — no async check

  const setAndCache = (a: Admin | null) => {
    setAdmin(a);
    if (a) localStorage.setItem(CACHE_KEY, JSON.stringify(a));
    else localStorage.removeItem(CACHE_KEY);
  };

  const login = async (username: string, password: string) => {
    const { data } = await api.post('/admin/login', { username, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setAndCache(data.admin);
  };

  const logout = async () => {
    try {
      await api.post('/admin/logout');
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    setAndCache(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(TOKEN_KEY) || '';
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
