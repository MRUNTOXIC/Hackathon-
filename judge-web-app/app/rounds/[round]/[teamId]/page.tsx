'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Star, MessageSquare, Heart, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

const PARAMETERS = [
  { id: 'creativity', label: 'Creativity & Innovation', desc: 'Originality and uniqueness of the solution' },
  { id: 'technical', label: 'Technical Implementation', desc: 'Complexity and quality of the execution' },
  { id: 'uiux', label: 'UI/UX Design', desc: 'Aesthetics, usability, and user experience' },
  { id: 'impact', label: 'Impact & Problem Solving', desc: 'Relevance and potential of the solution' },
  { id: 'functionality', label: 'Functionality & Completeness', desc: 'How well the prototype works' },
  { id: 'presentation', label: 'Presentation & Pitch', desc: 'Clarity and persuasiveness of the team' },
];

export default function EvaluationForm() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  const roundRaw = params.round as string;
  const roundName = roundRaw.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>(
    PARAMETERS.reduce((acc, p) => ({ ...acc, [p.id]: 5 }), {})
  );
  const [suggestions, setSuggestions] = useState('');
  const [comments, setComments] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/teams');
        const currentTeam = data.find((t: any) => t._id === teamId);
        setTeam(currentTeam);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  const handleScoreChange = (id: string, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const judgeName = localStorage.getItem('judge_name') || 'Anonymous Judge';
      await axios.post('/api/scores', {
        teamId,
        judgeName,
        round: roundName,
        scores,
        suggestions, // Public compliment
        comments,    // Private comments
      });
      setShowSuccess(true);
      // Wait for the animation to be seen before redirecting
      setTimeout(() => router.push(`/rounds/${roundRaw}`), 2500);
    } catch (err) {
      alert('Failed to submit scores. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Loading Form...</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 bg-[#050816]/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white leading-none truncate max-w-[150px]">{team?.teamName}</h2>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">{team?.teamNumber} · {roundName}</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
          <img src="/icons/logo.svg" alt="logo" className="w-6 h-6" />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-6 pb-24 space-y-8">
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scoring Parameters</h3>
          </div>

          {PARAMETERS.map((param) => (
            <div key={param.id} className="space-y-3 p-4 rounded-2xl bg-white/3 border border-white/5 transition-all focus-within:border-cyan-500/30">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-white">{param.label}</label>
                  <p className="text-[10px] text-slate-500">{param.desc}</p>
                </div>
                <span className="text-lg font-black text-cyan-400 font-mono">{scores[param.id]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={scores[param.id]}
                onChange={(e) => handleScoreChange(param.id, parseInt(e.target.value))}
                className="w-full h-1.5 accent-cyan-500"
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-700 uppercase tracking-tighter">
                <span>Novice</span>
                <span>Expert</span>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Public Compliment</h3>
          </div>
          <textarea
            placeholder="What did you like about this project? (Visible to the team)"
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-2xl p-4 text-sm min-h-[100px] outline-none transition-all placeholder:text-slate-700"
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-yellow-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Private Comments</h3>
          </div>
          <textarea
            placeholder="Internal notes for organizers only..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-yellow-500/50 rounded-2xl p-4 text-sm min-h-[100px] outline-none transition-all placeholder:text-slate-700"
          />
        </section>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050816] via-[#050816] to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Submit Evaluation
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050816]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-strong p-8 rounded-3xl text-center space-y-4 max-w-xs"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Scores Submitted!</h2>
              <p className="text-sm text-slate-400">Great job. Returning to the team list...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
