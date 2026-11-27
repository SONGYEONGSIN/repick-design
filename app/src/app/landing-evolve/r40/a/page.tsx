"use client";

import { useCallback, useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Gauge, Quote } from "lucide-react";
import Hero from "./Hero";
import RankShuffle from "./RankShuffle";
import Reveal from "./Reveal";
import { DEFAULT_ORDER, weightsFromOrder, weightShare, sortedItems } from "./rank-logic";
import type { FactorId } from "./rank-logic";
import { DISPLAY_FONT, FOCUS_RING, MUTED, PROSE_WIDTH, ROSE_600, ROSE_700 } from "./theme";

const TESTIMONIALS = [
  {
    name: "D. Calloway",
    role: "Bought a camera kit",
    text: "I put Trust first and the list actually changed. It wasn't just a filter that hid things.",
  },
  {
    name: "R. Mbeki",
    role: "Sold a road bike",
    text: "Buyers kept telling me the condition grade matched what showed up. That's rarer than it should be.",
  },
  {
    name: "S. Patel",
    role: "Bought studio monitors",
    text: "Ranking Speed above Price surfaced a seller I'd have skipped. Shipped the next morning.",
  },
];

export default function Page() {
  const [order, setOrder] = useState<FactorId[]>(DEFAULT_ORDER);

  const handleOrderChange = useCallback((next: FactorId[]) => {
    setOrder(next);
  }, []);

  const weights = weightsFromOrder(order);
  const scored = sortedItems(order);
  const topMatch = scored[0];

  const trustShare = weightShare(weights, "trust");
  const conditionShare = weightShare(weights, "condition");
  const speedShare = weightShare(weights, "speed");
  const priceShare = weightShare(weights, "price");

  return (
    <main className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 focus:shadow-lg"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-6">
          <p className="text-sm font-semibold tracking-[0.12em] text-zinc-950">REPICK</p>
          <a
            href="#closing"
            className={`rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 ${FOCUS_RING}`}
          >
            Get matched
          </a>
        </header>

        <div id="main-content">
          <Hero />

          {/* section 2 — the Rank Shuffle device */}
          <section id="rank-shuffle" className="border-t border-zinc-200 py-16 sm:py-24">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ROSE_700 }}>
              YOUR PRIORITIES, LIVE
            </p>
            <h2
              className={`mt-3 max-w-[640px] text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-zinc-950 sm:text-3xl ${DISPLAY_FONT}`}
            >
              Drag to set the order — the shape and the list redraw instantly.
            </h2>
            <p className={`mt-4 text-base font-normal leading-[1.6] ${MUTED} ${PROSE_WIDTH}`}>
              Price, condition, speed, and trust each pull the match score in a different direction. Rank them by
              how much you personally weigh each one, and every number below recomputes from that one ranking —
              nothing here is pre-sorted for you.
            </p>
            <div className="mt-10">
              <RankShuffle order={order} onOrderChange={handleOrderChange} />
            </div>
          </section>

          {/* section 3 — value proposition, tied to the live weighting */}
          <Reveal className="border-t border-zinc-200 py-16 sm:py-24">
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ROSE_700 }}>
              WHY THE ORDER MATTERS
            </p>
            <h2 className="mt-3 max-w-[640px] text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-zinc-950 sm:text-3xl">
              How your ranking moves the marketplace.
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 p-5">
                <ShieldCheck className="h-5 w-5" style={{ color: ROSE_600 }} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-zinc-950">Verification doesn&apos;t get dropped.</p>
                <p className={`mt-2 text-sm font-normal leading-[1.6] ${MUTED}`}>
                  Every seller passes the same photo-and-history check no matter where Trust sits in your ranking.
                  Right now it&apos;s shaping {trustShare}% of each match score.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-5">
                <Sparkles className="h-5 w-5" style={{ color: ROSE_600 }} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-zinc-950">Condition is read, not guessed.</p>
                <p className={`mt-2 text-sm font-normal leading-[1.6] ${MUTED}`}>
                  A computer-vision pass grades wear straight from the listing photos. At your current ranking it&apos;s
                  shaping {conditionShare}% of the score.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-5">
                <Gauge className="h-5 w-5" style={{ color: ROSE_600 }} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-zinc-950">Price and speed trade off live.</p>
                <p className={`mt-2 text-sm font-normal leading-[1.6] ${MUTED}`}>
                  Move Speed above Price and faster sellers can out-rank cheaper ones. Right now Speed carries{" "}
                  {speedShare}% of the weighting against Price&apos;s {priceShare}%.
                </p>
              </div>
            </div>
          </Reveal>

          {/* section 4 — social proof */}
          <Reveal className="border-t border-zinc-200 py-16 sm:py-24" delay={0.05}>
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: ROSE_700 }}>
              WHAT SHOPPERS NOTICE
            </p>
            <h2 className="mt-3 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-zinc-950 sm:text-3xl">
              Numbers people double-check — and keep checking out.
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="rounded-2xl border border-zinc-200 p-5">
                  <Quote className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-700">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-3 text-xs font-semibold text-zinc-950">{t.name}</p>
                  <p className="text-xs font-normal text-zinc-500">{t.role}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* section 5 — closing CTA, restates the live #1 match from Rank Shuffle */}
          <Reveal className="border-t border-zinc-200 py-16 sm:py-24" delay={0.05}>
            <div id="closing" className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-left sm:p-12">
              <p className={`text-sm font-normal ${MUTED}`}>At your current ranking</p>
              <p
                className={`mt-2 max-w-[640px] text-[clamp(1.75rem,6vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 ${DISPLAY_FONT}`}
              >
                {topMatch.name} leads at {topMatch.score}% match.
              </p>
              <p className={`mt-3 text-base font-normal leading-[1.6] ${MUTED} ${PROSE_WIDTH}`}>
                Reorder the chips above and this line updates with it — the same ranking drives the shape, the list,
                and this offer.
              </p>
              <a
                href="#rank-shuffle"
                className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
                style={{ backgroundColor: ROSE_700 }}
              >
                See this match
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>

        <footer className="border-t border-zinc-200 py-10">
          <p className="text-xs font-normal text-zinc-500">Repick &middot; AI-matched resale marketplace.</p>
        </footer>
      </div>
    </main>
  );
}
