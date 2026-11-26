"use client";

import type { GradeId } from "./grades";
import { GradeLadder } from "./GradeLadder";
import { Reveal } from "./Reveal";
import { FG, MUTED, PROSE_WIDTH_COLUMN } from "./tokens";

interface DeviceSectionProps {
  gradeId: GradeId;
  includeAccessories: boolean;
  onSelectGrade: (id: GradeId) => void;
  onToggleAccessories: () => void;
}

/**
 * The full Grade Ladder device — same state, same component as the Hero's compact copy (no
 * second implementation to drift out of sync). This is where the resale-horizon bars and the
 * defect-tolerance checklist actually render; the Hero only ever shows the compact rungs + price.
 */
export function DeviceSection({ gradeId, includeAccessories, onSelectGrade, onToggleAccessories }: DeviceSectionProps) {
  return (
    <section id="device" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: MUTED }}>
            How grading works
          </p>
          <h2 className="mt-2.5 text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
            Every rung has a fixed set of rules
          </h2>
          <p className={`mt-3 text-[15px] font-normal leading-[1.6] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
            A grade is not a guess — it is a checklist a listing either passes or doesn&apos;t. Move
            down a rung and the price band drops with it, along with how much resale value it
            tends to hold at 3, 6, and 12 months out.
          </p>
          <p className={`mt-3 text-[15px] font-normal leading-[1.6] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
            Toggle the accessories switch and every number above adjusts the same way an original
            box and charger adjust resale value in practice — a small, consistent lift, not a
            different grade.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <GradeLadder
            gradeId={gradeId}
            includeAccessories={includeAccessories}
            onSelectGrade={onSelectGrade}
            onToggleAccessories={onToggleAccessories}
            headingId="ladder-label-full"
          />
          <span id="ladder-label-full" className="sr-only">
            Choose a condition grade
          </span>
        </Reveal>
      </div>
    </section>
  );
}
