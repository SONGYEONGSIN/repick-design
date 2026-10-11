"use client";

import PulseWaveform from "./PulseWaveform";
import Reveal from "./Reveal";
import { FEATURED_LISTING } from "./data";
import { ACCENT_TINT, BORDER_SOFT, MUTED, PANEL_BG } from "./theme";
import { CHECKS, computeComposite, computeOfferFloor, type ActiveChecks, type CheckId } from "./waveform";

interface ValueSectionProps {
  active: ActiveChecks;
  onToggle: (id: CheckId) => void;
}

export default function ValueSection({ active, onToggle }: ValueSectionProps) {
  const composite = computeComposite(active);
  const offerFloor = computeOfferFloor(composite, FEATURED_LISTING.listedPrice);

  return (
    <section id="value" className="relative">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <h2
            className="max-w-[22em] text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            The line decides what it&apos;s worth.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 max-w-[32em] text-base leading-[1.6]" style={{ color: MUTED }}>
            Toggle a check below on the {FEATURED_LISTING.title.toLowerCase()}. The composite
            confidence score recalculates, and so does the offer floor repick would suggest on
            this exact listing — same formula, run again, live.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div
              className="flex h-full flex-col rounded-2xl border p-5"
              style={{ borderColor: BORDER_SOFT, backgroundColor: PANEL_BG }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                Run the trace
              </p>
              <div className="mt-3">
                <PulseWaveform active={active} onToggle={onToggle} variant="compact" idPrefix="value" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-1">
            <div
              className="flex h-full flex-col rounded-2xl border p-5"
              style={{ borderColor: BORDER_SOFT, backgroundColor: PANEL_BG }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                What&apos;s weighted
              </p>
              <ul className="mt-3 flex flex-1 flex-col gap-2.5">
                {CHECKS.map((check) => (
                  <li key={check.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-white/90">{check.label}</span>
                    <span
                      className="shrink-0 tabular-nums font-semibold"
                      style={{ color: ACCENT_TINT }}
                    >
                      {Math.round(check.weight * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-[1.6]" style={{ color: MUTED }}>
                Weights are fixed per listing category. Only which checks are switched on moves
                the score.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-1">
            <div
              className="flex h-full flex-col rounded-2xl border p-5"
              style={{ borderColor: BORDER_SOFT, backgroundColor: PANEL_BG }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                Suggested offer floor
              </p>
              <p
                className="mt-2 tabular-nums font-extrabold leading-none text-white"
                style={{ fontFamily: "var(--font-display-mono)", fontSize: "2.75rem" }}
              >
                ${offerFloor}
              </p>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>
                against a ${FEATURED_LISTING.retailPrice} retail price
              </p>
              <p className="mt-4 text-xs leading-[1.6]" style={{ color: MUTED }}>
                Not a market refresh — this is the same formula the trust line feeds, recalculated
                the moment a check is toggled: 60% of list price, plus 40% scaled by confidence.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
