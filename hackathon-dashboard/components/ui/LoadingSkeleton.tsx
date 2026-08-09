export default function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-white/5 rounded-xl animate-pulse ${className}`} />;
}
