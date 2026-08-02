'use client';
import Link from 'next/link';
import { Crown, Users, Zap } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10 animate-fadein">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">HackDash</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-slate-400">Choose how you want to participate</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadein">
        <Link href="/register/leader">
          <div className="glass-strong rounded-2xl p-8 cursor-pointer group hover:border-cyan-500/40 transition-all h-full">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Crown className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Register Team</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Create a new team, become the leader, and invite members to join your project.
            </p>
            <div className="mt-5 flex items-center gap-2 text-cyan-400 text-sm font-medium">
              Get started <span>→</span>
            </div>
          </div>
        </Link>

        <Link href="/register/member">
          <div className="glass-strong rounded-2xl p-8 cursor-pointer group hover:border-blue-500/40 transition-all h-full">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Join Existing Team</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Register as a participant and wait for a team leader to invite you.
            </p>
            <div className="mt-5 flex items-center gap-2 text-blue-400 text-sm font-medium">
              Register now <span>→</span>
            </div>
          </div>
        </Link>
      </div>

      <p className="text-center text-slate-500 text-sm mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
