"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#mission" },
  { label: "TRACKS", href: "#tracks" },
  { label: "TIMELINE", href: "#timeline" },
  { label: "PRIZES", href: "#prizes" },
  { label: "SPONSORS", href: "#sponsors" },
  { label: "VENUE", href: "#venue" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar({ show, onRegisterClick }: { show: boolean; onRegisterClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Automatic Section Highlighting Logic
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Focus area in the upper-middle part of screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Watch each section defined in NAV_LINKS
    NAV_LINKS.forEach(({ href }) => {
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  if (!show) return null;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-45 flex items-center px-6 md:px-20 h-[72px]"
        style={{
          fontFamily: "var(--font-orbitron)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: scrolled || menuOpen
            ? "rgba(0,0,0,0.85)"
            : "rgba(0,0,0,0.30)",
          borderBottom: scrolled || menuOpen
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          transition: "background 0.4s, border-color 0.4s",
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Logo - Aligned with left content column */}
        <div className="flex-1 flex justify-start items-center">
          <a href="#home" className="group" onClick={() => setMenuOpen(false)}>
            <span className="text-[18px] font-black tracking-[6px] text-white transition-opacity duration-300 group-hover:opacity-80">
              ASTRA
            </span>
          </a>
        </div>

        {/* Navigation - Perfectly centered (Desktop Only) */}
        <nav className="hidden lg:flex flex-[2] justify-center items-center gap-10">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = active === href.slice(1);

            return (
              <motion.a
                key={label}
                href={href}
                className="relative px-2 py-1 text-[10px] font-bold tracking-[3px] uppercase transition-colors duration-300"
                style={{
                  color: isActive
                    ? "#ffffff"
                    : "rgba(255,255,255,0.45)",
                }}
                whileHover={{
                  color: "#ffffff",
                }}
              >
                {label}

                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-1 h-px bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  />
                )}
              </motion.a>
            );
          })}
        </nav>

        {/* CTA - Aligned with right grid boundary (Desktop Only) */}
        <div className="hidden lg:flex flex-1 justify-end items-center">
          <motion.a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick();
            }}
            whileHover={{
              scale: 1.03,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.35)",
              boxShadow: "0 0 24px rgba(255,255,255,0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              flex
              items-center
              justify-center
              gap-3
              w-[200px]
              h-[48px]
              rounded-2xl
              border
              border-white/15
              bg-black/20
              backdrop-blur-xl
              text-[11px]
              font-semibold
              tracking-[4px]
              uppercase
              text-white
              overflow-hidden
              group
            "
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <span className="relative z-10">
              REGISTER NOW
            </span>

            <motion.span
              className="relative z-10 text-lg"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </motion.a>
        </div>

        {/* Mobile Toggle & Mini Register CTA */}
        <div className="lg:hidden flex items-center gap-4">
          <motion.button
            onClick={() => onRegisterClick()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              px-5
              h-[36px]
              rounded-xl
              border
              border-white/15
              bg-white/5
              text-[9px]
              font-bold
              tracking-[2px]
              uppercase
              text-white
              backdrop-blur-xl
            "
          >
            REGISTER
          </motion.button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-[72px] bg-black/95 backdrop-blur-2xl z-40 lg:hidden flex flex-col items-center justify-center gap-8 px-6 border-b border-white/5"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {NAV_LINKS.map(({ label, href }, index) => (
              <motion.a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-[13px] font-black tracking-[4px] uppercase text-white/50 hover:text-white transition-colors py-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}