"use client";
import { motion } from "framer-motion";

export default function Venue() {
  return (
    <section
      id="venue"
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
          background: "rgba(59,130,246,0.04)", filter: "blur(140px)",
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
          LOCATION DATA
        </motion.p>

        {/* Heading */}
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
            textAlign: "center",
          }}
        >
          LAUNCH SITE
        </motion.h2>

        {/* Content grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, width: "100%" }} className="venue-grid">

          {/* Map card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              height: "clamp(300px, 50vh, 460px)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              background: "#07090d",
            }}
          >
            {/* Real Google Map, dark-blue filtered to match theme */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                filter: "grayscale(1) invert(1) sepia(1) hue-rotate(180deg) saturate(4) brightness(0.7) contrast(1.2)",
                pointerEvents: "none",
              }}
            >
              <iframe
                title="Atmiya University Launch Site Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=70.7706%2C22.2818%2C70.7826%2C22.2898&layer=mapnik"
                style={{ width: "100%", height: "100%", border: 0 }}
                loading="lazy"
              />
            </div>

            {/* Subtle blue tint overlay on top of the map to blend with theme */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
              background: "linear-gradient(180deg, rgba(6,182,212,0.1) 0%, rgba(6,182,212,0.05) 40%, rgba(6,182,212,0.2) 100%)",
            }} />

            {/* Simple Pin-Point & Box Overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, pointerEvents: "none" }}>
              <div className="relative flex flex-col items-center">

                {/* Information Box */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  style={{
                    background: "rgba(6,182,212,0.9)",
                    backdropFilter: "blur(4px)",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 0 20px rgba(6,182,212,0.4)",
                    marginBottom: "12px",
                    position: "relative"
                  }}
                >
                  <p style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "2px",
                    margin: 0,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-orbitron)"
                  }}>
                    Atmiya University
                  </p>
                  {/* Small arrow pointing down from box */}
                  <div style={{
                    position: "absolute",
                    bottom: "-6px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid rgba(6,182,212,0.9)"
                  }} />
                </motion.div>

                {/* Pin Point Core */}
                <div style={{
                  width: "12px",
                  height: "12px",
                  background: "white",
                  borderRadius: "50%",
                  boxShadow: "0 0 15px white, 0 0 30px #06b6d4",
                  border: "2px solid #06b6d4",
                  zIndex: 2,
                }} />

                {/* Subtle pulse under the pin */}
                <motion.div
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#06b6d4"
                  }}
                />
              </div>
            </div>

            {/* HUD coords */}
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 20, display: "flex", flexDirection: "column", gap: 4, pointerEvents: "none" }}>
              <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>LAT: 22.2858° N</span>
              <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>LONG: 70.7766° E</span>
            </div>
            <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 20, pointerEvents: "none" }}>
              <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>SECTOR: 07-B // ACTIVE</span>
            </div>
            <div style={{ position: "absolute", top: 20, right: 20, zIndex: 20, pointerEvents: "none" }}>
              <motion.div
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>

            {/* Grid lines overlay */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, zIndex: 15, pointerEvents: "none" }}>
              <defs>
                <pattern id="venue-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#venue-grid)" />
            </svg>

            {/* Scan line */}
            <motion.div
              style={{
                position: "absolute", left: 0, right: 0, height: 1, zIndex: 16, pointerEvents: "none",
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)",
              }}
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />

            {/* Corner HUD brackets */}
            <div style={{ position: "absolute", top: 12, left: 12, width: 10, height: 10, borderTop: "1px solid rgba(255,255,255,0.25)", borderLeft: "1px solid rgba(255,255,255,0.25)", zIndex: 20, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 12, right: 12, width: 10, height: 10, borderBottom: "1px solid rgba(255,255,255,0.25)", borderRight: "1px solid rgba(255,255,255,0.25)", zIndex: 20, pointerEvents: "none" }} />
          </motion.div>

          {/* Info cards row */}
          <div className="venue-info-grid" style={{ display: "grid", gap: 24 }}>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                padding: "clamp(24px, 4vw, 32px)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                position: "relative",
              }}
            >
              {/* HUD corners */}
              <div style={{ position: "absolute", top: 12, left: 12, width: 10, height: 10, borderTop: "1px solid rgba(255,255,255,0.2)", borderLeft: "1px solid rgba(255,255,255,0.2)" }} />
              <div style={{ position: "absolute", bottom: 12, right: 12, width: 10, height: 10, borderBottom: "1px solid rgba(255,255,255,0.2)", borderRight: "1px solid rgba(255,255,255,0.2)" }} />

              <span style={{ fontSize: 9, letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase" }}>
                PRIMARY ADDRESS
              </span>
              <p style={{ fontSize: 13, lineHeight: 2, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", margin: 0, fontFamily: "var(--font-orbitron)" }}>
                ATMIYA UNIVERSITY<br />
                YOGIDHAM GURUKUL, KALAWAD RD<br />
                RAJKOT, GUJARAT<br />
                INDIA — 360005
              </p>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
              <div>
                <span style={{ fontSize: 9, letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                  ACCESS CODE
                </span>
                <div style={{
                  fontFamily: "monospace", fontSize: 13,
                  color: "rgba(255,255,255,0.8)", letterSpacing: "0.4em",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "12px 16px", textAlign: "center",
                }}>
                  COMMIT CODE-2026-RAJKOT
                </div>
              </div>
            </motion.div>

            {/* Status + Date cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(34,197,94,0.2)",
                  background: "rgba(34,197,94,0.04)",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: 9, letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>VENUE STATUS</span>
                  <span style={{ fontSize: 12, letterSpacing: "0.2em", color: "#22c55e", fontWeight: 700, textTransform: "uppercase" }}>READY FOR DOCKING</span>
                </div>
                <motion.div
                  style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 12px rgba(34,197,94,0.6)" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(59,130,246,0.2)",
                  background: "rgba(59,130,246,0.04)",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: 9, letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>LAUNCH DATE</span>
                  <span style={{ fontSize: 12, letterSpacing: "0.2em", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>MAR 14–15, 2026</span>
                </div>
                <div style={{ fontSize: 20 }}>🚀</div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
