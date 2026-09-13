"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Tag, Clock, BadgeCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { INTENSITIES, PERIODS, GRADE_BY_INTENSITY, LISTING, discountPct } from "./data";
import type { Intensity, Period, CaseMetrics, ChecklistItem } from "./data";

// Ruby — chosen to sit outside the last three landing winners' accent axes
// (sky, teal, amber). Computed against this route's fixed dark ground
// (#0B0B0F) and documented in candidates/a.md:
//   ACCENT       vs #0B0B0F  -> 4.26:1  (large text / big fills only)
//   white        vs ACCENT   -> 4.62:1  (small text on an accent fill: passes)
//   #0B0B0F      vs ACCENT   -> 4.26:1  (dark ink on an accent fill: fails <19px)
//   ACCENT_BRIGHT vs #0B0B0F -> 10.2:1  (small text / icons / focus rings)
const ACCENT = "#D6336C";
const ACCENT_BRIGHT = "#F5A3C7";

function SegmentGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.16em" }}>
        {legend}
      </p>
      <div role="group" aria-label={legend} className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              aria-pressed={selected}
              className="rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={
                selected
                  ? { backgroundColor: ACCENT, borderColor: ACCENT, color: "#FFFFFF", outlineColor: ACCENT_BRIGHT }
                  : { borderColor: "#27272E", color: "#D4D4D8", outlineColor: ACCENT_BRIGHT }
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Hero({
  intensity,
  period,
  onIntensityChange,
  onPeriodChange,
  metrics,
  checklist,
}: {
  intensity: Intensity;
  period: Period;
  onIntensityChange: (id: Intensity) => void;
  onPeriodChange: (id: Period) => void;
  metrics: CaseMetrics;
  checklist: ChecklistItem[];
}) {
  const intensityMeta = INTENSITIES.find((i) => i.id === intensity)!;
  const periodMeta = PERIODS.find((p) => p.id === period)!;
  const grade = GRADE_BY_INTENSITY[intensity];
  const pct = discountPct(LISTING.retailPrice, metrics.price);
  const passCount = checklist.filter((c) => c.status === "pass").length;

  return (
    <section className="relative overflow-hidden border-b border-[#1C1C22] bg-[#0B0B0F] px-6 pb-16 pt-28 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left: headline, subhead, single CTA */}
        <div className="min-w-0 lg:col-span-5">
          <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.28em" }}>
            Fig. 01 — The Case File
          </p>
          <h1
            className="mt-5 text-white"
            style={{
              fontFamily: "var(--font-display-grotesk)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2.5rem, 3.4vw + 1.6rem, 4.25rem)",
              lineHeight: 1.02,
            }}
          >
            Run the inspection.
            <br />
            Read the evidence.
          </h1>
          <p className="mt-6 max-w-[492px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
            repick grades every resale listing with an AI inspection engine you can interrogate
            yourself. Choose an intensity, choose a comparison window, and watch the case file
            recompute in place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#exhibit-b"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{ backgroundColor: ACCENT, outlineColor: ACCENT_BRIGHT }}
            >
              Review the evidence
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-[13px] font-normal text-[#A1A1AA]">No sign-up needed to run an inspection.</span>
          </div>
        </div>

        {/* Right: the case file itself — controls, Exhibit A, and the listing preview, all inside the hero */}
        <div className="min-w-0 lg:col-span-7">
          <Reveal className="rounded-2xl border border-[#1C1C22] bg-[#111116] p-6 sm:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1C1C22] pb-5">
              <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.16em" }}>
                Case No. RP-04871
              </p>
              <p className="text-[11px] font-normal text-[#A1A1AA]">Auto-graded, no manual review</p>
            </div>

            <div className="mt-5 flex flex-col gap-5 border-b border-[#1C1C22] pb-6 sm:flex-row">
              <SegmentGroup legend="Inspection intensity" options={INTENSITIES} value={intensity} onChange={onIntensityChange} />
              <SegmentGroup legend="Comparison period" options={PERIODS} value={period} onChange={onPeriodChange} />
            </div>
            <p className="mt-3 text-[12px] font-normal leading-[1.6] text-[#A1A1AA]">
              {intensityMeta.blurb} {periodMeta.blurb}
            </p>

            <div className="mt-6">
              <h2 className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.16em" }}>
                Exhibit A — Live condition report
              </h2>

              <div aria-live="polite" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[11px] font-normal text-[#A1A1AA]">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    Confidence
                  </p>
                  <p className="mt-1 text-[28px] font-semibold tabular-nums leading-none text-white">{metrics.confidence}%</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#1C1C22]">
                    {/* Width never changes — only `transform: scaleX()` animates, which is a
                        transform-only change (no layout property is touched). */}
                    <div
                      className="h-full w-full origin-left rounded-full transition-transform duration-300 motion-reduce:transition-none"
                      style={{ transform: `scaleX(${metrics.confidence / 100})`, backgroundColor: ACCENT }}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[11px] font-normal text-[#A1A1AA]">
                    <Tag className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    Recommended
                  </p>
                  <p className="mt-1 text-[28px] font-semibold tabular-nums leading-none text-white">${metrics.price}</p>
                  <p className="mt-2 text-[11px] font-normal tabular-nums text-[#A1A1AA]">&minus;{pct}% vs. retail</p>
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[11px] font-normal text-[#A1A1AA]">
                    <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    Days to sell
                  </p>
                  <p className="mt-1 text-[28px] font-semibold tabular-nums leading-none text-white">{metrics.days}</p>
                  <p className="mt-2 text-[11px] font-normal text-[#A1A1AA]">est. at this grading</p>
                </div>
              </div>

              <ul className="mt-5 flex flex-col gap-2">
                {checklist.map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5 rounded-lg border border-[#1C1C22] bg-[#0B0B0F] px-3 py-2">
                    {item.status === "pass" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    )}
                    <span className="min-w-0 text-[12px] font-normal leading-snug text-[#D4D4D8]">
                      <span className="font-semibold text-white">{item.label}</span>
                      {" — "}
                      {item.status === "pass" ? "Passed. " : "Flagged. "}
                      {item.note}.
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] font-normal tabular-nums text-[#A1A1AA]">
                {passCount} of {checklist.length} checks passed clean at {intensityMeta.label} intensity.
              </p>
            </div>
          </Reveal>

          {/* Listing preview — proof lives beside the photo, never on top of it */}
          <Reveal delay={0.1} className="mt-6 rounded-2xl border border-[#1C1C22] bg-[#111116]">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-[#1C1C22] sm:aspect-[21/9]">
              <Image src={LISTING.image} alt={LISTING.imageAlt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-3 pt-12 sm:px-5">
                <p className="text-[14px] font-semibold text-white">
                  ${metrics.price}{" "}
                  <span className="text-[12px] font-normal text-white/80 line-through">${LISTING.retailPrice}</span>{" "}
                  <span style={{ color: ACCENT_BRIGHT }}>&minus;{pct}%</span>
                </p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.16em" }}>
                Fig. 02 — Listing preview
              </p>
              <h2 className="mt-1.5 text-[15px] font-semibold text-white">{LISTING.title}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-[#D4D4D8]">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                  {LISTING.matchPct}% match
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-[#D4D4D8]">
                  <BadgeCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                  Grade {grade}
                </span>
                {LISTING.sellerVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-[#D4D4D8]">
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    Verified seller
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export { ACCENT, ACCENT_BRIGHT };
