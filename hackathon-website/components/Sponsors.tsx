"use client";
import { motion } from "framer-motion";

const SPONSORS = [
  "NASA", "SPACEX", "BLUE ORIGIN", "LOCKHEED MARTIN",
  "NORTHROP GRUMMAN", "BOEING", "ISRO", "ESA", "JAXA",
];

function MarqueeTrack({ reverse }: { reverse?: boolean }) {
  const items = [...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <div style={{ position: "relative", overflow: "hidden", display: "flex" }}>
      {/* Edge fades */}
      <div style={{
        position: "absolute", inset: "0 auto 0 0", width: 120, zIndex: 10,
        background: "linear-gradient(to right, black, transparent)",
      }} />
      <div style={{
        position: "absolute", inset: "0 0 0 auto", width: 120, zIndex: 10,
        background: "linear-gradient(to left, black, transparent)",
      }} />

      <motion.div
        style={{ display: "flex", gap: 16, flexShrink: 0, padding: "8px 0" }}
        animate={{ x: reverse ? ["-33.33%", "0%"] : ["0%", "-33.33%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {items.map((name, i) => (
          <SponsorCard key={i} name={name} />
        ))}
      </motion.div>
    </div>
  );
}

function SponsorCard({ name }: { name: string }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 220,
        height: 110,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        cursor: "default",
        transition: "border-color 0.3s, background 0.3s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.35)";
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)";
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
      }}
    >
      <div style={{ width: 32, height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.7)",
        fontFamily: "var(--font-orbitron)",
      }}>
        {name}
      </span>
      <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.2)", borderRadius: 2 }} />
    </div>
  );
}

export default function Sponsors() {
  return (
    <section
      id="sponsors"
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
          width: 600, height: 600, borderRadius: "50%",
          background: "rgba(255,255,255,0.02)", filter: "blur(120px)",
        }} />
      </div>

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 80 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: 10, letterSpacing: "0.5em", color: "rgba(255,255,255,0.25)", marginBottom: 16, fontWeight: 700, textTransform: "uppercase" }}
        >
          MISSION ALLIES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
            fontWeight: 900,
            color: "white",
            letterSpacing: "2px",
            textTransform: "uppercase",
            lineHeight: 1,
            textAlign: "center",
            fontFamily: "var(--font-orbitron)",
            margin: 0,
          }}
        >
          STRATEGIC PARTNERS
        </motion.h2>
      </div>

      {/* Marquee rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 10 }}>
        <MarqueeTrack />
        <MarqueeTrack reverse />
      </div>

      {/* Footer note */}
      <div style={{ maxWidth: 1100, margin: "64px auto 0", padding: "0 24px", display: "flex", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase", textAlign: "center" }}
        >
          WANT TO SUPPORT THE MISSION? PARTNER WITH US.
        </motion.p>
      </div>
    </section>
  );
}
