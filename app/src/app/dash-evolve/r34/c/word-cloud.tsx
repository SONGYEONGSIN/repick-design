"use client";

import { useState } from "react";
import type { ScaledWord } from "./data";
import { SENTIMENT_LABEL } from "./data";
import { SENTIMENT_ICON, SENTIMENT_TILE_CLASS } from "./sentiment-meta";

const NUMBER_FORMAT = new Intl.NumberFormat("en-US");

/**
 * Deterministic size tier, a pure function of a word's rank (its index in the
 * already-sorted, already-filtered list). No randomness, no packing/collision
 * retries — the browser's own flex-wrap handles placement, which is why this
 * layout is reflow-safe at every viewport without any absolute positioning.
 */
function tierForIndex(i: number): 1 | 2 | 3 | 4 | 5 {
  if (i < 3) return 1;
  if (i < 8) return 2;
  if (i < 16) return 3;
  if (i < 28) return 4;
  return 5;
}

const TIER_CLASS: Record<number, string> = {
  1: "text-2xl sm:text-3xl font-bold px-4 py-2",
  2: "text-xl sm:text-2xl font-bold px-3.5 py-1.5",
  3: "text-base sm:text-lg font-medium px-3 py-1.5",
  4: "text-sm font-medium px-2.5 py-1",
  5: "text-xs font-normal px-2 py-1",
};

const ICON_SIZE: Record<number, string> = {
  1: "h-5 w-5",
  2: "h-4 w-4",
  3: "h-4 w-4",
  4: "h-3.5 w-3.5",
  5: "h-3 w-3",
};

export function WordCloud({ words }: { words: ScaledWord[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (words.length === 0) {
    return (
      <p className="py-8 text-center text-sm font-normal text-zinc-400">
        No words match this filter.
      </p>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Word cloud of ${words.length} words, tile size by mention frequency, color by sentiment. Hover or focus a tile for its exact count — the table below lists every value.`}
      className="flex flex-wrap items-center gap-2"
    >
      {words.map((w, i) => {
        const tier = tierForIndex(i);
        const Icon = SENTIMENT_ICON[w.sentiment];
        const active = activeIndex === i;
        const tooltipId = `wc-tip-${w.word}`;
        return (
          <span key={w.word} className="relative inline-flex">
            <button
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex((c) => (c === i ? null : c))}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex((c) => (c === i ? null : c))}
              aria-describedby={tooltipId}
              className={`inline-flex items-center gap-1.5 rounded-lg border leading-none transition-[background-color,border-color,filter] duration-150 motion-reduce:transition-none hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${SENTIMENT_TILE_CLASS[w.sentiment]} ${TIER_CLASS[tier]}`}
            >
              <Icon aria-hidden="true" className={`shrink-0 ${ICON_SIZE[tier]}`} />
              {w.word}
            </button>
            <span
              id={tooltipId}
              role="tooltip"
              className={`pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs font-normal tabular-nums text-zinc-50 shadow-lg shadow-black/40 transition-opacity duration-150 motion-reduce:transition-none ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="font-medium">{w.word}</span> — {NUMBER_FORMAT.format(w.count)} mentions ·{" "}
              {SENTIMENT_LABEL[w.sentiment]} ({w.sharePct.toFixed(1)}% of all mentions)
            </span>
          </span>
        );
      })}
    </div>
  );
}
