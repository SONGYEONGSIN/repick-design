"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import LedgerCalendar from "./LedgerCalendar";
import {
  LISTING_DISCOUNT_PCT,
  LISTING_GRADE,
  LISTING_MATCH_PCT,
  LISTING_PRICE,
  LISTING_RETAIL,
  PRODUCTS,
  type FilterState,
  type LedgerStats,
} from "./data";

interface HeroProps {
  filters: FilterState;
  onToggle: (key: keyof FilterState) => void;
  stats: LedgerStats;
}

// The hero's own proof card. Deliberately inlined here, not a separate section, so match %,
// condition grade, seller verification and the before/after discount all live in the Hero's own
// tree and render with zero scroll.
const proof = PRODUCTS[0];

export default function Hero({ filters, onToggle, stats }: HeroProps) {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-14 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Headline / sub / CTA */}
          <div
            className="min-w-0 lg:col-span-7 motion-reduce:animate-none"
            style={{ animation: "rise 0.6s ease-out both" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#176B41]">
              AI-matched resale, priced on the record
            </p>
            <h1
              className="mt-5 text-zinc-900"
              style={{
                fontFamily: "var(--font-display-wide)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.04,
                fontSize: "clamp(2.4rem, 1.9rem + 3vw, 4.5rem)",
              }}
            >
              Prices open a ledger, not a guess.
            </h1>
            <p className="mt-6 max-w-[33rem] text-lg leading-relaxed text-zinc-600">
              Every listing carries its own calendar of closed sales. Filter by
              condition grade or verification and watch the asking price hold up
              against the record, cell by cell.
            </p>
            <a
              href="#listings"
              className={[
                "mt-8 inline-flex items-center gap-2 rounded-full bg-[#1E7A4C] px-6 py-3",
                "text-sm font-semibold text-white transition-colors hover:bg-[#176B41]",
                "focus-visible:outline-2 focus-visible:outline-[#176B41] focus-visible:outline-offset-2",
              ].join(" ")}
            >
              Browse graded listings
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* Proof card: match %, condition grade, verified-seller badge, before/after discount */}
          <div
            className="min-w-0 lg:col-span-5 motion-reduce:animate-none"
            style={{ animation: "rise 0.6s ease-out 0.12s both" }}
          >
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">{proof.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{proof.categoryLabel} · active listing</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EAF6EF] px-2.5 py-1 text-xs font-semibold text-[#176B41]">
                  <span className="tabular-nums">{LISTING_MATCH_PCT}%</span> match
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-700">
                <span className="font-semibold">Grade {LISTING_GRADE}</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#176B41]" aria-hidden="true" />
                  Verified seller
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                <p className="text-sm text-zinc-500">
                  <span className="tabular-nums line-through">{`$${LISTING_RETAIL}`}</span>{" "}
                  <span className="tabular-nums font-semibold text-zinc-900">{`$${LISTING_PRICE}`}</span>
                </p>
                <span className="rounded-full bg-[#1E7A4C] px-2.5 py-1 text-xs font-semibold tabular-nums text-white">
                  &minus;{LISTING_DISCOUNT_PCT}%
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                Priced against the comp ledger below, not retail alone.
              </p>
            </div>
          </div>

          {/* The Ledger Calendar device */}
          <div className="min-w-0 lg:col-span-12">
            <LedgerCalendar filters={filters} onToggle={onToggle} stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
}
