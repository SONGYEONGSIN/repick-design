"use client";

import { Check, GitBranch, Timer } from "lucide-react";
import { TriageTree } from "./TriageTree";
import {
  CONDITION_OPTIONS,
  DEVICE_OPTIONS,
  LEAVES,
  formatRange,
  type DeviceType,
} from "./tree";
import { ACCENT, ACCENT_SOFT_BG, BORDER, BORDER_STRONG, FG, MUTED, PROSE_WIDTH_COLUMN, SURFACE } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-wide)" };

interface ValueSplitProps {
  deviceType: DeviceType | null;
  conditionId: string | null;
  urgent: boolean;
  onSetDevice: (d: DeviceType) => void;
  onSetCondition: (c: string) => void;
  onClearCondition: () => void;
  onClearDevice: () => void;
  onToggleUrgent: () => void;
}

const PILLARS = [
  {
    icon: GitBranch,
    label: "The question changes with you",
    description: "Pick a laptop and you're asked about the screen. Pick headphones and you're asked about each side — not the same question in different words.",
  },
  {
    icon: Timer,
    label: "Rush or patient, always different",
    description: "Every one of the nine paths through this tree has two distinct offers, not just the obvious broken ones — toggling always changes something real.",
  },
  {
    icon: Check,
    label: "Change your mind, the tree prunes",
    description: "Pick a different device and the condition question clears, because it's a different question. Nothing stale is left lit up on the tree.",
  },
];

/**
 * "Value, three ways" — the tree's three guarantees explained independently, a full mirror of
 * the device, and the complete nine-leaf lookup table. Every row is produced by reading the SAME
 * `LEAVES` data and `formatRange` function the live device uses — nothing here is a hand-typed
 * shadow copy, and the current leaf (if any) is highlighted.
 */
export function ValueSplit({
  deviceType,
  conditionId,
  urgent,
  onSetDevice,
  onSetCondition,
  onClearCondition,
  onClearDevice,
  onToggleUrgent,
}: ValueSplitProps) {
  const currentLeafId = deviceType && conditionId ? `${deviceType}-${conditionId}` : null;

  return (
    <section id="value" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ ...displayFace, color: FG }}>
          Value, three ways
        </h2>
        <p className="mt-1.5 max-w-[560px] text-[14.5px] font-normal leading-[1.6]" style={{ color: MUTED }}>
          Nine fixed paths, two offers each — the tree never improvises an answer.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.label} className="min-w-0 rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#FFFFFF" }}>
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
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              Walk the tree
            </p>
            <TriageTree
              deviceType={deviceType}
              conditionId={conditionId}
              urgent={urgent}
              onSetDevice={onSetDevice}
              onSetCondition={onSetCondition}
              onClearCondition={onClearCondition}
              onClearDevice={onClearDevice}
              onToggleUrgent={onToggleUrgent}
            />
            {currentLeafId && (
              <p className="mt-3 rounded-lg p-2.5 text-[12.5px] font-normal leading-[1.5]" style={{ backgroundColor: ACCENT_SOFT_BG, color: FG }}>
                {LEAVES.find((l) => l.id === currentLeafId)?.reasoning}
              </p>
            )}
          </div>

          <div id="lookup" className="min-w-0">
            <h3 className="text-[14px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
              All nine paths
            </h3>
            <p className="mt-1 text-[12.5px] font-normal" style={{ color: MUTED }}>
              Your current row is highlighted below.
            </p>
            <table className="mt-3 w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Trade-in channel and estimated range for every device/condition path, rush versus patient
              </caption>
              <colgroup>
                <col style={{ width: "40%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER_STRONG}` }}>
                  <th scope="col" className="py-2 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Path
                  </th>
                  <th scope="col" className="py-2 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Need it today
                  </th>
                  <th scope="col" className="py-2 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Can wait
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEVICE_OPTIONS.flatMap((device) =>
                  CONDITION_OPTIONS[device.id].map((condition) => {
                    const leaf = LEAVES.find((l) => l.deviceType === device.id && l.conditionId === condition.id);
                    if (!leaf) return null;
                    const isCurrent = leaf.id === currentLeafId;
                    return (
                      <tr
                        key={leaf.id}
                        style={{
                          borderBottom: `1px solid ${BORDER}`,
                          backgroundColor: isCurrent ? ACCENT_SOFT_BG : "transparent",
                        }}
                      >
                        <th scope="row" className="py-2 pr-2 text-[12px] font-semibold" style={{ color: FG }}>
                          {device.label} &rsaquo; {condition.label}
                          {isCurrent && (
                            <span
                              className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em]"
                              style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                            >
                              Now
                            </span>
                          )}
                        </th>
                        <td className="py-2 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: FG }}>
                          {formatRange(leaf.rush)}
                        </td>
                        <td className="py-2 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: ACCENT }}>
                          {formatRange(leaf.patient)}
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
