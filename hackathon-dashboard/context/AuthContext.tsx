'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Standard login (no OTP)
  login: (email: string, password: string) => Promise<void>;
  register: (endpoint: string, payload: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  // Registration OTP — verify email before account creation
  sendRegOtp: (email: string) => Promise<void>;
  verifyRegOtp: (email: string, code: string) => Promise<string>; // returns a short-lived verified token
  // Forgot / reset password
  sendResetOtp: (email: string) => Promise<void>;
  verifyResetOtp: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
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
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Auth refresh timeout')), 8000)
    );
    try {
      const { data } = await Promise.race([api.get('/auth/me'), timeout]) as any;
      setAndCache(data);
    } catch (err: any) {
      console.warn('Auth refresh failed or timed out:', err.message);
      if (err.response?.status === 401) setAndCache(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) { setUser(JSON.parse(cached)); setLoading(false); }
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

  // ── Registration OTP ──────────────────────────────────────────────────────
  /** Step 1: send a verification OTP to the email (must not already be registered) */
  const sendRegOtp = async (email: string) => {
    await api.post('/auth/send-reg-otp', { email });
  };

  /** Step 2: verify the OTP — server returns a short-lived verifiedToken the register route checks */
  const verifyRegOtp = async (email: string, code: string): Promise<string> => {
    const { data } = await api.post('/auth/verify-reg-otp', { email, code });
    return data.verifiedToken as string;
  };

  // ── Forgot / Reset password ───────────────────────────────────────────────
  /** Send a reset OTP to a registered email */
  const sendResetOtp = async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  };

  /** Check a reset OTP is correct without consuming it */
  const verifyResetOtp = async (email: string, code: string) => {
    await api.post('/auth/verify-reset-otp', { email, code });
  };

  /** Verify OTP + set new password in one call */
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    await api.post('/auth/reset-password', { email, code, newPassword });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, sendRegOtp, verifyRegOtp, sendResetOtp, verifyResetOtp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
