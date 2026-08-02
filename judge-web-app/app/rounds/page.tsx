'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Trophy, Settings, LogOut } from 'lucide-react';

export default function RoundSelection() {
  const [judgeName, setJudgeName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('judge_name');
    if (!name) router.replace('/');
    else setJudgeName(name);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('judge_name');
    router.replace('/');
  };

  const rounds = [
    {
      id: 'Round 1',
      label: 'Round 1 Review',
      desc: 'Initial presentation and idea validation',
      icon: Zap,
      color: 'from-cyan-500/20 to-cyan-600/20',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400'
    },
    {
      id: 'Round 2',
      label: 'Round 2 Review',
      desc: 'Final prototype and technical depth',
      icon: Trophy,
      color: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400'
    }
  ];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            <img src="/icons/logo.svg" alt="logo" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Active Judge</p>
            <h2 className="text-lg font-bold text-white truncate max-w-[150px]">{judgeName}</h2>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Select Phase</h3>
        <p className="text-slate-400 text-sm">Choose which round you are currently evaluating</p>
      </div>

      <div className="grid gap-4">
        {rounds.map((round, i) => (
          <motion.button
            key={round.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => router.push(`/rounds/${round.id.replace(' ', '-').toLowerCase()}`)}
            className={`group text-left p-6 rounded-3xl bg-gradient-to-br border ${round.color} ${round.border} hover:scale-[1.02] active:scale-[0.98] transition-all`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${round.text}`}>
                  <round.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{round.label}</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{round.desc}</p>
                </div>
              </div>
              <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${round.text}`}>
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
          <Settings className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase tracking-wider">Evaluation Config</p>
          <p className="text-[10px] text-slate-500">v1.0.4 · 6-Parameter Model</p>
        </div>
      </div>
    </div>
  );
}
