'use client';
import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JudgeWelcome() {
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('judge_name');
    if (saved) {
      router.push('/rounds');
    }
  }, [router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('judge_name', name.trim());
      router.push('/rounds');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10 overflow-hidden">
            <img src="/icons/logo.svg" alt="logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Judge Portal</h1>
            <p className="text-slate-400 mt-2">Welcome to the evaluation panel</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Your Full Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Jane Doe"
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl px-6 py-4 text-lg outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            Start Evaluation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>

      <div className="mt-auto pt-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
          Hackathon Management System
        </p>
      </div>
    </div>
  );
}ß