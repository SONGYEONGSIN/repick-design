"use client";

import { ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PRODUCT_CATEGORIES, PRODUCT_LISTINGS, FOCUS_RING } from "./lib";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

type Category = (typeof PRODUCT_CATEGORIES)[number];

export function ProductPreview() {
  const [category, setCategory] = useState<Category>("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const listings =
    category === "All" ? PRODUCT_LISTINGS : PRODUCT_LISTINGS.filter((item) => item.category === category);

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="product-preview" className="bg-[#0b0b0f] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl">
            Every match comes with its proof.
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
            Each listing below carries the same four checks the counter above relies on: an AI
            match score, a condition grade, seller verification, and the discount against retail.
          </p>
        </Reveal>

        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                  active
                    ? "bg-green-500 text-[#0b0b0f]"
                    : "border border-white/15 text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <RevealGroup className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((item) => {
            const isOpen = expanded.has(item.id);
            const discount = Math.round(((item.priceBefore - item.priceAfter) / item.priceBefore) * 100);
            const panelId = `reasoning-${item.id}`;
            return (
              <RevealItem key={item.id} className="min-w-0">
                <article className="flex h-full min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-zinc-800">
                    <Image
                      src={`https://images.unsplash.com/${item.imageId}?auto=format&fit=crop&w=640&q=70`}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <h3 className="text-sm font-extrabold tracking-[-0.02em] text-white">{item.title}</h3>
                    <p className="mt-1 text-sm tabular-nums text-zinc-400">
                      <span className="line-through">${item.priceBefore.toLocaleString("en-US")}</span>{" "}
                      <span className="font-semibold text-green-400">
                        ${item.priceAfter.toLocaleString("en-US")}
                      </span>{" "}
                      <span className="text-zinc-400">(−{discount}%)</span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-green-500/40 px-2 py-1 text-[11px] font-semibold text-green-300">
                        <Sparkles aria-hidden="true" size={11} />
                        {item.matchPercent}% match
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[11px] font-semibold text-zinc-300">
                        Grade {item.conditionGrade}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[11px] font-semibold text-zinc-300">
                        <ShieldCheck aria-hidden="true" size={11} />
                        Verified
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleExpanded(item.id)}
                      className={`mt-3 inline-flex items-center gap-1 self-start text-xs font-semibold text-zinc-400 transition-colors hover:text-green-300 ${FOCUS_RING} rounded`}
                    >
                      Why this match
                      <ChevronDown
                        aria-hidden="true"
                        size={14}
                        className={`transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <p id={panelId} className="mt-2 text-xs leading-relaxed text-zinc-400">
                        {item.reasoning}
                      </p>
                    )}
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
