'use client';
import { useRef } from 'react';

interface OtpInputProps {
  onChange: (code: string) => void;
  onPasteCapture?: React.ClipboardEventHandler<HTMLDivElement>;
}

/**
 * Six individual digit boxes.
 * Calls onChange(fullCode) on every keystroke / paste.
 */
export default function OtpInput({ onChange }: OtpInputProps) {
  const digitRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null, null, null]);
  const digits = useRef<string[]>(['', '', '', '', '', '']);

  const sync = () => onChange(digits.current.join(''));

  const handleChange = (i: number, val: string) => {
    const ch = val.replace(/\D/g, '').slice(-1);
    digits.current[i] = ch;
    if (digitRefs.current[i]) digitRefs.current[i]!.value = ch;
    sync();
    if (ch && i < 5) digitRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits.current[i]) {
        digits.current[i] = '';
        if (digitRefs.current[i]) digitRefs.current[i]!.value = '';
        sync();
      } else if (i > 0) {
        digits.current[i - 1] = '';
        if (digitRefs.current[i - 1]) digitRefs.current[i - 1]!.value = '';
        sync();
        digitRefs.current[i - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    pasted.split('').forEach((ch, i) => {
      digits.current[i] = ch;
      if (digitRefs.current[i]) digitRefs.current[i]!.value = ch;
    });
    sync();
    const next = pasted.length < 6 ? pasted.length : 5;
    digitRefs.current[next]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(el) => { digitRefs.current[i] = el; }}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-14 text-center text-2xl font-bold rounded-xl border border-slate-700 bg-slate-800/60 text-white caret-cyan-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all"
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
