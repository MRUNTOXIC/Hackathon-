"use client";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { Brain, Shield, Cpu, Satellite, Rocket, Globe, Zap, Star } from "lucide-react";
import { useRef, useState } from "react";

const TRACKS = [
  {
    id: "01",
    icon: Brain,
    accentColor: "#06b6d4",
    accentRgb: "6,182,212",
    title: "Smart Traffic Prediction",
    desc: "Build an AI model to predict traffic congestion and optimize real-time traffic flow in urban cities.",
    category: "AI & ML",
    difficulty: "HARD",
    difficultyColor: "#ef4444",
    prize: "₹15,000",
    skills: ["Python", "TensorFlow", "Data Analysis"],
    participants: "40+",
  },
  {
    id: "02",
    icon: Shield,
    accentColor: "#a855f7",
    accentRgb: "168,85,247",
    title: "Phishing Detection System",
    desc: "Design a system to detect and prevent phishing attacks using ML and behavioral analysis.",
    category: "CYBERSECURITY",
    difficulty: "MEDIUM",
    difficultyColor: "#f59e0b",
    prize: "₹10,000",
    skills: ["ML", "Security", "Node.js"],
    participants: "35+",
  },
  {
    id: "03",
    icon: Cpu,
    accentColor: "#f97316",
    accentRgb: "249,115,22",
    title: "Autonomous Delivery Bot",
    desc: "Develop an autonomous delivery robot capable of navigating complex environments safely.",
    category: "ROBOTICS",
    difficulty: "EXPERT",
    difficultyColor: "#ef4444",
    prize: "₹20,000",
    skills: ["ROS", "C++", "Sensors"],
    participants: "25+",
  },
  {
    id: "04",
    icon: Satellite,
    accentColor: "#3b82f6",
    accentRgb: "59,130,246",
    title: "Satellite Image Analysis",
    desc: "Analyze satellite imagery to detect land use changes and environmental impacts.",
    category: "SPACE TECH",
    difficulty: "MEDIUM",
    difficultyColor: "#f59e0b",
    prize: "₹12,000",
    skills: ["Computer Vision", "GIS", "Python"],
    participants: "30+",
  },
  {
    id: "05",
    icon: Rocket,
    accentColor: "#ec4899",
    accentRgb: "236,72,153",
    title: "Hybrid Rocket Optimization",
    desc: "Optimize the design of hybrid rocket engines for better performance and efficiency.",
    category: "PROPULSION",
    difficulty: "EXPERT",
    difficultyColor: "#ef4444",
    prize: "₹18,000",
    skills: ["Physics", "CAD", "Simulation"],
    participants: "20+",
  },
  {
    id: "06",
    icon: Globe,
    accentColor: "#22c55e",
    accentRgb: "34,197,94",
    title: "Carbon Footprint Calculator",
    desc: "Create a platform to calculate and reduce carbon footprint for individuals and organizations.",
    category: "CLIMATE",
    difficulty: "EASY",
    difficultyColor: "#22c55e",
    prize: "₹8,000",
    skills: ["Web Dev", "Data Viz", "APIs"],
    participants: "50+",
  },
];

function TrackCard({ track, index }: { track: (typeof TRACKS)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 300 });
  const [isHovered, setIsHovered] = useState(false);
  const inView = useInView(cardRef, { once: true });
  const Icon = track.icon;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      style={{
        position: "relative",
        background: "#0a0a0f",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        border: isHovered
          ? `1px solid rgba(${track.accentRgb}, 0.5)`
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isHovered
          ? `0 0 0 1px rgba(${track.accentRgb}, 0.1), 0 20px 60px rgba(${track.accentRgb}, 0.15), 0 8px 32px rgba(0,0,0,0.6)`
          : "0 4px 24px rgba(0,0,0,0.5)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Mouse spotlight */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 180px at ${smoothX}px ${smoothY}px, rgba(${track.accentRgb}, 0.1), transparent 70%)`,
          transition: "opacity 0.4s",
        }}
      />

      {/* Colored top bar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(to right, rgba(${track.accentRgb}, 0.9), rgba(${track.accentRgb}, 0.2))`,
      }} />

      {/* Card content */}
      <div style={{ position: "relative", zIndex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

        {/* Top row: icon + id */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `rgba(${track.accentRgb}, 0.12)`,
            border: `1px solid rgba(${track.accentRgb}, 0.25)`,
          }}>
            <Icon
              size={22}
              style={{
                color: track.accentColor,
                filter: isHovered ? `drop-shadow(0 0 8px rgba(${track.accentRgb}, 0.8))` : "none",
                transition: "filter 0.3s",
              }}
            />
          </div>
          <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>
            {track.id}
          </span>
        </div>

        {/* Category badge */}
        <div>
          <span style={{
            display: "inline-block",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 6,
            color: track.accentColor,
            background: `rgba(${track.accentRgb}, 0.12)`,
            border: `1px solid rgba(${track.accentRgb}, 0.3)`,
          }}>
            {track.category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15,
          fontWeight: 900,
          color: "white",
          fontFamily: "var(--font-orbitron)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          lineHeight: 1.3,
          margin: 0,
        }}>
          {track.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", margin: 0, fontFamily: "sans-serif", flex: 1 }}>
          {track.desc}
        </p>

        {/* Skills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {track.skills.map((skill) => (
            <span key={skill} style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 8,
              fontFamily: "monospace",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
            }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `rgba(${track.accentRgb}, 0.15)` }} />

        {/* Bottom: difficulty + prize */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Zap size={12} style={{ color: track.difficultyColor }} />
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", color: track.difficultyColor }}>
                {track.difficulty}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Star size={12} style={{ color: "rgba(255,255,255,0.35)" }} />
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.45)" }}>
                {track.participants} teams
              </span>
            </div>
          </div>
          <span style={{ fontSize: 15, fontWeight: 900, fontFamily: "monospace", color: track.accentColor }}>
            {track.prize}
          </span>
        </div>

      </div>
    </motion.div>
  );
}

export default function Tracks() {
  return (
    <section
      id="tracks"
      style={{
        position: "relative",
        padding: "128px 0",
        fontFamily: "var(--font-orbitron)",
        zIndex: 10,
      }}
    >
      {/* Background glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "25%", left: "25%",
          width: 500, height: 500, borderRadius: "50%",
          background: "rgba(6,182,212,0.05)", filter: "blur(120px)",
        }} />
        <div style={{
          position: "absolute", bottom: "25%", right: "25%",
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(168,85,247,0.05)", filter: "blur(100px)",
        }} />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header — same style as Timeline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: 10, letterSpacing: "0.5em", color: "rgba(255,255,255,0.25)", marginBottom: 16, fontWeight: 700, textTransform: "uppercase", textAlign: "center", alignSelf: "center" }}
        >
          MISSION BRIEFING
        </motion.p>

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
            marginBottom: 16,
            fontFamily: "var(--font-orbitron)",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          PROBLEM STATEMENTS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 64, letterSpacing: "0.05em" }}
        >
          Real-world challenges. Infinite potential.
        </motion.p>

        {/* 3×2 uniform grid */}
        <div className="tracks-grid">
          {TRACKS.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
