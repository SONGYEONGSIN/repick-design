"use client";

import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { FEATURED_LISTING } from "./data";
import { ACCENT_BUTTON_FILL, ACCENT_TINT, BORDER_SOFT, INK, MUTED } from "./theme";
import { CHECKS, computeComposite, computeOfferFloor, type ActiveChecks } from "./waveform";

interface ClosingCTAProps {
  active: ActiveChecks;
}

export default function ClosingCTA({ active }: ClosingCTAProps) {
  const composite = computeComposite(active);
  const offerFloor = computeOfferFloor(composite, FEATURED_LISTING.listedPrice);
  const activeCount = CHECKS.filter((c) => active[c.id]).length;

  return (
    <section id="start" className="relative">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <div
            className="rounded-3xl border p-6 sm:p-10 lg:p-14"
            style={{ borderColor: BORDER_SOFT, backgroundColor: INK }}
          >
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2
                  className="max-w-[18em] text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  The line doesn&apos;t hide anything.
                </h2>
                <p className="mt-4 max-w-[32em] text-base leading-[1.6]" style={{ color: MUTED }}>
                  Right now this listing is holding at{" "}
                  <span className="font-semibold tabular-nums text-white">{composite}%</span>{" "}
                  confidence, with{" "}
                  <span className="font-semibold tabular-nums text-white">
                    {activeCount} of {CHECKS.length}
                  </span>{" "}
                  checks active and a suggested offer floor of{" "}
                  <span className="font-semibold tabular-nums text-white">${offerFloor}</span>.
                  Every match on repick carries the same line.
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-3">
                <a
                  href="#preview"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF]"
                  style={{ backgroundColor: ACCENT_BUTTON_FILL, outlineColor: ACCENT_TINT }}
                >
                  Browse verified matches — {composite}%
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="#top"
                  className="rounded-full border px-6 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF]"
                  style={{ borderColor: BORDER_SOFT, outlineColor: ACCENT_TINT }}
                >
                  Back to the trace
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-xs" style={{ color: MUTED }}>
          © 2026 repick.
        </p>
      </div>
    </section>
  );
}
