"use client";

import { Clock, ShieldCheck, TrendingUp } from "lucide-react";
import { PEAK_DAY, payoutAtDay, phaseAtDay, PHASE_LABEL } from "./curve";
import { TimingDial } from "./TimingDial";
import { ACCENT, ACCENT_SOFT_BG, BORDER, BORDER_STRONG, FG, MUTED, PROSE_WIDTH_COLUMN, SURFACE } from "./tokens";

interface ValueSplitProps {
  day: number;
  certified: boolean;
  onDayChange: (day: number) => void;
  onToggleCertified: () => void;
}

const PILLARS = [
  {
    icon: TrendingUp,
    label: "See the real curve",
    description: "Not a flat quote — a two-segment projection that rises to a named peak and then declines, the same shape every time you load the page.",
  },
  {
    icon: Clock,
    label: "Know your window",
    description: "The peak window is named, not hidden in a paragraph. Land inside it and the recommendation says so; drift past it and it says that too.",
  },
  {
    icon: ShieldCheck,
    label: "Certify once, gain everywhere",
    description: "The verified condition certificate doesn't nudge one number — it rescales every day on the curve by the same fixed premium.",
  },
];

const MILESTONE_DAYS = [0, 15, 30, 45, 60, 90, 120, 150, 180];

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

/**
 * "Value, three ways" — the dial's three guarantees explained independently, a full mirror of the
 * device (same state, same shared derivation, larger type scale, with the recommendation
 * sentence always visible), and a milestone reference table so the continuous curve has fixed,
 * checkable anchor points. Every row of the table is produced by calling the SAME
 * `payoutAtDay`/`phaseAtDay` functions the live device uses — nothing here is a hand-typed shadow
 * copy.
 */
export function ValueSplit({ day, certified, onDayChange, onToggleCertified }: ValueSplitProps) {
  return (
    <section id="value" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ ...displayFace, color: FG }}>
          Value, three ways
        </h2>
        <p className="mt-1.5 max-w-[560px] text-[14.5px] font-normal leading-[1.6]" style={{ color: MUTED }}>
          The dial doesn&rsquo;t just move a number — it moves the whole argument for when you should sell.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.label} className="min-w-0 rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#09090B" }}>
                <Icon className="h-5 w-5" aria-hidden="true" style={{ color: ACCENT }} />
                <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
                  {pillar.label}
                </h3>
                <p className={`mt-1.5 text-[13.5px] font-normal leading-[1.55] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <p id="dial-label-full" className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              Adjust your timeline
            </p>
            <TimingDial
              day={day}
              certified={certified}
              onDayChange={onDayChange}
              onToggleCertified={onToggleCertified}
              dialLabelId="dial-label-full"
            />
          </div>

          <div id="milestones" className="min-w-0">
            <h3 className="text-[14px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
              Nine fixed milestones
            </h3>
            <p className="mt-1 text-[12.5px] font-normal" style={{ color: MUTED }}>
              Your current day is highlighted below. Peak is day {PEAK_DAY}.
            </p>
            <table className="mt-3 w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Projected payout by day, with and without the verified condition certificate
              </caption>
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "26%" }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER_STRONG}` }}>
                  <th scope="col" className="py-2 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Day
                  </th>
                  <th scope="col" className="py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Phase
                  </th>
                  <th scope="col" className="py-2 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Standard
                  </th>
                  <th scope="col" className="py-2 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Certified
                  </th>
                </tr>
              </thead>
              <tbody>
                {MILESTONE_DAYS.map((milestoneDay) => {
                  const isCurrent = milestoneDay === day;
                  const phase = phaseAtDay(milestoneDay);
                  return (
                    <tr
                      key={milestoneDay}
                      style={{
                        borderBottom: `1px solid ${BORDER}`,
                        backgroundColor: isCurrent ? ACCENT_SOFT_BG : "transparent",
                      }}
                    >
                      <th scope="row" className="py-2 pr-2 text-[12.5px] font-semibold tabular-nums" style={{ color: FG }}>
                        {milestoneDay}
                        {isCurrent && (
                          <span
                            className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em]"
                            style={{ backgroundColor: ACCENT, color: "#09090B" }}
                          >
                            Now
                          </span>
                        )}
                      </th>
                      <td className="py-2 text-[12px] font-normal" style={{ color: MUTED }}>
                        {PHASE_LABEL[phase]}
                      </td>
                      <td className="py-2 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: FG }}>
                        ${payoutAtDay(milestoneDay, false)}
                      </td>
                      <td className="py-2 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: ACCENT }}>
                        ${payoutAtDay(milestoneDay, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
