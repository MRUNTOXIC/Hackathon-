"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-6 md:gap-12 text-center justify-center">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-6 md:gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <div className="text-4xl md:text-[80px] font-black text-white tabular-nums tracking-tighter leading-none font-orbitron">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-[9px] text-white/30 tracking-[0.45em] uppercase font-bold mt-3 font-orbitron">
              {unit.label}
            </div>
          </motion.div>
          {i < units.length - 1 && (
            <div className="h-12 w-px bg-white/10" />
          )}
        </div>
      ))}
    </div>
  );
}

export function GlassButton({
  label,
  icon,
  primary = false,
  onClick,
}: {
  label: string;
  icon?: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        backgroundColor: primary ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
        scale: 1.02,
        boxShadow: primary ? "0 0 35px rgba(60,120,255,0.35)" : "0 0 15px rgba(255,255,255,0.05)",
        borderColor: primary ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)"
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center justify-center gap-3 h-[54px] w-[220px]
        text-[12px] tracking-[0.25em] font-bold uppercase transition-all duration-300
        backdrop-blur-md text-white rounded-[12px] group cursor-pointer font-orbitron
        ${primary ? 'border border-[#80c8ff]/30 bg-black/60 shadow-[0_0_20px_rgba(128,200,255,0.15)]' : 'border border-white/10 bg-white/[0.01]'}
      `}
    >
      {label}
      {icon && (
        <span className="group-hover:translate-x-1 transition-transform duration-300 opacity-80">
          {icon}
        </span>
      )}
    </motion.button>
  );
}

export default function Hero({
  show,
  scrollProgress = 0,
  onRegisterClick,
}: {
  show: boolean;
  scrollProgress?: number;
  onRegisterClick: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!mounted || !show) return null;

  // Fade and blur purely based on scroll, but do NOT apply vertical translation in Framer Motion to prevent jitter/vibration
  const opacity = Math.max(0, 1 - scrollProgress * 1.8);
  const blur = scrollProgress * 8;

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center select-none">

      {/* Top Left Telemetry - standalone (visible on tablet and PC) */}
      <motion.div
        style={{ opacity, filter: `blur(${blur}px)` }}
        className="absolute top-24 left-8 md:left-16 z-30 hidden sm:flex flex-col gap-1.5 pointer-events-none font-mono"
      >
        <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-medium">ORBITAL VELOCITY</span>
        <span className="text-[13px] tracking-[0.1em] text-white font-bold uppercase">7.66 KM/S</span>
      </motion.div>

      {/* Top Right Telemetry - standalone (visible on tablet and PC) */}
      <motion.div
        style={{ opacity, filter: `blur(${blur}px)` }}
        className="absolute top-24 right-8 md:right-16 z-30 hidden sm:flex flex-col gap-1.5 text-right pointer-events-none font-mono"
      >
        <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-medium">ALTITUDE</span>
        <span className="text-[13px] tracking-[0.1em] text-white font-bold uppercase">408 KM</span>
      </motion.div>

      {/* Bottom Left Telemetry (grows on PC and tablet) */}
      <motion.div
        style={{ opacity, filter: `blur(${blur}px)` }}
        className="absolute bottom-24 left-8 md:left-16 z-30 hidden md:flex flex-col gap-8 pointer-events-none font-mono border-l border-white/10 pl-6"
      >
        {[
          { label: "MISSION STATUS", value: "GO FOR LAUNCH" },
          { label: "TEAM COUNT", value: "120" },
          { label: "PARTICIPANTS", value: "500" },
          { label: "PRIZE POOL", value: "₹20,000" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[10px] tracking-[0.45em] text-white/30 uppercase font-medium">{item.label}</span>
            <span className="text-[12px] tracking-[0.15em] text-white font-bold uppercase">{item.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Main Content Container - only mouse move x/y animation for smooth interactive hover */}
      <motion.div
        id="hero-content"
        className="relative z-10 flex flex-col items-center text-center px-4"
        style={{
          opacity,
          filter: `blur(${blur}px)`,
        }}
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 80 }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[14px] md:text-[16px] tracking-[0.6em] text-white/40 mb-8 font-medium uppercase font-orbitron"
        >
          Mission Control
        </motion.p>

        {/* Heading */}
        <div className="relative mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,10vw,8.5rem)] font-[900] text-white leading-[0.88] tracking-[-0.04em] uppercase font-orbitron"
            style={{
              textShadow: "0 0 40px rgba(255,255,255,0.12)",
              background: "linear-gradient(180deg, #ffffff 0%, #fafafa 12%, #efefef 28%, #d9d9d9 48%, #c3c3c3 68%, #9f9f9f 88%, #7b7b7b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
          COMET<br />CODE
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="text-[16px] md:text-[20px] tracking-[0.25em] text-[#80c8ff] font-medium uppercase mb-16 font-orbitron"
        >
          12 HOURS. INFINITE POSSIBILITIES.
        </motion.p>

        {/* Countdown */}
        <div className="mb-20">
          <CountdownTimer targetDate="2026-03-14T09:00:00" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pointer-events-auto">
          <GlassButton label="Register Now" icon="→" primary onClick={onRegisterClick} />
          <GlassButton
            label="Explore More"
            icon="↓"
            onClick={() => {
              document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[20px] h-[35px] border-2 border-white/20 rounded-full relative">
          <motion.div
            className="w-1 h-1 bg-white rounded-full absolute top-2 left-1/2 -translate-x-1/2"
            animate={{ top: [8, 20, 8], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-[10px] tracking-[0.6em] text-white/30 uppercase font-bold font-orbitron ml-[0.6em]">
          Scroll
        </span>
      </motion.div>
    </div>
  );
}
