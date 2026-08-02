"use client";
import { motion } from "framer-motion";

const NODES = [
  { label: "AI & ML",        pos: "top-[18%] left-[8%]"    },
  { label: "CYBER SECURITY", pos: "top-[18%] right-[8%]"   },
  { label: "SPACE TECH",     pos: "bottom-[22%] left-[8%]"  },
  { label: "ROBOTICS",       pos: "bottom-[22%] right-[8%]" },
];

export default function OrbitCards({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="hidden sm:block">
      {NODES.map(({ label, pos }, i) => (
        <motion.div key={label} className={`absolute ${pos} pointer-events-none`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.8 + i * 0.15, duration: 0.5 }}
          style={{ fontFamily: "var(--font-orbitron)" }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-8 h-px bg-white/15" />
            <span className="text-[9px] tracking-widest text-white/35 border border-white/10 px-2 py-1">
              {label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
