'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Team } from '@/types';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import { QrCode, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

// ✏️ Change this to your logo filename inside /public
const HACKATHON_LOGO = '/logo.png';
const LOGO_SIZE = 44; // px, overlay on the 200px QR

export default function QRPassPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.teamId) {
      api.get('/team').then(({ data }) => setTeam(data)).catch(() => {});
    }
  }, [user]);

  const qrData = JSON.stringify({
    userId: user?._id,
    name: user?.name,
    registrationNumber: user?.registrationNumber,
    teamName: team?.teamName || 'No Team',
    teamNumber: team?.teamNumber || '—',
    role: user?.role,
  });

  const downloadQR = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const size = 200;
    const out = document.createElement('canvas');
    out.width = size;
    out.height = size;
    const ctx = out.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0);
    const img = new Image();
    img.onload = () => {
      const ls = size * 0.22;
      const pos = (size - ls) / 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, ls / 2 + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(img, pos, pos, ls, ls);
      const a = document.createElement('a');
      a.href = out.toDataURL('image/png');
      a.download = `qr-pass-${user?.registrationNumber}.png`;
      a.click();
    };
    img.onerror = () => {
      // logo not found, download without it
      const a = document.createElement('a');
      a.href = out.toDataURL('image/png');
      a.download = `qr-pass-${user?.registrationNumber}.png`;
      a.click();
    };
    img.src = HACKATHON_LOGO;
  };

  return (
    <div className="flex flex-col flex-1">
      <Navbar title="QR Pass" />
      <div className="p-6 flex justify-center">
        <GlassCard className="max-w-sm w-full text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Your Event Pass</h3>
          </div>

          <div className="relative bg-white p-4 rounded-2xl inline-block mb-6" ref={canvasRef}>
            <QRCodeCanvas value={qrData} size={200} level="H" marginSize={1} />
            <div
              className="absolute rounded-xl overflow-hidden border-2 border-white shadow"
              style={{
                width: LOGO_SIZE,
                height: LOGO_SIZE,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff',
              }}
            >
              <img src={HACKATHON_LOGO} alt="logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="space-y-2 text-left mb-6">
            {[
              { label: 'Name', value: user?.name },
              { label: 'Reg. No.', value: user?.registrationNumber },
              { label: 'Team', value: team?.teamName || 'No Team' },
              { label: 'Team No.', value: team?.teamNumber || '—' },
              { label: 'Role', value: user?.role },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="text-white font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>

          <button onClick={downloadQR}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-medium">
            <Download className="w-4 h-4" /> Download Pass
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
