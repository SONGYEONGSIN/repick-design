"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Percent,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import Reveal from "./Reveal";
import { PRODUCTS, type Product } from "./data";

type SortMode = "match" | "price";

function sortProducts(products: Product[], mode: SortMode): Product[] {
  const copy = [...products];
  if (mode === "match") {
    copy.sort((a, b) => b.matchPct - a.matchPct);
  } else {
    copy.sort((a, b) => a.priceAfter - b.priceAfter);
  }
  return copy;
}

export default function ProductPreview() {
  const [sortMode, setSortMode] = useState<SortMode>("match");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const products = useMemo(() => sortProducts(PRODUCTS, sortMode), [sortMode]);

  return (
    <section id="listings" className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-[36rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
              Listings, graded
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-4xl"
            >
              What a graded listing looks like
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">
              Every card below carries the same four checks: an AI match reason, a
              condition grade, a seller verification badge, and the discount from
              original retail.
            </p>
          </div>

          <div
            role="group"
            aria-label="Sort listings"
            className="flex shrink-0 gap-1 rounded-full bg-zinc-100 p-1"
          >
            {(
              [
                { id: "match", label: "Best match" },
                { id: "price", label: "Lowest price" },
              ] as const
            ).map((opt) => {
              const active = sortMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSortMode(opt.id)}
                  className={[
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-rose-600 focus-visible:outline-offset-2",
                    active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const expanded = expandedId === product.id;
            const panelId = `condition-report-${product.id}`;
            return (
              <Reveal key={product.id} delay={Math.min(i, 3) * 0.06} className="min-w-0">
                <article className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-200 p-5">
                  <div
                    className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-zinc-100"
                    aria-hidden="true"
                  >
                    <Tag className="h-8 w-8 text-zinc-400" strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-4 truncate text-sm font-semibold text-zinc-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 inline-flex items-start gap-1.5 text-xs leading-snug text-rose-700">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{product.aiReasonTag}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-700">
                    <span className="font-semibold">Grade {product.conditionGrade}</span>
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Verified seller
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                    <p className="text-sm text-zinc-500">
                      <span className="tabular-nums line-through">
                        ${product.priceBefore}
                      </span>{" "}
                      <span className="tabular-nums font-semibold text-zinc-900">
                        ${product.priceAfter}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold tabular-nums text-white">
                      <Percent className="h-3 w-3" aria-hidden="true" />
                      {product.discountPct}%
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setExpandedId(expanded ? null : product.id)}
                    className={[
                      "mt-4 flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold text-zinc-600",
                      "hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-rose-600 focus-visible:outline-offset-2",
                    ].join(" ")}
                  >
                    View condition report
                    <ChevronDown
                      className={[
                        "h-4 w-4 transition-transform duration-200",
                        expanded ? "rotate-180" : "",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={panelId}
                    aria-hidden={!expanded}
                    className={[
                      "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    ].join(" ")}
                  >
                    <p className="min-h-0 overflow-hidden px-2 pb-1 text-xs leading-relaxed text-zinc-500">
                      {product.conditionReport}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
