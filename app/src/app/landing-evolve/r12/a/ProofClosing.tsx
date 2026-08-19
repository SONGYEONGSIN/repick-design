"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5B4FC]";

const STATS: { label: string; value: string }[] = [
  { label: "VERIFIED SELLERS", value: "12,400+" },
  { label: "AVG FIRST OFFER", value: "48hr" },
  { label: "BUYER RATING", value: "4.8/5" },
  { label: "PAID TO SELLERS THIS MONTH", value: "$2.1M" },
];

const TESTIMONIALS: { quote: string; name: string; role: string; rating: string }[] = [
  {
    quote:
      "I watched a bag I’d saved for weeks drop 40% in real time — the match score didn’t move, only the price did. That told me exactly what changed.",
    name: "Priya N.",
    role: "Repeat buyer",
    rating: "4.9",
  },
  {
    quote:
      "Grades used to be a guess. Now I can see which photo frame the condition call came from before I message a seller.",
    name: "Devon K.",
    role: "Verified seller",
    rating: "4.8",
  },
  {
    quote:
      "I keep the feed open while I work. Pausing it to actually read a match feels like the point, not an afterthought.",
    name: "Marisol T.",
    role: "Long-time buyer",
    rating: "5.0",
  },
];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function ProofClosing() {
  const prefersReducedMotion = useReducedMotion();
  const initial = prefersReducedMotion ? false : "hidden";

  return (
    <>
      <section id="proof" className="border-b border-white/10 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-[640px]">
            <p className="text-xs font-semibold tracking-[0.28em] text-[#A5B4FC]">TRUSTED BY THE RESALE COMMUNITY</p>
            <h2 className="mt-4 text-[clamp(1.9rem,5vw,2.6rem)] font-extrabold tracking-[-0.02em] text-white">
              Numbers the feed keeps proving.
            </h2>
          </div>

          <motion.dl
            className="mt-14 grid grid-cols-2 gap-8 border-y border-white/10 py-10 lg:grid-cols-4"
            variants={listVariants}
            initial={initial}
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <dt className="text-[11px] font-normal tracking-[0.12em] text-zinc-400">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-extrabold tabular-nums text-white lg:text-4xl">{stat.value}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.ul
            className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3"
            variants={listVariants}
            initial={initial}
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {TESTIMONIALS.map((t) => (
              <motion.li
                key={t.name}
                variants={itemVariants}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex items-center gap-1 text-xs font-semibold tabular-nums text-zinc-300">
                  <Star className="h-3.5 w-3.5 fill-[#A5B4FC] text-[#A5B4FC]" aria-hidden />
                  {t.rating}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-[1.6] text-zinc-300">
                  “{t.quote}”
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6366F1]/50 text-xs font-semibold text-[#A5B4FC]"
                  >
                    {t.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <cite className="not-italic">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs font-normal text-zinc-400">{t.role}</p>
                  </cite>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <motion.section
        id="cta"
        className="border-b border-white/10 bg-white/[0.03] px-6 py-24 lg:px-10 lg:py-28"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-[560px]">
            <h2 className="text-[clamp(1.9rem,5vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
              Your next match might already be live.
            </h2>
            <p className="mt-4 max-w-[460px] text-[15px] leading-[1.6] text-zinc-400">
              Set a saved search once. Cascade keeps watching, grading and verifying so you don’t have to refresh.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <a
              href="#top"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 text-sm font-semibold text-white transition hover:bg-[#4338CA] ${focusRing}`}
            >
              Start matching
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <p className="text-xs font-normal text-zinc-400">Free to browse. No account needed to watch the feed.</p>
          </div>
        </div>
      </motion.section>
    </>
  );
}
