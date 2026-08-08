"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  { q: "Who can participate?",           a: "Any student or professional aged 18+ can participate. Teams of 2–4 members are recommended, but solo entries are accepted." },
  { q: "Is it free to register?",        a: "Yes, registration is completely free. All participants will receive access to mentors, workshops, and resources." },
  { q: "What should I bring?",           a: "Bring your laptop, charger, and any hardware you plan to use. Food and beverages will be provided throughout the event." },
  { q: "Can I start coding beforehand?", a: "No. All code must be written during the 12-hour hackathon window. Pre-existing libraries and frameworks are allowed." },
  { q: "How are projects judged?",       a: "Projects are evaluated on innovation, technical complexity, impact, and presentation quality by a panel of industry experts." },
  { q: "Will there be mentors?",         a: "Yes. Industry mentors from leading tech and space organizations will be available throughout the event for guidance." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
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

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: 10, letterSpacing: "0.5em", color: "rgba(255,255,255,0.25)", marginBottom: 16, fontWeight: 700, textTransform: "uppercase" }}
        >
          MISSION BRIEFING
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
          FAQ
        </motion.h2>

        {/* FAQ list */}
        <div style={{ width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: 14,
                border: open === i ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.07)",
                background: open === i ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                overflow: "hidden",
                transition: "border-color 0.3s, background 0.3s",
              }}
            >
              {/* Question row */}
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "24px 28px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: open === i ? "white" : "rgba(255,255,255,0.65)",
                  fontFamily: "var(--font-orbitron)",
                  transition: "color 0.2s",
                }}>
                  {q}
                </span>

                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    flexShrink: 0,
                    width: 28, height: 28,
                    borderRadius: "50%",
                    border: `1px solid ${open === i ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: open === i ? "white" : "rgba(255,255,255,0.4)",
                    fontSize: 18, lineHeight: 1,
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                >
                  +
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "0 28px 24px" }}>
                      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />
                      <p style={{
                        fontSize: 13,
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.55)",
                        fontFamily: "sans-serif",
                        letterSpacing: "0.02em",
                        margin: 0,
                      }}>
                        {a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
