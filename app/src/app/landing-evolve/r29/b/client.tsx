"use client";

import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import GateChain from "./gate-chain";
import ListingCard from "./listing-card";
import {
  BRAND_NAME,
  CATEGORIES,
  DEFAULT_ACTIVE_GATES,
  LISTINGS,
  POOL_COUNT,
  STATS,
  TESTIMONIALS,
  discountPct,
  qualifyingListings,
  topPick,
  type Category,
  type GateKey,
} from "./data";
import { ACCENT, ACCENT_DEEP, BODY, BODY_LG, CAPTION, DISPLAY, FOCUS_RING, INK, MUTED } from "./tokens";
import { PrimaryButton, Reveal, SKIP_LINK, SectionHeading } from "./ui";

const NAV_LINKS = [
  { href: "#preview", label: "Preview" },
  { href: "#gate-chain", label: "Gate chain" },
  { href: "#proof", label: "Proof" },
];

export default function GatelistLanding() {
  const [activeGates, setActiveGates] = useState<Set<GateKey>>(() => new Set(DEFAULT_ACTIVE_GATES));
  const [previewFilter, setPreviewFilter] = useState<Category>("All");

  function toggleGate(key: GateKey) {
    setActiveGates((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function applyPreset(keys: GateKey[]) {
    setActiveGates(new Set(keys));
  }

  const qualifying = useMemo(() => qualifyingListings(LISTINGS, activeGates), [activeGates]);
  const best = useMemo(() => topPick(LISTINGS, activeGates), [activeGates]);
  const heldBackCount = POOL_COUNT - qualifying.length;

  const filteredListings =
    previewFilter === "All" ? LISTINGS : LISTINGS.filter((l) => l.category === previewFilter);

  const heroListings = LISTINGS.filter((l) => l.id === "fuji-x100v" || l.id === "omega-speedmaster");

  return (
    <div className="min-h-screen bg-[#FDFDFC]" style={{ color: INK }}>
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* Persistent header / nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-[#FDFDFC]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-extrabold tracking-[-0.02em]" style={{ ...DISPLAY, color: INK }}>
            {BRAND_NAME}
          </span>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold text-zinc-600 hover:text-[#15171B] rounded ${FOCUS_RING}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#gate-chain"
            className={`inline-flex flex-none items-center rounded-full px-4 py-2 text-sm font-semibold text-white ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT_DEEP }}
          >
            <span className="sm:hidden">Matches</span>
            <span className="hidden sm:inline">See your matches</span>
          </a>
        </div>
      </header>

      <main id="main">
        {/* 1. Hero — headline, sub, single CTA, and real listing proof, all inside this section */}
        <section className="border-b border-zinc-200">
          <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-14 sm:pb-20 sm:pt-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="min-w-0 lg:col-span-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT_DEEP }}>
                  A resale marketplace with conditions
                </p>
                <h1
                  className="mt-4 text-[clamp(2.25rem,1.85rem+2vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] lg:text-[clamp(3rem,1.1rem+4.2vw,5rem)] lg:leading-[0.98]"
                  style={{ ...DISPLAY, color: INK }}
                >
                  Set your bar. Watch the
                  <br className="hidden sm:block" /> pool clear it, gate by gate.
                </h1>
                <p className={`mt-6 ${BODY_LG}`}>
                  {BRAND_NAME} runs every one of its {POOL_COUNT} active listings through five
                  independent requirement gates &mdash; seller verification, original packaging,
                  cosmetic wear, dispatch speed, price match. Switch on only the ones you actually
                  need and watch the qualifying count update live, listing by listing, below.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PrimaryButton href="#gate-chain">Run the gate chain</PrimaryButton>
                  <span className="inline-flex items-center gap-2 text-sm" style={{ color: MUTED }}>
                    <ShieldCheck className="h-4 w-4 flex-none" aria-hidden="true" style={{ color: ACCENT }} strokeWidth={2} />
                    Every gate re-verified within 4 hours of a listing going live
                  </span>
                </div>
              </div>

              <div className="min-w-0 lg:col-span-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  Two listings clearing every gate switched on below
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {heroListings.map((listing, i) => (
                    <ListingCard key={listing.id} listing={listing} heading={false} compact preload={i === 0} showReason={false} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Product preview */}
        <section id="preview" className="border-b border-zinc-200 bg-[#F8FAF9]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <SectionHeading eyebrow="Product preview" title="Every card shows its receipts.">
                <p className={`mt-4 ${BODY}`}>
                  Match confidence, condition grade, verification and the cut against retail sit on
                  the card itself &mdash; never behind a hover, never overlaid on the photo.
                </p>
              </SectionHeading>
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={previewFilter === c}
                  onClick={() => setPreviewFilter(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                    previewFilter === c
                      ? "border-transparent text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-[#15171B]"
                  }`}
                  style={previewFilter === c ? { backgroundColor: ACCENT_DEEP } : undefined}
                >
                  {c}
                </button>
              ))}
            </Reveal>

            <Reveal className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="min-w-0">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 3. Value — the gate chain itself IS this section, and it is the single thing
               the closing CTA quotes live below. */}
        <section id="gate-chain" className="border-b border-zinc-200">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <SectionHeading eyebrow="The gate chain" title="Turn on what actually matters to you.">
                <p className={`mt-4 ${BODY}`}>
                  By default, &ldquo;Verified seller only&rdquo; and &ldquo;No visible wear&rdquo; are
                  switched on &mdash; 5 of {POOL_COUNT} listings clear both. Add a gate and the pool
                  can only narrow; remove one and listings that were held back come back into view.
                </p>
              </SectionHeading>
            </Reveal>

            <Reveal className="mt-10">
              <GateChain
                activeGates={activeGates}
                onToggle={toggleGate}
                onPreset={applyPreset}
                qualifyingCount={qualifying.length}
              />
            </Reveal>
          </div>
        </section>

        {/* 4. Social proof */}
        <section id="proof" className="border-b border-zinc-200 bg-[#F8FAF9]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <SectionHeading eyebrow="Social proof" title="Buyers trust the gates, not just the result." />
            </Reveal>

            <Reveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5">
                  <p className="text-2xl font-extrabold tabular-nums" style={{ ...DISPLAY, color: INK }}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Reveal key={t.name} className="min-w-0">
                  <figure className="flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6">
                    <blockquote className="text-sm leading-[1.6]" style={{ color: INK }}>
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: ACCENT_DEEP }}
                      >
                        {t.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold" style={{ color: INK }}>
                          {t.name}
                        </span>
                        <span className="block truncate text-xs" style={{ color: MUTED }}>
                          {t.role}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Closing CTA — quotes the SAME live qualifying count and top pick computed
               above, not a static number. */}
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
            <Reveal className="flex flex-col items-start gap-8 rounded-3xl border border-zinc-200 bg-[#F3F6F4] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 lg:max-w-[640px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT_DEEP }}>
                  Your gate chain, quoted live
                </p>
                <h2
                  className="mt-3 text-[clamp(1.75rem,1.45rem+1.3vw,2.5rem)] font-extrabold tracking-[-0.02em]"
                  style={{ ...DISPLAY, color: INK }}
                >
                  <span className="tabular-nums" style={{ color: ACCENT }}>
                    {qualifying.length}
                  </span>{" "}
                  qualifying {qualifying.length === 1 ? "match" : "matches"} found right now.
                </h2>
                <p className={`mt-4 ${BODY}`}>
                  {best ? (
                    <>
                      Top pick: <strong className="font-semibold" style={{ color: INK }}>{best.name}</strong> &mdash; {best.match}%
                      match, {best.grade.toLowerCase()} condition, ${best.priceNow.toLocaleString("en-US")}{" "}
                      after a {discountPct(best)}% cut from retail. Switch a gate on the chain above and
                      this line updates immediately &mdash; it is reading the same state, not a cached
                      number.
                    </>
                  ) : (
                    "No listing currently clears every gate you have switched on — turn one off above to see how many come back."
                  )}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PrimaryButton href="#gate-chain">Create your free account</PrimaryButton>
                  <span className="inline-flex items-center gap-2 text-xs" style={{ color: MUTED }}>
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" style={{ color: ACCENT }} strokeWidth={2} />
                    No card required to see your shortlist
                  </span>
                </div>
              </div>

              <div className="flex flex-none flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-8 py-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  Held back right now
                </span>
                <span className="text-4xl font-extrabold tabular-nums" style={{ ...DISPLAY, color: INK }}>
                  {heldBackCount}
                </span>
                <span className="text-xs" style={{ color: MUTED }}>
                  of {POOL_COUNT} listings, failing at least one gate you have on
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold" style={{ ...DISPLAY, color: INK }}>
            {BRAND_NAME}
          </span>
          <p className={CAPTION}>
            Seller verification, packaging, condition, dispatch speed and price match &mdash; gated,
            not just claimed.
          </p>
        </div>
      </footer>
    </div>
  );
}
