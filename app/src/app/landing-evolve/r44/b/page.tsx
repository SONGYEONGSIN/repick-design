"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, BadgeCheck, MapPin, RadioTower, Ruler, ShieldCheck, Tag } from "lucide-react";
import RadarMap from "./radar-map";
import Reveal from "./reveal";
import {
  DEFAULT_RADIUS_MI,
  LISTINGS,
  MAX_RADIUS_MI,
  MIN_RADIUS_MI,
  RADIUS_PRESETS_MI,
  sellerById,
  statsForRadius,
  type Listing,
} from "./data";

const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5B4FC]";

function ListingCard({ listing, featured }: { listing: Listing; featured?: boolean }) {
  const seller = sellerById(listing.sellerId);
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white/[0.03] ${
        featured ? "border-[#4F46E5]/60" : "border-white/10"
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-900">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?q=80&w=600&auto=format&fit=crop`}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 260px, 90vw"
          className="object-cover"
        />
      </div>
      <div className="p-3.5">
        <p className="text-sm font-semibold text-white">{listing.title}</p>
        {seller ? (
          <p className="mt-1 text-xs font-normal text-zinc-400">
            {seller.name} · {seller.distanceMi} mi away
          </p>
        ) : null}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4F46E5] px-2 py-1 text-xs font-semibold text-white">
            <BadgeCheck className="h-3 w-3" aria-hidden="true" />
            {listing.matchPct}% match
          </span>
          <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-100">
            Grade {listing.grade}
          </span>
          {listing.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-100">
              <ShieldCheck className="h-3 w-3 text-[#A5B4FC]" aria-hidden="true" />
              Verified
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-100">
            <Tag className="h-3 w-3 text-[#A5B4FC]" aria-hidden="true" />
            -{listing.discountPct}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [radiusMi, setRadiusMi] = useState(DEFAULT_RADIUS_MI); // non-trivial default: mid-pack, not min or max
  const [activeSellerId, setActiveSellerId] = useState<string | null>(null);

  const stats = useMemo(() => statsForRadius(radiusMi), [radiusMi]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#4F46E5] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em] text-white">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#listings" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white rounded-sm ${FOCUS_RING}`}>
              In range now
            </a>
            <a href="#proof" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white rounded-sm ${FOCUS_RING}`}>
              Reviews
            </a>
          </nav>
          <a
            href="#radius"
            className={`rounded-md bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4338CA] ${FOCUS_RING}`}
          >
            Find sellers near you
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* HERO — the radius-map device, its live stats, and the rich listing
            previews (with all four proof badges) all live inside this single
            section so the product + its proof render without scrolling. */}
        <section className="relative overflow-hidden border-b border-white/10 px-4 pb-16 pt-14 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="relative lg:col-span-5">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-1 -top-6 z-0 select-none text-[72px] font-extrabold leading-none tracking-tight text-zinc-500 sm:text-[96px] lg:-top-10 lg:text-[150px]"
                >
                  {radiusMi}
                </span>

                <div id="radius" className="relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
                    Local inventory, live
                  </p>
                  <h1
                    style={DISPLAY}
                    className="mt-4 text-[clamp(2.25rem,5.2vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white lg:max-w-[460px]"
                  >
                    Sellers appear as your radius grows.
                  </h1>
                  <p className="mt-6 max-w-[480px] text-base font-normal leading-[1.6] text-zinc-400">
                    Twelve real sellers sit at fixed distances around you. Pull the
                    radius out and watch which ones actually fall inside it —
                    no refreshed list, no different set, just more of the same
                    map lighting up.
                  </p>

                  <div className="mt-8 max-w-[480px] rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="radius-input" className="text-sm font-semibold text-white">
                        Search radius
                      </label>
                      <span className="text-lg font-extrabold tabular-nums text-white">{radiusMi} mi</span>
                    </div>
                    <input
                      id="radius-input"
                      type="range"
                      min={MIN_RADIUS_MI}
                      max={MAX_RADIUS_MI}
                      step={1}
                      value={radiusMi}
                      onChange={(e) => setRadiusMi(Number(e.target.value))}
                      className={`mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#4F46E5] ${FOCUS_RING}`}
                      aria-valuetext={`${radiusMi} miles`}
                    />
                    <div className="mt-2 flex justify-between text-xs font-normal text-zinc-400">
                      <span>{MIN_RADIUS_MI} mi</span>
                      <span>{MAX_RADIUS_MI} mi</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Quick radius presets">
                      {RADIUS_PRESETS_MI.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRadiusMi(preset)}
                          aria-pressed={radiusMi === preset}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${FOCUS_RING} ${
                            radiusMi === preset
                              ? "bg-[#4F46E5] text-white"
                              : "bg-white/10 text-zinc-400 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          {preset} mi
                        </button>
                      ))}
                    </div>

                    <p aria-live="polite" className="mt-4 text-sm font-normal leading-[1.6] text-zinc-400">
                      <span className="font-semibold text-white">
                        {stats.inRangeCount} of {stats.totalSellers}
                      </span>{" "}
                      sellers fall within {radiusMi} mi
                      {stats.nearestInRangeMi !== null ? (
                        <>
                          {" "}
                          — closest is{" "}
                          <span className="font-semibold text-[#A5B4FC]">{stats.nearestInRangeMi} mi</span> away.
                        </>
                      ) : (
                        " — none yet. Widen the radius."
                      )}
                    </p>
                  </div>

                  <a
                    href="#listings"
                    className={`mt-6 inline-flex items-center gap-2 rounded-md bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4338CA] ${FOCUS_RING}`}
                  >
                    See what&apos;s in range
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Fig. 01 — live coverage map
                  </p>
                  <div className="flex items-center gap-5 text-xs font-normal text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] ring-1 ring-white/50" aria-hidden="true" />
                      In range
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-zinc-600" aria-hidden="true" />
                      Out of range
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <RadarMap radiusMi={radiusMi} activeId={activeSellerId} onActiveChange={setActiveSellerId} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Sellers in range</p>
                    <p className="mt-1.5 flex items-baseline gap-1 text-3xl font-extrabold tabular-nums text-white">
                      <span>{stats.inRangeCount}</span>
                      <span className="text-base font-normal text-zinc-400">/ {stats.totalSellers}</span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#4F46E5] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white">Nearest seller</p>
                    <p className="mt-1.5 flex items-baseline gap-1 text-3xl font-extrabold tabular-nums text-[#0B0B0F]">
                      <span>{stats.nearestInRangeMi !== null ? stats.nearestInRangeMi : "—"}</span>
                      <span className="text-sm font-semibold text-white">mi</span>
                    </p>
                  </div>
                </div>

                <div id="listings" className="mt-8 grid gap-4 sm:grid-cols-3">
                  {LISTINGS.map((listing, i) => (
                    <ListingCard key={listing.id} listing={listing} featured={i === 0} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE 3-SPLIT — reinforces the device: fixed set, computed distance,
            state that survives the scroll. The radius stays live via the shared
            React state, carried through to the closing CTA below. */}
        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
            {[
              {
                title: "The same twelve sellers, every time",
                body: "Nothing is re-fetched when you move the radius. The map re-reads one fixed, hand-placed set of sellers against a new threshold — it never swaps in a different list to look more generous.",
                icon: MapPin,
              },
              {
                title: "Distance is computed, not guessed",
                body: "Every seller's distance and the \"nearest\" figure above come from one function of the radius you set, run live — not a marketing estimate written in ahead of time.",
                icon: Ruler,
              },
              {
                title: "Your radius travels with the page",
                body: "Scroll past the map and the radius you chose keeps describing the listings below, right down to the closing section — it doesn't reset to a stock number.",
                icon: RadioTower,
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-white/10 p-6">
                  <v.icon className="h-5 w-5 text-[#A5B4FC]" aria-hidden="true" />
                  <h2 className="mt-4 text-base font-semibold text-white">{v.title}</h2>
                  <p className="mt-2 max-w-[420px] text-sm font-normal leading-[1.6] text-zinc-400">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section id="proof" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">From early users</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Reveal>
                <blockquote className="h-full rounded-xl border border-white/10 p-6 text-sm font-normal leading-[1.6] text-zinc-400">
                  <span aria-hidden="true" className="text-2xl text-zinc-500">
                    &ldquo;
                  </span>
                  I widened it one mile at a time just to watch Rivergate finally light up. Thirteen minutes later I had a jacket.
                  <footer className="mt-4 text-xs font-semibold text-zinc-400">— Priya M., buyer</footer>
                </blockquote>
              </Reveal>
              <Reveal delay={0.06}>
                <blockquote className="h-full rounded-xl border border-white/10 p-6 text-sm font-normal leading-[1.6] text-zinc-400">
                  <span aria-hidden="true" className="text-2xl text-zinc-500">
                    &ldquo;
                  </span>
                  Most apps just show you a different list when you zoom out. This one shows the same sellers getting closer. It&rsquo;s a small thing that made me trust the count.
                  <footer className="mt-4 text-xs font-semibold text-zinc-400">— Owen T., buyer</footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CLOSING CTA — cites the live radius, in-range count, and nearest
            distance by name, read straight from the same React state above. */}
        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <Reveal className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 style={DISPLAY} className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
              Within <span className="text-[#A5B4FC]">{radiusMi} mi</span>, {stats.inRangeCount} of{" "}
              {stats.totalSellers} sellers are already in range
              {stats.nearestInRangeMi !== null ? (
                <>
                  {" "}
                  — closest is <span className="text-[#A5B4FC]">{stats.nearestInRangeMi} mi</span> away.
                </>
              ) : (
                "."
              )}
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-sm font-normal leading-[1.6] text-zinc-400">
              Move the radius back up top, or go straight to what&apos;s already in range.
            </p>
            <a
              href="#listings"
              className={`mt-8 inline-flex items-center gap-2 rounded-md bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4338CA] ${FOCUS_RING}`}
            >
              See the {stats.inRangeCount} sellers in range
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
