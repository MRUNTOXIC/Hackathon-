'use client';
import { useEffect, useState } from 'react';
import { Star, MessageSquare, Trophy, Search, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { getAdminToken } from '@/context/AdminContext';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { JudgeScore } from '@/types';
import AdminNavbar from '@/components/AdminNavbar';

export default function JudgeReviewsPage() {
  const [reviews, setReviews] = useState<JudgeScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const headers = { Authorization: `Bearer ${getAdminToken()}` };

  const loadReviews = async () => {
    try {
      const { data } = await api.get('/judge', { headers });
      setReviews(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/admin/judge/${id}`, { headers });
      loadReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(r => {
    const team = r.team as any;
    return (
      team?.teamName?.toLowerCase().includes(search.toLowerCase()) ||
      r.judgeName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col flex-1">
      <AdminNavbar title="Judge Reviews" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Judge Evaluations</h2>
            <p className="text-slate-400 text-sm mt-1">{reviews.length} total reviews</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team or judge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/50 w-full"
            />
          </div>
        </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-32" />)}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.map((review) => {
            const team = review.team as any;
            const avgScore = Object.values(review.scores).reduce((a, b) => a + b, 0) / Object.keys(review.scores).length;

            return (
              <GlassCard key={review._id} className="animate-fadein border-white/5">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Side: Basic Info */}
                  <div className="md:w-1/4 space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Team</p>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-cyan-400" />
                        <p className="font-bold text-white">{team?.teamName || 'Unknown Team'}</p>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">#{team?.teamNumber || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Judge</p>
                      <p className="text-sm text-white font-medium">{review.judgeName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Round</p>
                      <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-bold uppercase tracking-wider">
                        {review.round || 'Round 1'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Average Score</p>
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xl">
                        <Star className="w-5 h-5 fill-current" />
                        {avgScore.toFixed(1)}/10
                      </div>
                    </div>

                    <button
                      onClick={() => deleteReview(review._id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all w-fit"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Review
                    </button>
                  </div>

                  {/* Right Side: Detailed Scores & Comments */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(review.scores).map(([crit, val]) => (
                        <div key={crit} className="p-2 rounded-xl bg-white/3 border border-white/5">
                          <p className="text-[10px] text-slate-400 truncate mb-1">{crit}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{val}</span>
                            <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${val * 10}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {review.suggestions && (
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-3 h-3 text-purple-400" />
                            <p className="text-[10px] uppercase font-bold text-purple-400">Suggestions (Public)</p>
                          </div>
                          <p className="text-sm text-slate-300 italic">"{review.suggestions}"</p>
                        </div>
                      )}
                      {review.comments && (
                        <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-3 h-3 text-slate-400" />
                            <p className="text-[10px] uppercase font-bold text-slate-400">Private Comments</p>
                          </div>
                          <p className="text-sm text-slate-400 italic">"{review.comments}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {!loading && filteredReviews.length === 0 && (
        <GlassCard className="text-center py-12">
          <Star className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">No judge reviews found</p>
        </GlassCard>
      )}
    </div>
    </div>
  );
}
