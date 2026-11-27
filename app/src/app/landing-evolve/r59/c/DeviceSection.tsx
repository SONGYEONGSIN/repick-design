"use client";

import type { StrictnessMode } from "./categories";
import { Reveal } from "./Reveal";
import { FG, MUTED, PROSE_WIDTH_COLUMN } from "./tokens";
import { TrustBreakdown } from "./TrustBreakdown";

interface DeviceSectionProps {
  activeIds: Set<string>;
  mode: StrictnessMode;
  onToggleCategory: (id: string) => void;
  onSetMode: (mode: StrictnessMode) => void;
}

/**
 * The full Trust Breakdown device — same state, same component as the Hero's compact copy. This
 * is where the strictness toggle, the per-category bars, and the expandable detail rows actually
 * render; the Hero only ever shows the compact chips + score.
 */
export function DeviceSection({ activeIds, mode, onToggleCategory, onSetMode }: DeviceSectionProps) {
  return (
    <section id="device" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: MUTED }}>
            How the score is built
          </p>
          <h2 className="mt-2.5 text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
            Five checks, five fixed point values
          </h2>
          <p className={`mt-3 text-[15px] font-normal leading-[1.6] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
            Turn a category off and its points leave the score — nothing is hidden, nothing is
            renormalized behind your back. The bar for each category shows exactly how many
            points it&apos;s worth right now.
          </p>
          <p className={`mt-3 text-[15px] font-normal leading-[1.6] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
            Switch to Strict and the weights themselves change — functional testing jumps from 20
            points to 36, more than photos and cosmetic grading combined. Both modes still max
            out at 100.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <span id="breakdown-label-full" className="sr-only">
            Toggle what counts
          </span>
          <TrustBreakdown
            activeIds={activeIds}
            mode={mode}
            onToggleCategory={onToggleCategory}
            onSetMode={onSetMode}
            groupLabelId="breakdown-label-full"
          />
        </Reveal>
      </div>
    </section>
  );
}
