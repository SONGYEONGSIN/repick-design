"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Gauge } from "./Gauge";
import { WeightSlider } from "./WeightSlider";
import { FACTOR_META, FACTOR_ORDER, PRESETS, RAW_SCORES, REFERENCE_LISTING, discountPct } from "./data";
import type { FactorKey, WeightState } from "./gauge-math";

const ACCENT = "#D97706"; // amber-600 — see candidates/c.md for computed contrast
const ACCENT_BRIGHT = "#FCD34D"; // amber-300 — small text / focus rings on dark ground

export function Hero({
  weights,
  onWeightChange,
  onPreset,
  activePreset,
  composite,
  contributions,
}: {
  weights: WeightState;
  onWeightChange: (key: FactorKey, value: number) => void;
  onPreset: (id: string, weights: WeightState) => void;
  activePreset: string | null;
  composite: number;
  contributions: WeightState;
}) {
  const pct = discountPct(REFERENCE_LISTING.originalPrice, REFERENCE_LISTING.price);

  return (
    <section className="relative overflow-hidden border-b border-[#1C1C22] bg-[#0B0B0F] px-6 pb-16 pt-28 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Left: headline, subhead, CTA — asymmetric, oversized clamp() scale */}
        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.28em" }}>
            Fig. 01 — Composite grading
          </p>
          <h1
            className="mt-5 text-white"
            style={{
              fontFamily: "var(--font-display-grotesk)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2.75rem, 3.2vw + 2rem, 5.5rem)",
              lineHeight: 0.98,
            }}
          >
            One score.
            <br />
            Weighted your way.
          </h1>
          <p className="mt-6 max-w-[492px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
            Every listing carries a Trust Score built from four inspected factors. Nothing here is a
            black box — drag any weight below and watch the same real listing recompute in place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#closing-cta"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-[#0B0B0F] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ backgroundColor: ACCENT, outlineColor: ACCENT_BRIGHT }}
            >
              See your weighted score
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-[13px] font-normal text-[#71717A]">No account needed to explore weights.</span>
          </div>
        </div>

        {/* Right: the console itself — gauge + reference listing + weight sliders, all inside the hero. */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-[#1C1C22] bg-[#111116] p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 border-b border-[#1C1C22] pb-6 sm:flex-row sm:items-start">
              <Gauge value={composite} accent={ACCENT} />

              {/* Real product reference the score is computed from — lives inside the same console card. */}
              <div className="flex w-full items-start gap-3 sm:w-auto sm:flex-1">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#1C1C22]">
                  <Image
                    src={REFERENCE_LISTING.image}
                    alt={REFERENCE_LISTING.imageAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white">{REFERENCE_LISTING.title}</p>
                  <p className="mt-0.5 text-[12px] font-normal text-[#A1A1AA]">
                    ${REFERENCE_LISTING.price.toLocaleString()}{" "}
                    <span className="text-[#71717A] line-through">${REFERENCE_LISTING.originalPrice.toLocaleString()}</span>{" "}
                    <span style={{ color: ACCENT_BRIGHT }}>&minus;{pct}%</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-normal text-[#71717A]">
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    Seller verified · Grade {REFERENCE_LISTING.conditionGrade}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Weight presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onPreset(preset.id, preset.weights)}
                  aria-pressed={activePreset === preset.id}
                  className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={
                    activePreset === preset.id
                      ? { backgroundColor: ACCENT, borderColor: ACCENT, color: "#0B0B0F", outlineColor: ACCENT_BRIGHT }
                      : { borderColor: "#27272E", color: "#A1A1AA", outlineColor: ACCENT_BRIGHT }
                  }
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-5">
              {FACTOR_ORDER.map((key) => (
                <WeightSlider
                  key={key}
                  id={key}
                  label={FACTOR_META[key].label}
                  hint={FACTOR_META[key].hint}
                  value={weights[key]}
                  rawScore={RAW_SCORES[key]}
                  contribution={contributions[key]}
                  accent={ACCENT}
                  onChange={(next) => onWeightChange(key, next)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { ACCENT, ACCENT_BRIGHT };
