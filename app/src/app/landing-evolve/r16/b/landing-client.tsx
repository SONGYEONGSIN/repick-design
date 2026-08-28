"use client";

import { useMemo, useState } from "react";
import Hero from "./Hero";
import ValueBeats from "./ValueBeats";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import {
  DEFAULT_RADIUS,
  LISTINGS,
  withinRadius,
  topMatches,
  priceBand,
} from "./data";

export default function LandingClient() {
  const [radiusKm, setRadiusKm] = useState<number>(DEFAULT_RADIUS);

  const within = useMemo(() => withinRadius(LISTINGS, radiusKm), [radiusKm]);
  const top = useMemo(() => topMatches(within, 4), [within]);
  const band = useMemo(() => priceBand(within), [within]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <header className="border-b border-zinc-900 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <span className="text-[15px] font-bold tracking-[-0.02em] text-white">repick</span>
          <a
            href="#radius-control"
            className="rounded-full border border-zinc-700 px-3.5 py-1.5 text-[12px] font-medium text-zinc-200 transition-colors hover:border-zinc-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3e635]"
          >
            Search near you
          </a>
        </div>
      </header>

      <main>
        <Hero
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          listings={LISTINGS}
          within={within}
          top={top}
          band={band}
        />
        <ValueBeats radiusKm={radiusKm} within={within} top={top} band={band} />
        <SocialProof />
        <ClosingCta radiusKm={radiusKm} within={within} band={band} />
      </main>

      <footer className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 border-t border-zinc-900 pt-6 text-[12px] text-zinc-400 sm:flex-row sm:items-center">
          <p>&copy; repick. Comparable data shown is illustrative.</p>
          <p>Every match is graded, verified, and priced against what sold nearby.</p>
        </div>
      </footer>
    </div>
  );
}
