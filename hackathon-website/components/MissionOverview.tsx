"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

const MISSION_STATS = [
  { value: 12,    label: "DURATION",     unit: "HRS",  prefix: "" },
  { value: 500,   label: "PARTICIPANTS", unit: "",     prefix: "" },
  { value: 6,     label: "TRACKS",       unit: "",     prefix: "" },
  { value: 20000, label: "PRIZE POOL",   unit: "",     prefix: "₹" },
];

const TERMINAL_CODE = [
  { line: 1, text: "const mission = {" },
  { line: 2, text: "  objective: \"Build the future\",", isString: true, strVal: "\"Build the future\"" },
  { line: 3, text: "  duration: \"12 Hours\",",           isString: true, strVal: "\"12 Hours\"" },
  { line: 4, text: "  participants: 500,",               isNum: true,    numVal: "500" },
  { line: 5, text: "  sectors: 6",                       isNum: true,    numVal: "6" },
  { line: 6, text: "}" },
];

function Counter({ value, prefix = "", unit = "" }: { value: number; prefix?: string; unit?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => setCount(Math.floor(obj.val)),
      });
    }
  }, [value, inView]);

  return (
    <span ref={ref} style={{ fontFamily: "var(--font-orbitron)", fontWeight: 900, color: "white", lineHeight: 1, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
      {prefix}{count.toLocaleString("en-IN")}
    </span>
  );
}

function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisibleLines(i);
        if (i >= TERMINAL_CODE.length) clearInterval(interval);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "100%",
        borderRadius: 16,
        border: "1px solid rgba(128,200,255,0.2)",
        background: "rgba(5,7,10,0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 50px rgba(128,200,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Terminal header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.35)", letterSpacing: "0.4em" }}>MISSION.JS</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Code lines */}
      <div style={{ padding: "20px", fontFamily: "monospace", fontSize: "clamp(12px, 1.5vw, 14px)", lineHeight: "2rem" }}>
        {TERMINAL_CODE.map((line, i) => (
          <motion.div
            key={i}
            style={{ display: "flex", gap: 16, alignItems: "center", minHeight: 28, opacity: 0 }}
            animate={visibleLines > i ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            <span style={{ color: "rgba(255,255,255,0.12)", width: 16, textAlign: "right", userSelect: "none" }}>{line.line}</span>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {line.isString && line.strVal ? (
                <>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{line.text.replace(line.strVal, "")}</span>
                  <span style={{ color: "#80c8ff", fontWeight: 600 }}>{line.strVal}</span>
                </>
              ) : line.isNum && line.numVal ? (
                <>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{line.text.replace(line.numVal, "")}</span>
                  <span style={{ color: "#ffbd2e", fontWeight: 600 }}>{line.numVal}</span>
                </>
              ) : (
                <span style={{ color: "rgba(255,255,255,0.8)" }}>{line.text}</span>
              )}
              {visibleLines === i + 1 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ display: "inline-block", width: 6, height: 16, background: "#80c8ff", marginLeft: 4, verticalAlign: "middle" }}
                />
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function MissionOverview() {
  return (
    <section
      id="mission"
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

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: 10, letterSpacing: "0.5em", color: "rgba(255,255,255,0.25)", marginBottom: 16, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}
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
            fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
            fontWeight: 900,
            color: "white",
            letterSpacing: "2px",
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: 80,
            fontFamily: "var(--font-orbitron)",
            textAlign: "center",
          }}
        >
          YOUR MISSION
        </motion.h2>

        {/* Two column layout */}
        <div className="mission-grid">

          {/* Left — stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 48, fontFamily: "sans-serif", letterSpacing: "0.02em" }}
            >
              A 12-hour sprint to build the future. Join 500+ innovators tackling real-world challenges across 6 cutting-edge tracks. The mission starts March 14, 2026.
            </motion.p>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {MISSION_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: "28px 24px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <Counter value={stat.value} prefix={stat.prefix} unit={stat.unit} />
                    {stat.unit && (
                      <span style={{ fontSize: 11, color: "#80c8ff", fontWeight: 700, letterSpacing: "0.3em" }}>{stat.unit}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase" }}>
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — terminal */}
          <Terminal />

        </div>
      </div>
    </section>
  );
}
