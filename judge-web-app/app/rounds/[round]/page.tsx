'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Users2, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function TeamList() {
  const params = useParams();
  const router = useRouter();
  const roundRaw = params.round as string;
  const roundName = roundRaw.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await axios.get('/api/teams');
        setTeams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
    const interval = setInterval(fetchTeams, 60000); // Auto-refresh team list every minute
    return () => clearInterval(interval);
  }, []);

  const filteredTeams = teams.filter(t =>
    t.teamName.toLowerCase().includes(search.toLowerCase()) ||
    t.teamNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="p-6 pb-2 space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/rounds')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white leading-none">{roundName}</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Select a team to review</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
          />
        </div>
      </header>

      <div className="flex-1 p-6 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading Teams...</p>
          </div>
        ) : filteredTeams.length > 0 ? (
          filteredTeams.map((team, i) => (
            <motion.button
              key={team._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/rounds/${roundRaw}/${team._id}`)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
                  {team.teamNumber}
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{team.teamName}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{team.projectTrack}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </motion.button>
          ))
        ) : (
          <div className="text-center py-20">
            <Users2 className="w-12 h-12 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">No teams found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
