"use client";

import { useEffect, useMemo, useRef } from "react";
import { CircleDashed } from "lucide-react";
import {
  type Job,
  MONTH_VIEW_END,
  MONTH_VIEW_START,
  STATUS_META,
  TODAY_DAY,
  UNSCHEDULED_JOBS,
  WEEK_VIEW_END,
  WEEK_VIEW_START,
  dayToDate,
  formatDay,
  formatPercent,
  formatRange,
  FOCUS_RING,
} from "./data";

export type ViewMode = "week" | "month";

interface GanttChartProps {
  jobs: Job[];
  viewMode: ViewMode;
  pinnedId: string | null;
  onPin: (id: string) => void;
}

function buildTicks(windowStart: number, windowEnd: number, mode: ViewMode) {
  const span = windowEnd - windowStart + 1;
  if (mode === "month") {
    const ticks: { day: number; label: string }[] = [];
    for (let d = windowStart; d <= windowEnd; d += 7) {
      ticks.push({ day: d, label: formatDay(d) });
    }
    return { ticks, span };
  }
  const ticks: { day: number; label: string }[] = [];
  for (let d = windowStart; d <= windowEnd; d += 1) {
    ticks.push({ day: d, label: String(dayToDate(d).getDate()) });
  }
  return { ticks, span };
}

