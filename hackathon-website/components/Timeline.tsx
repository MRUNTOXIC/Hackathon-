"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

const EVENTS = [
  {
    id: "01",
    date: "JAN 15, 2026",
    label: "Registration Opens",
    desc: "Applications go live. Form your team of 2–4 members and secure your spot.",
    tMinus: "T-59",
    isClimax: false,
  },
  {
    id: "02",
    date: "FEB 01, 2026",
    label: "Team Formation",
    desc: "Finalize your team composition. Solo participants will be matched with suitable teams.",
    tMinus: "T-42",
    isClimax: false,
  },
  {
    id: "03",
    date: "MAR 14, 2026",
    label: "Launch",
    desc: "The 24-hour build cycle commences. T-00:00:00. Mission is live.",
    tMinus: "T-00",
    isClimax: true,
  },
  {
    id: "04",
    date: "MAR 14, 2026",
    label: "Mentoring",
    desc: "Industry mentors are available to guide your team throughout the hackathon.",
    tMinus: "T+04",
    isClimax: false,
  },
  {
    id: "05",
    date: "MAR 15, 2026",
    label: "Submission",
    desc: "Code freeze. Submit your project with full documentation and demo link.",
    tMinus: "T+20",
    isClimax: false,
  },
  {
    id: "06",
    date: "MAR 15, 2026",
    label: "Judging",
    desc: "Panel evaluation begins. Live demos presented to expert jury.",
    tMinus: "T+22",
    isClimax: false,
  },
];

function PulsingDot({ isClimax }: { isClimax: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: isClimax ? 48 : 36,
          height: isClimax ? 48 : 36,
          background: isClimax ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.08)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ repeat: Infinity, duration: isClimax ? 2 : 3, ease: "easeInOut" }}
      />
      {/* Main dot */}
      <motion.div
        className="relative rounded-full border-2 flex items-center justify-center z-10"
        style={{
          width: isClimax ? 28 : 20,
          height: isClimax ? 28 : 20,
          borderColor: isClimax ? "#3b82f6" : "rgba(255,255,255,0.6)",
          background: isClimax ? "rgba(59,130,246,0.3)" : "black",
          boxShadow: isClimax
            ? "0 0 20px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.4)"
            : "0 0 10px rgba(255,255,255,0.3)",
        }}
        animate={isClimax ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <div
          className="rounded-full"
          style={{
            width: isClimax ? 10 : 7,
            height: isClimax ? 10 : 7,
            background: isClimax ? "#3b82f6" : "white",
          }}
        />
      </motion.div>
    </div>
  );
}

function TimelineCard({
  event,
  index,
  isLeft,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="relative rounded-[14px] overflow-hidden cursor-default"
      style={{
        background: event.isClimax
          ? "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(5,7,10,0.95) 60%)"
          : "rgba(255,255,255,0.03)",
        border: event.isClimax
          ? "1.5px solid rgba(59,130,246,0.45)"
          : "1.5px solid rgba(255,255,255,0.07)",
        boxShadow: event.isClimax
          ? "0 0 50px rgba(59,130,246,0.2), 0 20px 60px rgba(0,0,0,0.6)"
          : "0 4px 24px rgba(0,0,0,0.4)",
        backdropFilter: "blur(20px)",
      }}
    >
      {event.isClimax && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent" />
      )}
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span
            className="font-mono font-bold uppercase"
            style={{ fontSize: 13, letterSpacing: "0.2em", color: event.isClimax ? "#60a5fa" : "rgba(147,197,253,0.7)" }}
          >
            {event.date}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
              color: event.isClimax ? "#3b82f6" : "rgba(255,255,255,0.2)",
              border: `1px solid ${event.isClimax ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              background: event.isClimax ? "rgba(59,130,246,0.1)" : "transparent",
            }}
          >
            {event.tMinus}
          </span>
        </div>
        <h3
          className="font-black font-orbitron uppercase"
          style={{
            fontSize: event.isClimax ? "clamp(1.1rem, 2vw, 1.4rem)" : "clamp(0.85rem, 1.5vw, 1rem)",
            letterSpacing: "2px",
            lineHeight: 1.2,
            color: event.isClimax ? "white" : "rgba(255,255,255,0.85)",
            textShadow: event.isClimax ? "0 0 20px rgba(59,130,246,0.4)" : "none",
            margin: 0,
          }}
        >
          {event.label}
        </h3>
        <p style={{ fontSize: 12, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", margin: 0, fontFamily: "sans-serif" }}>
          {event.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      ref={containerRef}
      style={{ fontFamily: "var(--font-orbitron)", position: "relative", padding: "128px 0", zIndex: 10 }}
    >
      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "rgba(59,130,246,0.04)", filter: "blur(150px)",
        }} />
      </div>

      {/* Inner container */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Title */}
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
            marginBottom: 96,
            fontFamily: "var(--font-orbitron)",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          LAUNCH SEQUENCE
        </motion.h2>

        {/* Timeline wrapper — position relative so the absolute line is scoped here */}
        <div style={{ position: "relative", width: "100%" }}>

          {/* ── DESKTOP: vertical center line ── */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 2,
              background: "rgba(255,255,255,0.05)",
              zIndex: 1,
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                transformOrigin: "top",
                height: lineHeight,
                background: "linear-gradient(to bottom, rgba(59,130,246,0.9), rgba(59,130,246,0.3))",
                boxShadow: "0 0 8px rgba(59,130,246,0.6)",
              }}
            />
          </div>

          {/* ── MOBILE: vertical left line ── */}
          <div
            className="block md:hidden"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 16,
              width: 2,
              background: "rgba(255,255,255,0.05)",
              zIndex: 1,
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                transformOrigin: "top",
                height: lineHeight,
                background: "linear-gradient(to bottom, rgba(59,130,246,0.9), rgba(59,130,246,0.3))",
                boxShadow: "0 0 8px rgba(59,130,246,0.6)",
              }}
            />
          </div>

          {/* Events */}
          {EVENTS.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={event.id} style={{ position: "relative", marginBottom: index === EVENTS.length - 1 ? 0 : 64 }}>

                {/* ── DESKTOP ROW ── */}
                <div className="hidden md:flex" style={{ alignItems: "center", width: "100%" }}>

                  {/* Left cell — exactly 50% wide */}
                  <div style={{ width: "50%", display: "flex", justifyContent: "flex-end", paddingRight: 48 }}>
                    {isLeft && (
                      <div style={{ width: "100%", maxWidth: 420 }}>
                        <TimelineCard event={event} index={index} isLeft={true} />
                      </div>
                    )}
                  </div>

                  {/* Dot — sits exactly on the 50% line */}
                  <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
                    <PulsingDot isClimax={event.isClimax} />
                  </div>

                  {/* Right cell — exactly 50% wide */}
                  <div style={{ width: "50%", display: "flex", justifyContent: "flex-start", paddingLeft: 48 }}>
                    {!isLeft && (
                      <div style={{ width: "100%", maxWidth: 420 }}>
                        <TimelineCard event={event} index={index} isLeft={false} />
                      </div>
                    )}
                  </div>

                </div>

                {/* ── MOBILE ROW ── */}
                <div className="flex md:hidden" style={{ alignItems: "flex-start", gap: 20, paddingLeft: 8 }}>
                  <div style={{ flexShrink: 0, marginTop: 16, zIndex: 2 }}>
                    <PulsingDot isClimax={event.isClimax} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TimelineCard event={event} index={index} isLeft={false} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
