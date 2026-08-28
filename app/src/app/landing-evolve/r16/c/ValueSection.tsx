"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CATEGORY_META, CATEGORY_ORDER, DISPLAY_FONT, categoryStats } from "./data";

/**
 * Value in three parts — the same three categories the hero's filter operates on, explained on
 * their own. Not another control: this section is the reference the manipulation up in Hero
 * refers back to.
 */
export default function ValueSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h2
        style={DISPLAY_FONT}
        className="max-w-[560px] text-[clamp(1.75rem,1.4rem+1.6vw,2.75rem)] font-bold tracking-[-0.02em] text-zinc-900"
      >
        What repick checks
      </h2>
      <p className="mt-3 max-w-[480px] text-[15px] leading-[1.6] text-zinc-600">
        Every listing above is verified across these three claim types. Toggle them in the redline
        above to see how each one changes what you&apos;re shown.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {CATEGORY_ORDER.map((cat, i) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          const stats = categoryStats(cat);
          return (
            <motion.div
              key={cat}
              initial={shouldReduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: shouldReduce ? 0 : 0.4, delay: shouldReduce ? 0 : i * 0.08 }}
              className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f9ff]">
                <Icon className="h-4 w-4 text-[#0369a1]" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-[16px] font-medium text-zinc-900">{meta.label}</h3>
              <p className="mt-2 max-w-[280px] text-[14px] leading-[1.6] text-zinc-600">
                {meta.description}
              </p>
              <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                <span className="tabular-nums text-[#0369a1]">{stats.count}</span> correction
                {stats.count === 1 ? "" : "s"} found on this listing
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