export default function GanttChart({ jobs, viewMode, pinnedId, onPin }: GanttChartProps) {
  const windowStart = viewMode === "month" ? MONTH_VIEW_START : WEEK_VIEW_START;
  const windowEnd = viewMode === "month" ? MONTH_VIEW_END : WEEK_VIEW_END;
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const visibleJobs = useMemo(
    () =>
      jobs
        .filter((j) => j.startDay !== null && j.endDay !== null && j.endDay >= windowStart && j.startDay <= windowEnd)
        .sort((a, b) => (a.startDay ?? 0) - (b.startDay ?? 0)),
    [jobs, windowStart, windowEnd]
  );

  const { ticks, span } = useMemo(() => buildTicks(windowStart, windowEnd, viewMode), [windowStart, windowEnd, viewMode]);
  const todayPct = TODAY_DAY >= windowStart && TODAY_DAY <= windowEnd ? ((TODAY_DAY - windowStart) / span) * 100 : null;

  useEffect(() => {
    if (!pinnedId) return;
    const el = rowRefs.current[pinnedId];
    if (!el) return;
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }, [pinnedId]);

  return (
    <div>
      {/* Legend: color is always paired with an icon + label, never color alone. */}
      <ul className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
        {(Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((key) => {
          const meta = STATUS_META[key];
          const Icon = meta.icon;
          return (
            <li key={key} className="flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${meta.text}`} aria-hidden="true" />
              {meta.label}
            </li>
          );
        })}
      </ul>

      <div className="rounded-lg border border-white/10">
        {/* Header ticks */}
        <div className="flex border-b border-white/10 bg-white/[0.03] text-[11px] text-zinc-400">
          <div className="w-36 shrink-0 border-r border-white/10 px-3 py-2 font-medium text-zinc-400 sm:w-60">Job</div>
          <div className="relative grid flex-1 pr-3" style={{ gridTemplateColumns: `repeat(${ticks.length}, minmax(0, 1fr))` }}>
            {ticks.map((t) => (
              <div key={t.day} className="truncate whitespace-nowrap py-2 pl-1.5 tabular-nums">
                {t.label}
              </div>
            ))}
            {todayPct !== null && (
              <div
                className="pointer-events-none absolute top-0.5 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-cyan-500 px-1.5 py-0.5 text-[10px] font-medium text-zinc-950"
                style={{ left: `${todayPct}%` }}
                aria-hidden="true"
              >
                Today
              </div>
            )}
          </div>
        </div>

        {/* Rows */}
        <div className="relative divide-y divide-white/5">
          {visibleJobs.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-zinc-400">No jobs fall inside this window.</p>
          )}
          {visibleJobs.map((job) => {
            const meta = STATUS_META[job.status];
            const Icon = meta.icon;
            const start = job.startDay as number;
            const end = job.endDay as number;
            const clippedStart = Math.max(start, windowStart);
            const clippedEnd = Math.min(end, windowEnd);
            const leftPct = ((clippedStart - windowStart) / span) * 100;
            const widthPct = Math.max(((clippedEnd - clippedStart + 1) / span) * 100, 0);
            const isPinned = job.id === pinnedId;
            const durationDays = end - start + 1;

            return (
              <div
                key={job.id}
                ref={(el) => {
                  rowRefs.current[job.id] = el;
                }}
                className={`flex scroll-mt-24 items-stretch transition-colors motion-reduce:transition-none ${
                  isPinned ? "bg-cyan-500/[0.07]" : ""
                }`}
              >
                <div className="w-36 shrink-0 border-r border-white/10 px-3 py-2.5 sm:w-60">
                  <p className="truncate text-sm font-medium text-zinc-50" title={job.site}>
                    {job.site}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-400">
                    {job.code} &middot; {job.crew}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 whitespace-nowrap text-[11px] text-zinc-400">
                    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${meta.bg} ${meta.text}`}>
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {meta.label}
                    </span>
                    <span>{formatRange(start, end)}</span>
                    <span>&middot; {durationDays}d</span>
                  </p>
                </div>

                <div className="relative min-h-[3.25rem] flex-1 pr-3">
                  {ticks.slice(1).map((t) => (
                    <div
                      key={t.day}
                      className="pointer-events-none absolute inset-y-0 w-px bg-white/5"
                      style={{ left: `${((t.day - windowStart) / span) * 100}%` }}
                      aria-hidden="true"
                    />
                  ))}
                  {todayPct !== null && (
                    <div
                      className="pointer-events-none absolute inset-y-0 z-[5] w-px bg-cyan-400/60"
                      style={{ left: `${todayPct}%` }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="group absolute inset-y-2 flex items-center" style={{ left: `${leftPct}%`, width: `${widthPct}%`, minWidth: "24px" }}>
                    <button
                      type="button"
                      onClick={() => onPin(job.id)}
                      aria-pressed={isPinned}
                      aria-label={`${job.code}, ${job.site}. ${formatRange(start, end)}, ${durationDays} days. Status: ${meta.label}. ${formatPercent(
                        job.progressPct
                      )} complete. Press to pin and view details.`}
                      className={`relative h-8 w-full min-w-[24px] overflow-hidden rounded-md border ${meta.barBorder} ${meta.barTrack} ${meta.barTrackHover} ${FOCUS_RING} ${
                        isPinned ? "ring-2 ring-cyan-300" : ""
                      }`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 ${meta.bar}`}
                        style={{ width: `${Math.max(job.progressPct, 6)}%` }}
                        aria-hidden="true"
                      />
                      <span className="relative flex h-full items-center gap-1 px-1.5">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-950" aria-hidden="true" />
                      </span>
                    </button>

                    {/* Hover / focus tooltip — fully ephemeral, CSS-driven, keyboard reachable via focus-within.
                        Its content duplicates the button's aria-label, so it's hidden from the a11y tree to
                        avoid a double announcement; sighted mouse and keyboard-focus users still see it. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-56 -translate-y-1 rounded-lg border border-white/10 bg-zinc-900 p-3 opacity-0 shadow-xl shadow-black/40 transition-opacity duration-100 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none"
                    >
                      <p className="text-xs font-semibold text-zinc-50">{job.site}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-400">{job.code} &middot; {job.crew}</p>
                      <p className="mt-1.5 text-[11px] text-zinc-300">{formatRange(start, end)} &middot; {durationDays} days</p>
                      <p className={`mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] ${meta.bg} ${meta.text}`}>
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {meta.label} &middot; {formatPercent(job.progressPct)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unscheduled bucket — present but not date-positioned. */}
      <div className="mt-4 rounded-lg border border-dashed border-white/15 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
          <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
          Unscheduled ({UNSCHEDULED_JOBS.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {UNSCHEDULED_JOBS.map((job) => {
            const isPinned = job.id === pinnedId;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => onPin(job.id)}
                aria-pressed={isPinned}
                className={`min-h-6 rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                  isPinned ? "border-cyan-300 bg-cyan-500/10 text-cyan-200" : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                }`}
              >
                <span className="font-medium">{job.code}</span> &middot; {job.site}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
