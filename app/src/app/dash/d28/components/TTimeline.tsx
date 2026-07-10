"use client";

import type { CSSProperties } from "react";
import type { Milestone } from "../data";
import { StatusChip, toneForMilestone } from "./StatusChip";
import { CornerBracket } from "./CornerBracket";
import { FOCUS } from "./focus";
import styles from "../console.module.css";

const STATUS_LABEL: Record<Milestone["status"], string> = {
  complete: "Complete",
  holding: "Holding",
  pending: "Pending",
};

function markerStyle(status: Milestone["status"], selected: boolean): CSSProperties {
  if (status === "complete") {
    return { background: "var(--hf-go)", borderColor: "var(--hf-go)" };
  }
  if (status === "holding") {
    return { background: "var(--hf-hold)", borderColor: "var(--hf-hold)" };
  }
  return {
    background: "transparent",
    borderColor: selected ? "var(--hf-accent)" : "var(--hf-border-strong)",
  };
}

export function TTimeline({
  milestones,
  selectedId,
  onSelect,
}: {
  milestones: Milestone[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-labelledby="timeline-heading" id="timeline" className="scroll-mt-20">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="timeline-heading" className="text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
          02 — T-Timeline
        </h2>
        <p className="text-xs" style={{ color: "var(--hf-text-3)" }}>
          Select a milestone to sync checklist, propellant load, and station poll below.
        </p>
      </div>

      <div className={`${styles.panel} relative p-4 sm:p-6`}>
        <CornerBracket />
        <ol className={`${styles.scrollX} flex list-none gap-0 pb-2`}>
          {milestones.map((m, i) => {
            const selected = m.id === selectedId;
            const tone = toneForMilestone(m.status);
            return (
              <li key={m.id} className="relative w-40 flex-none">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-5 h-0.5"
                    style={{
                      left: "-50%",
                      right: "50%",
                      background:
                        milestones[i - 1].status === "complete" ? "var(--hf-go)" : "var(--hf-border-strong)",
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onSelect(m.id)}
                  aria-pressed={selected}
                  aria-current={m.status === "holding" ? "step" : undefined}
                  aria-label={`${m.tMinus} — ${m.title} — ${STATUS_LABEL[m.status]}${selected ? " — selected" : ""}`}
                  className={`flex w-full flex-col items-center gap-2 rounded-md p-2 pt-0 transition-colors hover:bg-[var(--hf-panel-2)] ${FOCUS}`}
                >
                  <span
                    aria-hidden="true"
                    className={`relative z-10 mt-0 h-6 w-3 rounded-[2px] border-2 ${m.status === "holding" ? styles.holdPulse : ""}`}
                    style={markerStyle(m.status, selected)}
                  />
                  <span
                    className="w-full rounded-md p-2 text-center"
                    style={{
                      background: selected ? "var(--hf-panel-2)" : "transparent",
                      outline: selected ? "1px solid var(--hf-accent)" : "1px solid transparent",
                    }}
                  >
                    <span className="block font-mono text-sm font-bold tabular-nums" style={{ color: "var(--hf-text)" }}>
                      {m.tMinus}
                    </span>
                    <span className="mt-1 block text-xs leading-snug" style={{ color: "var(--hf-text-2)" }}>
                      {m.title}
                    </span>
                    <span className="mt-2 flex flex-col items-center gap-1">
                      <StatusChip tone={tone} label={STATUS_LABEL[m.status]} />
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.08em]"
                        style={{ color: "var(--hf-text-3)" }}
                      >
                        {m.station}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
