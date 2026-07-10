"use client";

import { useState } from "react";
import type { PollStatus, Station } from "../data";
import { StatusChip, toneForPoll } from "./StatusChip";
import { FOCUS } from "./focus";
import styles from "../console.module.css";

const FILTERS: { id: PollStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "go", label: "Go" },
  { id: "hold", label: "Hold" },
  { id: "nogo", label: "No-Go" },
];

const STATUS_LABEL: Record<PollStatus, string> = { go: "Go", hold: "Hold", nogo: "No-Go" };

export function PollBoard({
  stations,
  relatedStations,
  relatedMilestoneLabel,
}: {
  stations: Station[];
  relatedStations: string[];
  relatedMilestoneLabel: string;
}) {
  const [filter, setFilter] = useState<PollStatus | "all">("all");
  const visible = filter === "all" ? stations : stations.filter((s) => s.status === filter);

  return (
    <section aria-labelledby="poll-board-heading" id="poll-board" className="min-w-0 scroll-mt-20 lg:col-span-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="poll-board-heading" className="text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
          03 — Go/No-Go Poll Board
        </h2>
        <div role="group" aria-label="Filter stations by poll status" className="flex gap-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-sm border px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors ${FOCUS}`}
                style={{
                  borderColor: active ? "var(--hf-accent)" : "var(--hf-border)",
                  color: active ? "var(--hf-accent)" : "var(--hf-text-3)",
                  background: active ? "var(--hf-panel-2)" : "transparent",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${styles.panel} p-4 sm:p-6`}>
        <p className="mb-3 text-xs" style={{ color: "var(--hf-text-3)" }}>
          Stations owning the selected milestone (
          <span style={{ color: "var(--hf-accent)" }}>{relatedMilestoneLabel}</span>) are outlined below.
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {visible.map((s) => {
            const linked = relatedStations.includes(s.code);
            return (
              <li
                key={s.code}
                className={`${styles.panelRaised} relative min-w-0 p-3`}
                style={linked ? { borderColor: "var(--hf-accent)", boxShadow: "inset 0 0 0 1px var(--hf-accent)" } : undefined}
              >
                {linked && (
                  <span
                    className="mb-1.5 inline-block font-mono text-[9px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: "var(--hf-accent)" }}
                  >
                    ◆ Linked
                  </span>
                )}
                <p className="truncate font-mono text-xs font-bold uppercase tracking-[0.04em]" style={{ color: "var(--hf-text)" }}>
                  {s.code}
                </p>
                <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--hf-text-3)" }}>
                  {s.name}
                </p>
                <div className="mt-2">
                  <StatusChip tone={toneForPoll(s.status)} label={STATUS_LABEL[s.status]} />
                </div>
                <p className="mt-2 font-mono text-[10px] tabular-nums" style={{ color: "var(--hf-text-3)" }}>
                  Poll {s.lastPoll}
                </p>
                <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--hf-text-2)" }}>
                  {s.note}
                </p>
              </li>
            );
          })}
        </ul>
        {visible.length === 0 && (
          <p className="py-6 text-center text-sm" style={{ color: "var(--hf-text-3)" }}>
            No stations match this filter.
          </p>
        )}
      </div>
    </section>
  );
}
