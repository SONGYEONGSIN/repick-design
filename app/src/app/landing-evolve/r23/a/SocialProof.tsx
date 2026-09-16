"use client";

import { type ReactNode } from "react";
import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EYEBROW, SITE_STATS, TESTIMONIALS } from "./data";

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function SocialProof() {
  return (
    <section id="proof" className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1240px]">
        <Reveal>
          <p className={EYEBROW}>ACROSS EVERY GRADED LISTING</p>
          <h2
            className="mt-4 max-w-[560px] text-[clamp(1.7rem,3.6vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-white"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            The pipeline holds up at scale, not just on this coat.
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-10 grid grid-cols-1 gap-6 border-y border-white/10 py-8 sm:grid-cols-3">
          {SITE_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-[32px] font-extrabold tabular-nums text-white">{stat.value}</p>
              <p className="mt-1 text-[13px] font-normal text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={0.05 * (i + 1)} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111116] p-6">
              <Quote className="h-5 w-5 text-[#D9BE84]" aria-hidden="true" />
              <p className="text-[14px] font-normal leading-[1.6] text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-[12.5px] font-semibold text-white">{t.name}</p>
                <p className="text-[12px] font-normal text-zinc-400">{t.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
