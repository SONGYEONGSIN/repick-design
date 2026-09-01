"use client";

import { motion, useReducedMotion } from "framer-motion";
import { socialStats, testimonials } from "./data";
import { cx, MUTED, NUM, TRACK_STAT } from "./tokens";

export default function SocialProof() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl">Social proof</h2>
        <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>04 — Proof</span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border-y border-zinc-200 py-8 sm:grid-cols-4">
        {socialStats.map((s) => (
          <div key={s.label} className="min-w-0">
            <p className={cx(NUM, "text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl")}>{s.value}</p>
            <p className={cx("mt-1 text-xs leading-relaxed", MUTED)}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.08, ease: "easeOut" }}
            className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <span aria-hidden="true" className="block text-5xl font-extrabold leading-none text-zinc-500">
              &ldquo;
            </span>
            <blockquote className="mt-2 max-w-[480px] text-base leading-relaxed text-zinc-800">{t.quote}</blockquote>
            <figcaption className="mt-4 text-xs text-zinc-600">
              <span className="font-semibold text-zinc-900">{t.name}</span> · {t.role}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
