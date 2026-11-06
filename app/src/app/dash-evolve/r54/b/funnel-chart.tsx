"use client";

import { Gauge } from "lucide-react";
import { useId, useState } from "react";
import { MEDIAN_TIME_TO_LIVE_HOURS, SHIPPED_LAST_90_DAYS, STAGE_DURATIONS } from "./data";
import { BORDER, FOCUS_RING, NUM, PANEL, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * Pipeline-velocity strip — the one supporting, generative chart the brief requires. It sits in the
 * header, clearly secondary to the board below: four bars, one per pre-live stage, sized by that
 * stage's median hours (not by a trig function, so there is nothing to round to 2dp — the widths
 * are plain percentages of the max value). Every bar's key value (its median hour count) is set as
 * permanent visible text next to the bar; hovering or focusing a bar only adds the sample-size
 * detail, never the headline number itself.
 */
export default function FunnelChart() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const titleId = useId();
  const max = Math.max(...STAGE_DURATIONS.map((s) => s.medianHours));

  return (
    <section aria-labelledby={titleId} className={cx(PANEL, "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5")}>
      <div className="flex shrink-0 items-start gap-3 sm:w-56">
        <Gauge size={16} aria-hidden="true" className={cx("mt-0.5 shrink-0", "text-cyan-400")} />
        <div className="min-w-0">
          <h2 id={titleId} className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
            Pipeline velocity
          </h2>
          <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>Median hours per stage, trailing 90 days</p>
          <p className={cx("mt-2 text-xl font-semibold leading-none sm:text-2xl", NUM, TEXT_PRIMARY)}>
            {MEDIAN_TIME_TO_LIVE_HOURS}h
            <span className={cx("ml-1.5 text-xs font-medium", TEXT_CAPTION)}>median to Live &middot; n={SHIPPED_LAST_90_DAYS}</span>
          </p>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <ol className="flex flex-col gap-2">
          {STAGE_DURATIONS.map((s, idx) => {
            const widthPct = Math.round((s.medianHours / max) * 10000) / 100;
            const isActive = activeIdx === idx;
            return (
              <li key={s.stageId} className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx((v) => (v === idx ? null : v))}
                  onFocus={() => setActiveIdx(idx)}
                  onBlur={() => setActiveIdx((v) => (v === idx ? null : v))}
                  aria-describedby={isActive ? `${titleId}-tip-${idx}` : undefined}
                  className={cx("group flex w-full items-center gap-3 rounded-lg px-1 py-0.5 text-left", FOCUS_RING, TRANSITION)}
                >
                  <span className={cx("w-20 shrink-0 text-xs font-medium", TEXT_PRIMARY)}>{s.label}</span>
                  <span className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
                    <span
                      aria-hidden="true"
                      className={cx("absolute inset-y-0 left-0 rounded-full bg-cyan-400", TRANSITION, isActive ? "bg-cyan-300" : undefined)}
                      style={{ width: `${widthPct}%` }}
                    />
                  </span>
                  <span className={cx("w-10 shrink-0 text-right text-xs font-semibold", NUM, TEXT_PRIMARY)}>{s.medianHours}h</span>
                </button>
                {isActive ? (
                  <div
                    id={`${titleId}-tip-${idx}`}
                    role="tooltip"
                    className={cx(
                      "absolute left-20 top-full z-20 mt-1 rounded-lg border px-2.5 py-1.5 text-[11px] shadow-lg shadow-black/40",
                      BORDER,
                      "bg-zinc-900",
                      TEXT_CAPTION,
                    )}
                  >
                    <span className={cx("font-medium", TEXT_PRIMARY)}>{s.sampleSize}</span> deployments passed through &middot; median {s.medianHours}h
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
