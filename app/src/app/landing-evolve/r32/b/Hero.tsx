"use client";

import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import CategoryDevice from "./CategoryDevice";
import { PRODUCTS, type CategoryId } from "./data";

interface HeroProps {
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
}

// The hero's own proof-listing card. Deliberately inlined in this component (not a child
// section) so the four proof elements — match %, condition grade, verification badge and
// before/after discount — live in the Hero's own JSX tree, in the same grid as the headline.
const proof = PRODUCTS[0];

export default function Hero({ selected, onSelect }: HeroProps) {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Headline / sub / CTA — left-aligned, asymmetric */}
          <div
            className="min-w-0 lg:col-span-7 motion-reduce:animate-none"
            style={{ animation: "rise 0.6s ease-out both" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
              AI-graded resale
            </p>
            <h1
              className="mt-5 text-zinc-900"
              style={{
                fontFamily: "var(--font-display-mono)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.04,
                fontSize: "clamp(2.5rem, 2rem + 3.2vw, 4.75rem)",
              }}
            >
              Every listing graded before it&rsquo;s priced.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-zinc-600">
              repick checks condition, verifies the seller, and lines your item up
              against buyers already shopping its companion categories{" "}
              &mdash; the price comes last, not first.
            </p>
            <a
              href="#listings"
              className={[
                "mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3",
                "text-sm font-semibold text-white transition-colors hover:bg-rose-700",
                "focus-visible:outline-2 focus-visible:outline-rose-600 focus-visible:outline-offset-2",
              ].join(" ")}
            >
              Start a listing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* Proof-listing card — all four elements live here, inside Hero's own tree */}
          <div
            className="min-w-0 lg:col-span-5 motion-reduce:animate-none"
            style={{ animation: "rise 0.6s ease-out 0.12s both" }}
          >
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div
                className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-zinc-100"
                aria-hidden="true"
              >
                <Sparkles className="h-10 w-10 text-rose-300" strokeWidth={1.5} />
              </div>

              <div className="mt-4 min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {proof.name}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">Sneakers &middot; resold listing</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="tabular-nums">{proof.matchPct}%</span> match
                </span>
                <span className="font-semibold text-zinc-700">
                  Grade {proof.conditionGrade}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-700">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified seller
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                <p className="text-sm text-zinc-500">
                  <span className="tabular-nums line-through">${proof.priceBefore}</span>{" "}
                  <span className="tabular-nums font-semibold text-zinc-900">
                    ${proof.priceAfter}
                  </span>
                </p>
                <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold tabular-nums text-white">
                  &minus;{proof.discountPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Category device: input (nodes around a circle) + live chord diagram + stat panel */}
          <div className="min-w-0 lg:col-span-12">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
              <CategoryDevice selected={selected} onSelect={onSelect} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
