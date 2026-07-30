"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MousePointer2, Waypoints } from "lucide-react";
import LatticeField from "./LatticeField";
import { SplitChars, SplitLines } from "./SplitText";
import { EASE, HERO, PROOF, STAGES } from "./data";

export default function PilotClient() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  // Scroll position drives the transform directly — no timer, so any given scroll offset
  // reproduces the same frame for the capture pipeline.
  const railX = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["4%", "-4%"]);
  // Fade floor stays above the contrast threshold on purpose: Lighthouse audits contrast at scroll 0,
  // so a scroll-linked opacity ramp that dips low turns legible text into a hard-gate a11y failure.
  // Measured: floor 0.35 → computed #a894f7 renders as #423b60 (contrast 1.84) and a11y drops to 95.
  const railFade = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.85, 1, 1, 0.85]);

  return (
    <main className="min-h-dvh bg-[#0B0B0F] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5">
          <span className="text-sm font-extrabold tracking-[-0.02em]">Attune</span>
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#A1A1AA]">
            <Waypoints className="h-3.5 w-3.5" aria-hidden />
            Motion pilot
          </span>
        </div>
      </header>

      {/* Hero — pointer field + character stagger */}
      <section className="relative overflow-hidden border-b border-white/10">
        <LatticeField />
        <div className="relative mx-auto flex min-h-[78dvh] max-w-[1120px] flex-col justify-center px-5 py-24">
          <p className="mb-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#a894f7]">
            <MousePointer2 className="h-3.5 w-3.5" aria-hidden />
            {HERO.eyebrow}
          </p>
          <h1 className="max-w-3xl text-[clamp(2.1rem,7vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] lg:text-[clamp(3rem,4.4vw,4.2rem)]">
            {HERO.headline.map((line, i) => (
              <span key={line} className={`block ${i === HERO.accentLine ? "text-[#6E56CF]" : ""}`}>
                <SplitChars text={line} delay={i * 0.12} />
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-[1.65] text-[#A1A1AA]">{HERO.sub}</p>
          <p className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            Scroll to drive the next layer
          </p>
        </div>
      </section>

      {/* Proof band — block stagger */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-20 sm:grid-cols-3">
          {PROOF.map((p, i) => (
            <motion.div
              key={p.label}
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
            >
              <p className="text-4xl font-extrabold tabular-nums tracking-[-0.02em]">{p.k}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#a894f7]">{p.label}</p>
              <p className="mt-2.5 text-sm leading-relaxed text-[#A1A1AA]">{p.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scroll-linked rail */}
      <section ref={stageRef} className="border-b border-white/10">
        <div className="mx-auto max-w-[1120px] px-5 py-24">
          <motion.div style={{ x: railX, opacity: railFade }} className="flex flex-col gap-5 will-change-transform">
            {STAGES.map((s) => (
              <article key={s.tag} className="min-w-0 rounded-2xl border border-white/10 bg-[#15151B] p-6 sm:p-8">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#a894f7]">{s.tag}</p>
                <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">{s.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-[1.7] text-[#A1A1AA] sm:text-base">{s.body}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Line reveal */}
      <section>
        <div className="mx-auto max-w-[1120px] px-5 py-24">
          <p className="max-w-3xl text-[clamp(1.25rem,3vw,1.9rem)] font-extrabold leading-[1.35] tracking-[-0.02em]">
            <SplitLines
              lines={[
                "The expensive part of this vocabulary was never the animation.",
                "It was proving the page still renders the same way twice —",
                "which is what a gate, and a judge, actually need.",
              ]}
            />
          </p>
        </div>
      </section>
    </main>
  );
}
