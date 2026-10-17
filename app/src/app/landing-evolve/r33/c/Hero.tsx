"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import PulseWaveform from "./PulseWaveform";
import Reveal from "./Reveal";
import { FEATURED_LISTING } from "./data";
import { ACCENT_BUTTON_FILL, ACCENT_TINT, BORDER_SOFT, MUTED, PANEL_BG } from "./theme";
import type { ActiveChecks, CheckId } from "./waveform";

interface HeroProps {
  active: ActiveChecks;
  onToggle: (id: CheckId) => void;
}

export default function Hero({ active, onToggle }: HeroProps) {
  const discountPct = Math.round(
    ((FEATURED_LISTING.retailPrice - FEATURED_LISTING.listedPrice) / FEATURED_LISTING.retailPrice) * 100,
  );

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_1fr] lg:items-start lg:gap-8">
          <div>
            <Reveal>
              <p
                className="text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: ACCENT_TINT }}
              >
                Verification, traced live
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1
                className="mt-4 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Trust, drawn
                <br />
                as one line.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p
                className="mt-5 max-w-[32em] text-base leading-[1.6] sm:text-lg"
                style={{ color: MUTED }}
              >
                repick runs five independent checks on every listing and traces the result as a
                single confidence line you can watch move. Nothing about a match is scored
                off-screen.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#value"
                  className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF]"
                  style={{ backgroundColor: ACCENT_BUTTON_FILL, outlineColor: ACCENT_TINT }}
                >
                  See how the line is built
                </a>
                <a
                  href="#preview"
                  className="rounded-full border px-6 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF]"
                  style={{ borderColor: BORDER_SOFT, outlineColor: ACCENT_TINT }}
                >
                  Browse verified listings
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:pt-1">
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{ borderColor: BORDER_SOFT, backgroundColor: PANEL_BG }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <Image
                    src={FEATURED_LISTING.image}
                    alt={FEATURED_LISTING.alt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {FEATURED_LISTING.title}
                  </p>
                  <p className="truncate text-xs" style={{ color: MUTED }}>
                    {FEATURED_LISTING.brand}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-lg border px-2.5 py-2" style={{ borderColor: BORDER_SOFT }}>
                  <dt className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                    Match
                  </dt>
                  <dd className="mt-0.5 text-sm font-extrabold tabular-nums text-white">
                    {FEATURED_LISTING.matchPercent}%
                  </dd>
                </div>
                <div className="rounded-lg border px-2.5 py-2" style={{ borderColor: BORDER_SOFT }}>
                  <dt className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                    Condition
                  </dt>
                  <dd className="mt-0.5 text-sm font-extrabold tabular-nums text-white">
                    {FEATURED_LISTING.conditionGrade}
                  </dd>
                </div>
                <div className="rounded-lg border px-2.5 py-2" style={{ borderColor: BORDER_SOFT }}>
                  <dt className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                    Seller
                  </dt>
                  <dd className="mt-0.5 flex items-center gap-1 text-sm font-extrabold text-white">
                    <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} />
                    Verified
                  </dd>
                </div>
                <div className="rounded-lg border px-2.5 py-2" style={{ borderColor: BORDER_SOFT }}>
                  <dt className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>
                    Retail vs. now
                  </dt>
                  <dd className="mt-0.5 text-sm font-extrabold tabular-nums text-white">
                    ${FEATURED_LISTING.listedPrice}{" "}
                    <span style={{ color: ACCENT_TINT }}>-{discountPct}%</span>
                  </dd>
                </div>
              </dl>

              <div className="mt-5 border-t pt-5" style={{ borderColor: BORDER_SOFT }}>
                <PulseWaveform active={active} onToggle={onToggle} idPrefix="hero" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
