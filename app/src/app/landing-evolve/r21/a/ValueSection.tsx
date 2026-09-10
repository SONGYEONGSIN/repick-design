"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eye, ListOrdered, Lock } from "lucide-react";
import { VALUE_COLUMNS } from "./data";
import { ACCENT_HEX, cx, MUTED, TRACK_STAT } from "./tokens";

const ICONS = [Lock, ListOrdered, Eye];

export default function ValueSection() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section className="border-t border-zinc-200 bg-[#FAFAF9]">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl">Why the order matters</h2>
          <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>02 — Method</span>
        </div>
        <p className={cx("mt-2 max-w-[480px] text-base leading-relaxed", MUTED)}>
          A drag bar over hypothetical states would be a toy. This one moves across a fixed sequence
          that already happened, once, to one coat.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUE_COLUMNS.map((col, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={col.title}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.08, ease: "easeOut" }}
                className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <Icon size={18} style={{ color: ACCENT_HEX }} aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-zinc-900">{col.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{col.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
