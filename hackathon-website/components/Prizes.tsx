"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const PRIZE_DETAILS = [
  {
    rank: "01",
    label: "CHAMPION",
    value: "₹50,000",
    color: "#facc15",
    rgb: "250,204,21",
    desc: "Best overall project across all tracks",
  },
  {
    rank: "02",
    label: "RUNNER UP",
    value: "₹30,000",
    color: "#94a3b8",
    rgb: "148,163,184",
    desc: "Second best project across all tracks",
  },
  {
    rank: "03",
    label: "SPECIAL AWARDS",
    value: "₹20,000",
    color: "#f97316",
    rgb: "249,115,22",
    desc: "Best in individual track categories",
  },
];

function Counter({ target, run }: { target: number; run: boolean }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    const duration = 2400;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [run, target]);

  return <span>₹{val.toLocaleString("en-IN")}+</span>;
}

function PrizeCard({ prize, index }: { prize: (typeof PRIZE_DETAILS)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 + index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 32px",
        background: hovered ? `rgba(${prize.rgb}, 0.05)` : "rgba(255,255,255,0.02)",
        border: hovered ? `1px solid rgba(${prize.rgb}, 0.4)` : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "default",
        transition: "background 0.3s, border-color 0.3s",
        boxShadow: hovered
          ? `0 0 40px rgba(${prize.rgb}, 0.12), 0 20px 60px rgba(0,0,0,0.5)`
          : "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(to right, transparent, rgba(${prize.rgb}, 0.8), transparent)`,
      }} />

      {/* HUD corners */}
      <div style={{ position: "absolute", top: 12, left: 12, width: 12, height: 12, borderTop: `1px solid rgba(${prize.rgb}, 0.4)`, borderLeft: `1px solid rgba(${prize.rgb}, 0.4)` }} />
      <div style={{ position: "absolute", top: 12, right: 12, width: 12, height: 12, borderTop: `1px solid rgba(${prize.rgb}, 0.4)`, borderRight: `1px solid rgba(${prize.rgb}, 0.4)` }} />
      <div style={{ position: "absolute", bottom: 12, left: 12, width: 12, height: 12, borderBottom: `1px solid rgba(${prize.rgb}, 0.4)`, borderLeft: `1px solid rgba(${prize.rgb}, 0.4)` }} />
      <div style={{ position: "absolute", bottom: 12, right: 12, width: 12, height: 12, borderBottom: `1px solid rgba(${prize.rgb}, 0.4)`, borderRight: `1px solid rgba(${prize.rgb}, 0.4)` }} />

      {/* Rank */}
      <span style={{
        fontSize: 11, fontFamily: "monospace", fontWeight: 700,
        letterSpacing: "0.3em", color: `rgba(${prize.rgb}, 0.5)`,
        marginBottom: 16,
      }}>
        RANK {prize.rank}
      </span>

      {/* Prize value */}
      <span style={{
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: 900,
        color: prize.color,
        fontFamily: "var(--font-orbitron)",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        marginBottom: 12,
        textShadow: hovered ? `0 0 30px rgba(${prize.rgb}, 0.5)` : "none",
        transition: "text-shadow 0.3s",
      }}>
        {prize.value}
      </span>

      {/* Label */}
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.35em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
        marginBottom: 16,
      }}>
        {prize.label}
      </span>

      {/* Divider */}
      <div style={{ width: 40, height: 1, background: `rgba(${prize.rgb}, 0.3)`, marginBottom: 16 }} />

      {/* Description */}
      <p style={{
        fontSize: 12, color: "rgba(255,255,255,0.35)",
        fontFamily: "sans-serif", lineHeight: 1.6,
        letterSpacing: "0.02em", margin: 0,
      }}>
        {prize.desc}
      </p>

      {/* Shine sweep on hover */}
      <motion.div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
        }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export default function Prizes() {
  const [run, setRun] = useState(false);
  const sectionRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });
  const moveX = useTransform(springX, [-0.5, 0.5], ["-12px", "12px"]);
  const moveY = useTransform(springY, [-0.5, 0.5], ["-12px", "12px"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="prizes"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        padding: "128px 0",
        fontFamily: "var(--font-orbitron)",
        zIndex: 10,
      }}
    >
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: "rgba(60,120,255,0.04)", filter: "blur(120px)",
        }} />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: 10, letterSpacing: "0.5em", color: "rgba(255,255,255,0.25)", marginBottom: 16, fontWeight: 700, textTransform: "uppercase" }}
        >
          REWARD SYSTEM
        </motion.p>

        {/* Heading — left aligned like Timeline/Tracks */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(2rem, 5.5vw, 5rem)",
            fontWeight: 900,
            color: "white",
            letterSpacing: "2px",
            textTransform: "uppercase",
            lineHeight: 1.1,
            marginBottom: 64,
            fontFamily: "var(--font-orbitron)",
            alignSelf: "center",
          textAlign: "center",
          }}
        >
          PRIZE POOL
        </motion.h2>

        {/* Big counter — centered with parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => setRun(true)}
          style={{
            x: moveX, y: moveY,
            fontSize: "clamp(3rem, 12vw, 11rem)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            position: "relative",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <Counter target={100000} run={run} />

          {/* Reflection */}
          <div style={{
            position: "absolute", bottom: -12, left: "50%",
            transform: "translateX(-50%)",
            width: "70%", height: 1,
            background: "rgba(255,255,255,0.15)", filter: "blur(2px)",
          }} />

          {/* Shine sweep */}
          <motion.div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              overflow: "hidden", mixBlendMode: "overlay",
            }}
            animate={{ x: ["-150%", "250%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear", repeatDelay: 2 }}
          >
            <div style={{
              width: "40%", height: "100%",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
              transform: "skewX(-25deg)",
            }} />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 11, letterSpacing: "0.5em", color: "rgba(255,255,255,0.35)", fontWeight: 700, marginBottom: 80, textTransform: "uppercase" }}
        >
          TOTAL PRIZE POOL
        </motion.p>

        {/* Prize cards — uniform 3-col grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          width: "100%",
        }}
          className="prizes-grid"
        >
          {PRIZE_DETAILS.map((prize, i) => (
            <PrizeCard key={prize.label} prize={prize} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.12)", marginTop: 48, textAlign: "center", textTransform: "uppercase" }}
        >
          * PLUS ADDITIONAL PERKS, MERCHANDISE, AND INTERNSHIP OPPORTUNITIES
        </motion.p>
      </div>
    </section>
  );
}
