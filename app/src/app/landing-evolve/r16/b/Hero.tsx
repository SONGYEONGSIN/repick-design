"use client";

import { ArrowRight, Compass } from "lucide-react";
import MapPanel from "./MapPanel";
import ListingCard from "./ListingCard";
import { NEIGHBORHOOD, formatRadius, type Listing, type PriceBand } from "./data";

type HeroProps = {
  radiusKm: number;
  onRadiusChange: (km: number) => void;
  listings: Listing[];
  within: Listing[];
  top: Listing[];
  band: PriceBand | null;
};

function EmptySlot() {
  return (
    <li className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 p-6 text-center">

      <Compass aria-hidden="true" className="h-5 w-5 text-zinc-400" />
      <p className="max-w-[16ch] text-[12px] leading-[1.5] text-zinc-400">
        Widen your radius to see another match here.
      </p>
    </li>
  );
}

export default function Hero({
  radiusKm,
  onRadiusChange,
  listings,
  within,
  top,
  band,
}: HeroProps) {
  const emptySlots = Math.max(0, 4 - top.length);

  return (
    <section aria-labelledby="hero-heading" className="border-b border-zinc-900 px-4 pb-16 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-400">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime-400" />
          Comparable sales, mapped
        </p>

        <h1 id="hero-heading" className="mt-4 text-white">
          <span className="block text-[clamp(1rem,2vw,1.375rem)] font-medium text-zinc-300">
            Matched, verified, and priced against
          </span>
          <span className="block text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            the market right around you.
          </span>
        </h1>

        <p className="mt-5 max-w-[480px] text-[15px] leading-[1.6] text-zinc-300">
          repick compares each listing to verified sales within a radius you control, not a
          citywide average. Move the radius and the comparable count, price band, and top matches
          update together.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="#radius-control"
            className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-2.5 text-[14px] font-bold text-[#0B0B0F] transition-transform hover:scale-[1.02] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
          >
            See matches near you
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <p className="text-[12px] text-zinc-400">No sign-up required to browse.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <MapPanel
              radiusKm={radiusKm}
              onRadiusChange={onRadiusChange}
              listings={listings}
              within={within}
              top={top}
              band={band}
            />
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                Top matches within <span className="tabular-nums">{formatRadius(radiusKm)}</span> km
                of {NEIGHBORHOOD}
              </h2>
              <span className="text-[11px] tabular-nums text-zinc-400">{top.length} shown</span>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {top.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <EmptySlot key={`empty-${i}`} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
