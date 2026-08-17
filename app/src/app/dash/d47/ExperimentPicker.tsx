"use client";

import type { ExperimentId } from "./data";
import { currentCi, currentLift, EXPERIMENTS, formatLift, round2, significanceState } from "./data";
import { ACCENT_BORDER, FOCUS_VISIBLE, NUM, STATUS_LABEL, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";
import { Badge, EyebrowLabel, ToneDot } from "./ui";

const SPARK_W = 96;
const SPARK_H = 24;

function MiniSpark({ values, positive }: { values: number[]; positive: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = round2((i / (values.length - 1)) * SPARK_W);
    const y = round2(SPARK_H - ((v - min) / range) * SPARK_H);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} className="h-6 w-full" aria-hidden="true">
      <polyline points={points.join(" ")} fill="none" className={positive ? "stroke-emerald-400" : "stroke-rose-400"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ExperimentPicker({ selectedId, onSelect }: { selectedId: ExperimentId; onSelect: (id: ExperimentId) => void }) {
  return (
    <div>
      <EyebrowLabel>Select an experiment</EyebrowLabel>
      <div role="radiogroup" aria-label="Experiments" className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {EXPERIMENTS.map((exp) => {
          const lift = currentLift(exp);
          const { ciLow, ciHigh } = currentCi(exp);
          const sig = significanceState(ciLow, ciHigh);
          const selected = exp.id === selectedId;
          const spark = exp.series.history.slice(-10).map((p) => p.lift);
          return (
            <button
              key={exp.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(exp.id)}
              className={cx(
                "flex flex-col rounded-xl border p-3 text-left",
                TRANSITION,
                FOCUS_VISIBLE,
                selected ? cx("bg-cyan-400/10", ACCENT_BORDER) : "border-white/10 bg-zinc-900 hover:bg-zinc-900/70",
              )}
            >
              <div className="flex items-start justify-between gap-1.5">
                <span className={cx("line-clamp-2 min-h-[2.2em] text-xs font-semibold leading-tight", TEXT_PRIMARY)}>{exp.name}</span>
                <ToneDot tone={STATUS_TONE[exp.status]} />
              </div>
              <span className={cx("mt-0.5 truncate text-[11px]", TEXT_CAPTION)}>{STATUS_LABEL[exp.status]}</span>

              <div className="mt-2">
                <MiniSpark values={spark} positive={lift >= 0} />
              </div>

              <div className="mt-1.5 flex items-center justify-between gap-1">
                <span className={cx("text-sm font-semibold", NUM, sig === "significant-negative" ? "text-rose-400" : TEXT_PRIMARY)}>{formatLift(lift)}</span>
                {sig !== "not-yet" ? (
                  <Badge tone={TONE[sig === "significant-negative" ? "bad" : "good"]}>Significant</Badge>
                ) : (
                  <span className={cx("text-[10px] font-medium", TEXT_CAPTION)}>Pending</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
