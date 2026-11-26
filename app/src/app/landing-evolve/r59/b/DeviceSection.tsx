"use client";

import { FrameScrubber } from "./FrameScrubber";
import { Reveal } from "./Reveal";
import { FG, MUTED, PROSE_WIDTH_COLUMN } from "./tokens";

interface DeviceSectionProps {
  frameIndex: number;
  humanReview: boolean;
  onScrub: (index: number) => void;
  onToggleHumanReview: () => void;
}

/**
 * The full frame scrubber device — same state, same component as the Hero's compact copy. This
 * is where the deduction breakdown, the human-review toggle, and the expandable detail row
 * actually render; the Hero only ever shows the compact scrubber + price/confidence line.
 */
export function DeviceSection({ frameIndex, humanReview, onScrub, onToggleHumanReview }: DeviceSectionProps) {
  return (
    <section id="device" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: MUTED }}>
            How the price is built
          </p>
          <h2 className="mt-2.5 text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
            Every deduction has a frame behind it
          </h2>
          <p className={`mt-3 text-[15px] font-normal leading-[1.6] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
            Drag the scrubber through intake, serial scan, battery test, cosmetic grading, and
            final reconciliation. Price and confidence update at every stop — not just at the
            end.
          </p>
          <p className={`mt-3 text-[15px] font-normal leading-[1.6] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
            Route checks to a human reviewer and watch the battery-test deduction change —
            not by a flat discount, but because a reviewer caught something the AI&apos;s default
            baseline missed.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <span id="scrub-label-full" className="sr-only">
            Drag through the inspection
          </span>
          <FrameScrubber
            frameIndex={frameIndex}
            humanReview={humanReview}
            onScrub={onScrub}
            onToggleHumanReview={onToggleHumanReview}
            labelId="scrub-label-full"
          />
        </Reveal>
      </div>
    </section>
  );
}
