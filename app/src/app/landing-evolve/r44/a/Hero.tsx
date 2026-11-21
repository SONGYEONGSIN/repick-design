"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { BADGE_POOL, discountPct, PRODUCT, STAGES } from "./data";
import { FOCUS_RING, PROSE_14, PROSE_16 } from "./theme";
import Reveal from "./Reveal";

const VALUE_PROPS = [
  {
    title: "Three surfaces, one click",
    body: "Confidence, the badge count, and the delivery estimate all read from the same stage — pick any one and all three move together, live.",
  },
  {
    title: "Not just forward progress",
    body: "Every stage stays clickable on its own, so you can compare what Listed looks like against what Shipped looks like without stepping through the middle.",
  },
];

interface HeroProps {
  stageIndex: number;
  onSelectStage: (index: number) => void;
}

export default function Hero({ stageIndex, onSelectStage }: HeroProps) {
  const stage = STAGES[stageIndex];
  const visibleBadges = useMemo(() => BADGE_POOL.slice(0, stage.badges), [stage.badges]);
  const [whyOpen, setWhyOpen] = useState(false);
  const whyPanelId = useId();
  const pct = discountPct(PRODUCT.retail, PRODUCT.resale);

  return (
    <section id="hero" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">ORDER CONFIDENCE</p>
        <h1 className="mt-4 max-w-2xl text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
          Click any stage to see what buyers see.
        </h1>
        <p className={`mt-6 text-base font-normal leading-[1.6] text-zinc-400 ${PROSE_16}`}>
          Every stage of the verification pipeline updates the same confidence score, badge
          count, and delivery estimate — not a progress bar that only moves forward.
        </p>

        {/*
          FIX (r43/c regression): both direct children of this `grid` row get
          `min-w-0` on THEMSELVES. A CSS grid item defaults to `min-width: auto`
          (content-based sizing), exactly like a flex item. r43/c added
          `min-w-0` only to the <li>/<button>/<span> nested inside the stepper
          row — one layer too deep — so this wrapper div's own grid-item box
          stayed sized to its content's max-content width and kept overflowing
          at 390px even though the descendants were constrained. Constraining
          the grid-item wrapper itself is what actually lets it shrink below
          its content size. See page-brief-core §4 "그리드 아이템은 min-w-0".
        */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="min-w-0">
            <ol className="flex min-w-0 items-center gap-2" aria-label="Verification stages">
              {STAGES.map((s, i) => {
                const active = i === stageIndex;
                const reached = i <= stageIndex;
                return (
                  <li key={s.key} className="flex min-w-0 flex-1 items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => onSelectStage(i)}
                      className={`min-w-0 w-full rounded-lg border px-3 py-3 text-left transition-colors duration-200 ${FOCUS_RING} ${
                        active
                          ? "border-[#38bdf8] bg-[#38bdf8]/10"
                          : reached
                            ? "border-white/20 bg-white/[0.04]"
                            : "border-white/10 bg-transparent"
                      }`}
                    >
                      <span
                        className={`block text-xs font-semibold ${active ? "text-[#7dd3fc]" : "text-zinc-400"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block truncate text-sm font-semibold text-white">
                        {s.label}
                      </span>
                    </button>
                    {i < STAGES.length - 1 && (
                      <div
                        className={`hidden h-px flex-1 sm:block ${reached ? "bg-[#38bdf8]/60" : "bg-white/10"}`}
                        aria-hidden="true"
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 space-y-4">
              {VALUE_PROPS.map((v) => (
                <Reveal key={v.title} className="rounded-xl border border-white/10 p-5">
                  <h2 className="text-sm font-semibold text-white">{v.title}</h2>
                  <p className={`mt-1.5 text-sm font-normal leading-[1.6] text-zinc-400 ${PROSE_14}`}>
                    {v.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-800">
                <Image
                  src={PRODUCT.photo}
                  alt={PRODUCT.alt}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Badges live in their own row below the photo, never overlaid
                  on it — a failed image load's alt text can't collide with
                  them here. */}
              <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2">
                <span className="rounded-sm bg-[#0369a1] px-2 py-0.5 text-xs font-semibold text-white">
                  {PRODUCT.tier}
                </span>
                <span className="rounded-sm bg-white/[0.08] px-2 py-0.5 text-xs font-semibold text-zinc-200">
                  Grade: {PRODUCT.grade}
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-white">{PRODUCT.name}</p>
              <p className="text-xs font-normal text-zinc-400">{PRODUCT.category}</p>

              <div className="mt-2 flex min-w-0 flex-wrap items-baseline gap-2">
                <span className="text-lg font-bold tabular-nums text-white">${PRODUCT.resale}</span>
                <span className="text-sm font-normal text-zinc-400 line-through">${PRODUCT.retail}</span>
                <span className="text-xs font-semibold tabular-nums text-[#7dd3fc]">{pct}% off retail</span>
              </div>

              <div className="mt-3 flex min-w-0 flex-wrap gap-2" aria-live="polite">
                {visibleBadges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <span
                      key={b.label}
                      className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-1 text-xs font-normal text-zinc-300"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#7dd3fc]" aria-hidden="true" />
                      {b.label}
                    </span>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400">CONFIDENCE</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-white">{stage.confidence}%</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400">EST. ARRIVAL</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-white">{stage.eta}d</p>
                </div>
              </div>

              <button
                type="button"
                aria-expanded={whyOpen}
                aria-controls={whyPanelId}
                onClick={() => setWhyOpen((v) => !v)}
                className={`mt-5 inline-block rounded-sm py-1 text-sm font-semibold text-zinc-300 underline underline-offset-4 ${FOCUS_RING}`}
              >
                {whyOpen ? "Hide why this matched" : "Why this matched"}
              </button>
              <p
                id={whyPanelId}
                hidden={!whyOpen}
                className={`mt-2 text-sm font-normal leading-[1.6] text-zinc-400 ${PROSE_14}`}
              >
                {PRODUCT.whyMatched}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
