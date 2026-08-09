"use client";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EarthCanvas from "@/components/EarthCanvas";
import Hero from "@/components/Hero";
import MissionOverview from "@/components/MissionOverview";
import Tracks from "@/components/Tracks";
import Timeline from "@/components/Timeline";
import Prizes from "@/components/Prizes";
import Sponsors from "@/components/Sponsors";
import Venue from "@/components/Venue";
import FAQ from "@/components/FAQ";
import RegisterCTA from "@/components/RegisterCTA";
import Navbar from "@/components/Navbar";

const DASHBOARD_URL = "https://hackathon-indol-sigma.vercel.app/register";

const IntroAnimation = dynamic(() => import("@/components/IntroAnimation"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const [introDone, setIntroDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
  }, [introDone]);

  const handleRegister = () => {
    window.location.href = DASHBOARD_URL;
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      // Coordination progress: Earth finishes its main mission transition early in the scroll
      const progress = Math.min(1, e.scroll / (window.innerHeight * 2.5));
      setScrollProgress(progress);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!introDone) return;

    const ctx = gsap.context(() => {
      // Hero Title Fade & Zoom Out
      gsap.to("#hero-content", {
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        y: -100,
        filter: "blur(10px)",
      });

    }, containerRef);

    return () => ctx.revert();
  }, [introDone]);

  return (
    <main ref={containerRef} className="bg-black">
      <Navbar show={introDone} onRegisterClick={handleRegister} />

      <AnimatePresence>
        {!introDone && (
          <IntroAnimation key="intro" onComplete={() => setIntroDone(true)} />
        )}
      </AnimatePresence>

      {/* Persistent Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <EarthCanvas visible={introDone} scrollProgress={scrollProgress} />
      </div>

      {/* Content Layers */}
      <div className="relative z-10">
        {/* Earth Hero Section */}
        <section
          id="home"
          ref={heroRef}
          className="relative h-screen w-screen overflow-hidden"
        >
          <Hero show={introDone} scrollProgress={scrollProgress} onRegisterClick={handleRegister} />
        </section>

        {/* Following Sections in Order */}
        <div className="relative w-full flex flex-col bg-transparent">
          <MissionOverview />
          <Tracks />
          <Timeline />
          <Prizes />
          <Sponsors />
          <Venue />
          <FAQ />
          <RegisterCTA onRegisterClick={handleRegister} />
        </div>
      </div>
    </main>
  );
}
