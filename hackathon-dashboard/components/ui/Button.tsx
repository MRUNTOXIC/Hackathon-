'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
}

const variants = {
  primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20',
  ghost: 'border border-white/10 hover:border-cyan-500/50 hover:bg-white/5 text-slate-300',
  danger: 'bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400',
};

export default function Button({ children, loading, variant = 'primary', className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
