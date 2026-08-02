'use client';
import { useState, useRef } from 'react';
import { Upload, CheckCircle2, XCircle, KeyRound, FileText, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { getAdminToken } from '@/context/AdminContext';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import AdminNavbar from '@/components/AdminNavbar';

interface PasswordRow { registrationNumber: string; internetId: string; internetPassword: string; }
interface UploadResult { updated: number; notFound: string[]; total: number; }

function parseCSV(text: string): PasswordRow[] {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z]/g, ''));
  const regIdx = headers.findIndex(h => h.includes('reg') || h.includes('registration'));
  const idIdx = headers.findIndex(h => h.includes('internetid') || h.includes('id'));
  const passIdx = headers.findIndex(h => h.includes('password') || h.includes('pass'));
  if (regIdx === -1 || passIdx === -1) return [];
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    return {
      registrationNumber: cols[regIdx] || '',
      internetId: idIdx !== -1 ? (cols[idIdx] || cols[regIdx]) : cols[regIdx],
      internetPassword: cols[passIdx] || '',
    };
  }).filter(r => r.registrationNumber && r.internetPassword);
}

export default function PasswordsPage() {
  const [rows, setRows] = useState<PasswordRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const headers = { Authorization: `Bearer ${getAdminToken()}` };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target?.result as string);
      if (parsed.length === 0) {
        setError('Could not parse CSV. Ensure columns: registrationNumber, internetPassword (and optionally internetId).');
        setRows([]);
      } else setRows(parsed);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!rows.length) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/upload/passwords', { passwords: rows }, { headers });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRows([]); setFileName(''); setResult(null); setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminNavbar title="Internet Passwords" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Credential Management</h2>
          <p className="text-slate-400 text-sm mt-1">Upload internet account details via CSV</p>
        </div>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-white">CSV Format</h3>
          </div>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-slate-300 border border-white/5">
            <p className="text-slate-500 mb-1"># Required columns (header row):</p>
            <p>registrationNumber,internetId,internetPassword</p>
            <p className="text-slate-500 mt-2"># Example:</p>
            <p>22CS001,user001,Pass@123</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-green-500/40 hover:bg-green-500/5 transition-all group">
            <Upload className="w-10 h-10 text-slate-500 group-hover:text-green-400 mx-auto mb-3 transition-colors" />
            <p className="text-white font-medium">{fileName || 'Click to upload CSV'}</p>
            <p className="text-slate-500 text-sm mt-1">passwords.csv</p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {rows.length > 0 && !result && (
            <div className="mt-4 space-y-4 animate-fadein">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400"><span className="text-white font-semibold">{rows.length}</span> entries parsed</p>
                <button onClick={reset} className="text-xs text-slate-500 hover:text-white transition-colors">Clear</button>
              </div>
              <div className="max-h-64 overflow-y-auto rounded-xl border border-white/5">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#0a0f2e]">
                    <tr className="text-left text-slate-500 border-b border-white/5">
                      <th className="px-4 py-2">Reg. No.</th>
                      <th className="px-4 py-2">Internet ID</th>
                      <th className="px-4 py-2">Password</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rows.map((r, i) => (
                      <tr key={i} className="hover:bg-white/3">
                        <td className="px-4 py-2 text-white font-mono">{r.registrationNumber}</td>
                        <td className="px-4 py-2 text-slate-400 font-mono">{r.internetId}</td>
                        <td className="px-4 py-2 text-slate-400 font-mono">{r.internetPassword}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button onClick={handleUpload} loading={loading} className="w-full">
                <KeyRound className="w-4 h-4 mr-2" /> Assign Passwords to {rows.length} Participants
              </Button>
            </div>
          )}
        </GlassCard>

        {result && (
          <GlassCard className="border border-green-500/20 bg-green-500/5 animate-fadein">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold text-white">Upload Complete</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Total', value: result.total, color: 'text-white' },
                { label: 'Updated', value: result.updated, color: 'text-green-400' },
                { label: 'Not Found', value: result.notFound.length, color: result.notFound.length > 0 ? 'text-red-400' : 'text-slate-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-white/5">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
            {result.notFound.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-400 font-medium">Not found in system:</p>
                </div>
                <p className="text-xs text-slate-400 font-mono">{result.notFound.join(', ')}</p>
              </div>
            )}
            <button onClick={reset} className="mt-4 text-sm text-slate-400 hover:text-white transition-colors">Upload another file</button>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
