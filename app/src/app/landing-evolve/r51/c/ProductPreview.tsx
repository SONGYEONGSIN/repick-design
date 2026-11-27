"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { CATEGORIES, MONTHS, affordableForMonth, formatUsd } from "./data";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

export default function ProductPreview({ values, activeIndex }: { values: number[]; activeIndex: number }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const monthValue = values[activeIndex];
  const selection = affordableForMonth(monthValue, category, 3);

  return (
    <section id="plan" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <Reveal>
        <h2 className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em] text-white">
          What this month&rsquo;s number buys
        </h2>
        <p className={`mt-3 max-w-[492px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
          This grid reads one point off your curve above — the month you&rsquo;re currently
          adjusting — and pulls real, verified listings that fit inside it. Drag a different
          point, or change the month by tabbing to it, and the cards below change with it.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={`min-h-9 rounded-full border px-3 text-xs font-semibold transition-colors duration-200 ${FOCUS_RING} ${
                  active
                    ? "border-[#22D3EE] bg-[#22D3EE] text-[#0B0B0F]"
                    : `border-[#23232C] bg-transparent ${MUTED_TEXT} hover:border-[#22D3EE] hover:text-white`
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.12em] ${MUTED_TEXT}`}>
          Showing picks for {MONTHS[activeIndex]} at {formatUsd(monthValue)}
          {category !== "All" ? ` · ${category}` : ""}
        </p>
      </Reveal>

      <Reveal delay={0.12} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selection.items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </Reveal>

      {selection.isFallback && (
        <Reveal delay={0.14}>
          <p className={`mt-4 max-w-[370px] text-xs font-normal leading-[1.5] ${MUTED_TEXT}`}>
            Nothing in this category fits {MONTHS[activeIndex]}&rsquo;s {formatUsd(monthValue)} yet —
            shown above is the closest listing in reach. Add {formatUsd(selection.cheapestGap ?? 0)}{" "}
            to this month to unlock it.
          </p>
        </Reveal>
      )}
    </section>
  );
}
