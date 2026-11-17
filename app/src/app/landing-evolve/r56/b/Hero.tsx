"use client";

import { ArrowRight } from "lucide-react";
import ZoneMap from "./ZoneMap";
import ProductGrid from "./ProductGrid";
import { getZoneResult } from "./zones";
import { FOCUS_RING, DISPLAY_FONT_STYLE } from "./ui";

interface HeroProps {
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
}

export default function Hero({ selectedZoneId, onSelectZone }: HeroProps) {
  const result = getZoneResult(selectedZoneId);

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-14 sm:pb-14 lg:px-8 lg:pt-24 lg:pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: headline, subhead, single primary CTA. */}
          <div className="lg:col-span-6 lg:pr-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300">
              Local resale, verified
            </p>
            <h1
              id="hero-heading"
              style={DISPLAY_FONT_STYLE}
              className="mt-3 text-[clamp(2.25rem,9vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white lg:mt-4 lg:text-[clamp(3.25rem,4.5vw,5.75rem)] lg:leading-[1.02]"
            >
              Choose your zone.
              <br />
              Everything else adjusts.
            </h1>
            <p className="mt-4 max-w-[500px] text-sm leading-[1.6] text-zinc-300 sm:text-base lg:mt-6">
              Tap a district on the grid and GRIDLINE recalculates your pickup
              window, courier fee, and matched local inventory in real time —
              no estimates, no guesswork.
            </p>
            <div className="mt-5 flex items-center gap-3 lg:mt-8">
              <a
                href="#cta"
                className={`inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 ${FOCUS_RING}`}
              >
                Reserve a pickup slot
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-xs text-zinc-400 tabular-nums">
                7 zones · {result.listings.length} items near{" "}
                <span className="text-zinc-300">{result.zone.name}</span>
              </span>
            </div>
          </div>

          {/* Right: the interactive device. */}
          <div className="lg:col-span-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Fig. 01 — Tap a zone to recompute pickup
            </p>
            <div className="mt-2">
              <ZoneMap selectedZoneId={selectedZoneId} onSelect={onSelectZone} />
            </div>
          </div>
        </div>

        {/* Product-preview proof — still a literal child of Hero, not a sibling section. */}
        <div className="mt-8 lg:mt-14">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-extrabold tracking-[-0.02em] text-white sm:text-lg">
              Available now in {result.zone.name}
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 tabular-nums">
              02 — Live inventory
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Membership and order of this grid change with the zone you pick above.
          </p>
          <div className="mt-4">
            <ProductGrid listings={result.listings} />
          </div>
        </div>
      </div>
    </section>
  );
}
