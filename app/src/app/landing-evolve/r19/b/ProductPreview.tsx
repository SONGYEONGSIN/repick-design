"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { GradeBadge, MatchBadge, VerifiedBadge } from "./Badges";
import { previewItems, type PreviewCategory } from "./data";
import PhotoTile from "./PhotoTile";
import { cx, FOCUS, MUTED, NUM, TRACK_STAT, TRANSITION } from "./tokens";

const CATEGORIES: Array<PreviewCategory | "All"> = ["All", "Electronics", "Furniture", "Fashion", "Gaming"];

export default function ProductPreview() {
  const reduceMotion = Boolean(useReducedMotion());
  const [active, setActive] = useState<PreviewCategory | "All">("All");

  const items = useMemo(() => (active === "All" ? previewItems : previewItems.filter((p) => p.category === active)), [active]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl">Product preview</h2>
        <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>02 — Catalog</span>
      </div>
      <p className={cx("mt-2 max-w-[480px] text-base leading-relaxed", MUTED)}>
        Every category runs its own order book. Filter to see the same AI grading, verification, and pricing logic at work.
      </p>

      <div role="radiogroup" aria-label="Filter product preview by category" className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActive(cat)}
              className={cx(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                TRANSITION,
                FOCUS,
                isActive ? "border-[#92400E] bg-[#92400E] text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const discount = Math.round((1 - item.price / item.originalPrice) * 100);
          return (
            <motion.article
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : Math.min(i, 3) * 0.06, ease: "easeOut" }}
              className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-900/[0.03]"
            >
              <PhotoTile icon={item.icon} ratio="4 / 3" className="w-full" />
              <h3 className="mt-3 truncate text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="truncate text-xs text-zinc-600">{item.spec}</p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <MatchBadge match={item.match} />
                <GradeBadge grade={item.grade} />
              </div>
              {item.verified && (
                <div className="mt-1.5">
                  <VerifiedBadge />
                </div>
              )}

              <ul className="mt-2.5 flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((t) => (
                  <li key={t} className="rounded-full border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-600">
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-end justify-between border-t border-zinc-200 pt-3">
                <div>
                  <span className={cx(NUM, "block text-[11px] text-zinc-500 line-through")}>${item.originalPrice.toLocaleString("en-US")}</span>
                  <span className={cx(NUM, "text-base font-extrabold text-zinc-900")}>${item.price.toLocaleString("en-US")}</span>
                </div>
                <span className={cx(NUM, "text-xs font-semibold text-zinc-700")}>{`−${discount}%`}</span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
