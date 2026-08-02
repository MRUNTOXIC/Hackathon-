"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const SYSTEM_LINES = [
  "SATELLITE ARRAY",
  "ORBITAL NETWORK",
  "GLOBAL TELEMETRY",
  "MISSION GRID",
];

function StatusLine({ text, delay }: { text: string; delay: number }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), delay * 1000 + 600);
    return () => clearTimeout(t);
  }, [delay]);

  const dots = "·".repeat(Math.max(0, 22 - text.length));

  return (
    <motion.div
      className="flex items-center gap-2 text-[11px] tracking-widest text-white/50"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{ fontFamily: "var(--font-orbitron)" }}
    >
      <span className="text-white/30">{text}</span>
      <span className="text-white/15 tracking-[3px]">{dots}</span>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-white/70">ONLINE</motion.span>
        ) : (
          <motion.span key="wait" animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-white/30">——</motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"boot" | "hud" | "status" | "expand">("boot");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hud"),    500);
    const t2 = setTimeout(() => setPhase("status"), 1500);
    const t3 = setTimeout(() => setPhase("expand"), 2800);
    const t4 = setTimeout(() => onComplete(),       3800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* ── SVG HUD ─────────────────────────────────────────── */}
      <svg
        viewBox="-200 -200 400 400"
        className="absolute w-[min(100vw,100vh)] h-[min(100vw,100vh)]"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {/* Outer ring */}
        <motion.circle cx={0} cy={0} r={180} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth={0.5}
          initial={{ pathLength: 0 }} animate={phase !== "boot" ? { pathLength: 1 } : {}}
          transition={{ delay: 0, duration: 1.0, ease: "easeOut" }} />

        {/* Mid ring */}
        <motion.circle cx={0} cy={0} r={130} fill="none"
          stroke="rgba(255,255,255,0.1)" strokeWidth={0.5}
          initial={{ pathLength: 0 }} animate={phase !== "boot" ? { pathLength: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.9, ease: "easeOut" }} />

        {/* Inner ring — expands on phase=expand */}
        <motion.circle cx={0} cy={0} r={70} fill="none"
          stroke="rgba(255,255,255,0.15)" strokeWidth={0.5}
          initial={{ pathLength: 0, scale: 1 }}
          animate={phase === "expand"
            ? { pathLength: 1, scale: 2.8, opacity: 0 }
            : phase !== "boot" ? { pathLength: 1 } : {}}
          transition={phase === "expand"
            ? { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
            : { delay: 0.2, duration: 0.8, ease: "easeOut" }} />

        {/* Crosshair lines */}
        {[
          [-190, 0, 190, 0],
          [0, -190, 0, 190],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.1)" strokeWidth={0.5}
            initial={{ pathLength: 0 }} animate={phase !== "boot" ? { pathLength: 1 } : {}}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: "easeOut" }} />
        ))}

        {/* Diagonal lines */}
        {[
          [-140, -140, 140, 140],
          [140, -140, -140, 140],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}
            initial={{ pathLength: 0 }} animate={phase !== "boot" ? { pathLength: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.7, ease: "easeOut" }} />
        ))}

        {/* Corner brackets */}
        {([[-175,-175],[175,-175],[-175,175],[175,175]] as [number,number][]).map(([cx,cy], i) => {
          const sx = cx > 0 ? -1 : 1, sy = cy > 0 ? -1 : 1;
          return (
            <g key={i}>
              <motion.line x1={cx} y1={cy} x2={cx+sx*28} y2={cy}
                stroke="rgba(255,255,255,0.45)" strokeWidth={1}
                initial={{ pathLength: 0 }} animate={phase !== "boot" ? { pathLength: 1 } : {}}
                transition={{ delay: 0.4+i*0.06, duration: 0.3 }} />
              <motion.line x1={cx} y1={cy} x2={cx} y2={cy+sy*28}
                stroke="rgba(255,255,255,0.45)" strokeWidth={1}
                initial={{ pathLength: 0 }} animate={phase !== "boot" ? { pathLength: 1 } : {}}
                transition={{ delay: 0.46+i*0.06, duration: 0.3 }} />
            </g>
          );
        })}

        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const len = i % 3 === 0 ? 8 : 4;
          return (
            <motion.line key={i}
              x1={Math.cos(a)*175} y1={Math.sin(a)*175}
              x2={Math.cos(a)*(175+len)} y2={Math.sin(a)*(175+len)}
              stroke="rgba(255,255,255,0.2)" strokeWidth={0.5}
              initial={{ opacity: 0 }} animate={phase !== "boot" ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.015, duration: 0.2 }} />
          );
        })}

        {/* Center dot */}
        <motion.circle cx={0} cy={0} r={3} fill="white"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase !== "boot" ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }} />

        {/* ASTRA label — fades out on expand */}
        <motion.text x={0} y={-10} textAnchor="middle" fill="white" fontSize={13} letterSpacing={8}
          initial={{ opacity: 0 }}
          animate={phase === "expand" ? { opacity: 0 } : phase !== "boot" ? { opacity: 1 } : {}}
          transition={{ delay: phase === "expand" ? 0 : 0.8, duration: 0.5 }}>
          ASTRA
        </motion.text>
        <motion.text x={0} y={7} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={4.5} letterSpacing={4}
          initial={{ opacity: 0 }}
          animate={phase === "expand" ? { opacity: 0 } : phase !== "boot" ? { opacity: 1 } : {}}
          transition={{ delay: phase === "expand" ? 0 : 1.0, duration: 0.5 }}>
          MISSION CONTROL
        </motion.text>

        {/* Cardinals */}
        {(["N","E","S","W"] as const).map((l, i) => {
          const positions: [number,number][] = [[0,-188],[188,3],[0,192],[-191,3]];
          return (
            <motion.text key={l} x={positions[i][0]} y={positions[i][1]} textAnchor="middle"
              fill="rgba(255,255,255,0.18)" fontSize={6} letterSpacing={2}
              initial={{ opacity: 0 }} animate={phase !== "boot" ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}>
              {l}
            </motion.text>
          );
        })}
      </svg>

      {/* ── Boot text ────────────────────────────────────────── */}
      <div className="absolute top-12 left-12" style={{ fontFamily: "var(--font-orbitron)" }}>
        <motion.div className="flex items-center gap-2 text-[11px] tracking-widest text-white/40"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <span>&gt; ASTRA SYSTEM INITIALIZING</span>
          <motion.span className="inline-block w-2 h-3 bg-white/60"
            animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.7 }} />
        </motion.div>
      </div>

      {/* ── Status lines ─────────────────────────────────────── */}
      <AnimatePresence>
        {(phase === "status" || phase === "expand") && (
          <motion.div
            className="absolute bottom-16 left-12 flex flex-col gap-3"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {SYSTEM_LINES.map((line, i) => (
              <StatusLine key={line} text={line} delay={i * 0.35} />
            ))}
            <motion.div
              className="mt-2 text-[11px] tracking-widest text-white/70"
              style={{ fontFamily: "var(--font-orbitron)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: SYSTEM_LINES.length * 0.35 + 0.4, duration: 0.5 }}
            >
              ✓ MISSION READY
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
