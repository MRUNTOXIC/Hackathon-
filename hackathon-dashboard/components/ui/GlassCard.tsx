import { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassCard({ children, className = '', delay = 0 }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl p-6 animate-fadein ${className}`}
      style={{ animationDelay: `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
