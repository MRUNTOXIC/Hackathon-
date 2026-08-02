"use client";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/Hero";

export default function RegisterCTA({ onRegisterClick }: { onRegisterClick: () => void }) {
  return (
    <section id="register" className="relative bg-transparent min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden"
      style={{ fontFamily: "var(--font-orbitron)" }}>

      {/* Background glow - cinematic blue */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(60,120,255,0.06), transparent 80%)" }} />

      {/* Decorative SVG grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="reg-grid-cta" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#reg-grid-cta)" />
      </svg>

      {/* Side Telemetry (Cinematic Style) */}
      <div className="absolute left-8 md:left-16 bottom-24 hidden lg:flex flex-col gap-6 pointer-events-none font-mono border-l border-white/10 pl-6">
        {[
          { label: "TRANSMISSION", value: "FINAL BEACON" },
          { label: "SECTOR", value: "X-07 ALPHA" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[9px] tracking-[0.45em] text-white/30 uppercase font-medium">{item.label}</span>
            <span className="text-[11px] tracking-[0.15em] text-white font-bold uppercase">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="absolute right-8 md:right-16 top-24 hidden lg:flex flex-col gap-6 text-right pointer-events-none font-mono border-r border-white/10 pr-6">
        {[
          { label: "LATENCY", value: "0.002 MS" },
          { label: "UPLINK", value: "ACTIVE" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[9px] tracking-[0.45em] text-white/30 uppercase font-medium">{item.label}</span>
            <span className="text-[11px] tracking-[0.15em] text-white font-bold uppercase">{item.value}</span>
          </div>
        ))}
      </div>

      <motion.p className="text-[14px] md:text-[16px] tracking-[0.6em] text-white/40 mb-8 font-medium uppercase font-orbitron"
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        SYSTEMS CHECK COMPLETE
      </motion.p>

      <motion.h2
        className="text-[clamp(2.5rem,12vw,12rem)] font-[900] text-white text-center leading-[0.85] tracking-[-0.04em] uppercase font-orbitron mb-12"
        style={{
          textShadow: "0 0 40px rgba(255,255,255,0.12)",
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 12%, #efefef 28%, #d9d9d9 48%, #c3c3c3 68%, #9f9f9f 88%, #7b7b7b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        INITIATE<br />
        IGNITION
      </motion.h2>

      <motion.p className="text-[16px] md:text-[20px] tracking-[0.25em] text-[#80c8ff] font-medium uppercase mb-16 font-orbitron text-center max-w-2xl leading-relaxed px-4"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.4 }}>
        SECURE YOUR SEAT ON THE NEXT FRONTIER.<br />
        APPLICATIONS CLOSING SOON.
      </motion.p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto">
        <GlassButton
          label="Register Now"
          icon="→"
          primary
          onClick={onRegisterClick}
        />
        <GlassButton
          label="Back to Top"
          icon="↑"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>

      <motion.div
        className="mt-24 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <p className="text-[9px] tracking-[6px] text-white/10 uppercase">
          © 2026 ASTRA HACKATHON · FINAL TRANSMISSION
        </p>
      </motion.div>
    </section>
  );
}
