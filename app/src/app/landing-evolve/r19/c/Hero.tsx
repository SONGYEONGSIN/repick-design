"use client";

import Image from "next/image";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Timeline } from "./Timeline";
import { STAGES, REFERENCE_LISTING, discountPct } from "./data";
import { ACCENT, BODY, BORDER, INK, MUTED, MUTED_STRONG, SURFACE } from "./tokens";

export function Hero({
  activeIndex,
  onSelect,
  trustScore,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  trustScore: number;
}) {
  const stage = STAGES[activeIndex];
  const pct = discountPct(REFERENCE_LISTING.originalPrice, REFERENCE_LISTING.price);

  return (
    <section className="relative overflow-hidden border-b px-6 pt-24 pb-16 sm:px-10 sm:pt-28 lg:px-16" style={{ borderColor: BORDER, backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Left: headline, subhead, single CTA — asymmetric, oversized clamp() scale. */}
        <div className="min-w-0 lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.28em", color: MUTED }}>
            Provenance record — Listing #{REFERENCE_LISTING.id}
          </p>
          <h1
            className="mt-5"
            style={{
              fontFamily: "var(--font-display-mono)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2.25rem, 2.4vw + 1.6rem, 3.75rem)",
              lineHeight: 1.05,
              color: INK,
            }}
          >
            Every handoff.
            <br />
            On the record.
          </h1>
          <p className="mt-6 max-w-[480px] text-[16px] font-normal leading-[1.6]" style={{ color: BODY }}>
            From the seller&rsquo;s first upload to the buyer&rsquo;s final match, this listing&rsquo;s trust score
            is built across four recorded steps. Scrub through the timeline to see exactly what changed, and why
            the number moved.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#closing-cta"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ backgroundColor: ACCENT, outlineColor: ACCENT }}
            >
              See the full chain of custody
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-[13px] font-normal" style={{ color: MUTED }}>
              No account needed to trace a listing.
            </span>
          </div>
        </div>

        {/* Right: the console itself — rail, stage detail, and live proof, all inside the hero. */}
        <div className="min-w-0 lg:col-span-6">
          <div className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
            <Timeline activeIndex={activeIndex} onSelect={onSelect} />

            {/* Stage detail — the live tabpanel content for whichever stage is selected. */}
            <div
              role="tabpanel"
              id="stage-panel"
              aria-labelledby={`tab-${stage.id}`}
              tabIndex={0}
              className="mt-7 rounded-xl border p-5"
              style={{ borderColor: BORDER, backgroundColor: "#FFFFFF" }}
            >
              <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.16em", color: MUTED }}>
                {stage.actor} · <span className="tabular-nums">{stage.timestamp}</span>
              </p>
              <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: BODY }}>
                {stage.summary}
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {stage.checks.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[12.5px] leading-snug" style={{ color: MUTED_STRONG }}>
                    <Check className="mt-[3px] h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>

              {/* Real product proof, inside the hero, same grid — reference listing plus the live trust score. */}
              <div className="mt-5 flex flex-col gap-5 border-t pt-5 sm:flex-row sm:items-center" style={{ borderColor: BORDER }}>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: SURFACE }}>
                    <Image src={REFERENCE_LISTING.image} alt={REFERENCE_LISTING.imageAlt} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold" style={{ color: INK }}>
                      {REFERENCE_LISTING.title}
                    </p>
                    <p className="mt-0.5 text-[12px] font-normal tabular-nums" style={{ color: MUTED_STRONG }}>
                      ${REFERENCE_LISTING.price.toLocaleString()}{" "}
                      <span className="line-through" style={{ color: MUTED }}>
                        ${REFERENCE_LISTING.originalPrice.toLocaleString()}
                      </span>{" "}
                      <span style={{ color: ACCENT }}>&minus;{pct}%</span>
                    </p>
                    {/* Badges: a plain row below the photo/price, never an overlay on the image itself. */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full border px-2 py-0.5 text-[10.5px] font-semibold" style={{ borderColor: "#D4D4D8", color: INK }}>
                        {stage.gradeLabel}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-normal"
                        style={{ borderColor: "#D4D4D8", color: MUTED_STRONG }}
                      >
                        <ShieldCheck className="h-3 w-3" style={{ color: stage.verified ? ACCENT : MUTED }} aria-hidden="true" />
                        {stage.verificationLabel}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] font-normal" style={{ color: MUTED }}>
                      {stage.matchLabel}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 sm:w-[168px] sm:border-l sm:pl-5" style={{ borderColor: BORDER }}>
                  <p className="text-[10.5px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: MUTED }}>
                    Trust score at this stage
                  </p>
                  <p
                    className="mt-1 tabular-nums"
                    style={{ fontFamily: "var(--font-display-mono)", fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.02em", color: INK, lineHeight: 1 }}
                  >
                    {trustScore}
                  </p>
                  <div
                    role="progressbar"
                    aria-label="Trust score"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={trustScore}
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: "#E4E4E7" }}
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none"
                      style={{ width: `${trustScore}%`, backgroundColor: ACCENT }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] font-normal tabular-nums" style={{ color: MUTED }}>
                    +{stage.trustDelta} pts this stage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
