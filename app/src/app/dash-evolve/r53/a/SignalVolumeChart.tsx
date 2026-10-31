"use client";

// The dominant visualization on this page. Per the at-a-glance legibility bar, every bar's total is
// printed above it at all times — hover/focus only adds the low/medium/high breakdown, it never
// reveals a number that wasn't already visible. Severity is encoded by color AND by a fill pattern
// (diagonal hatch for high, cross-hatch for medium, flat for low) so the series never depend on
// color alone.

import { useState, type CSSProperties } from "react";
import { Card, CardHeader, SegmentedControl, TierBadge, FOCUS_RING } from "./ui";
import { DAILY_VOLUME, type DailyVolume } from "./data";

type Range = "7d" | "14d";

const SEGMENT_STYLE: Record<"high" | "medium" | "low", CSSProperties> = {
  high: {
    backgroundColor: "rgba(239,68,68,0.85)",
    backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 2px, transparent 2px, transparent 6px)",
  },
  medium: {
    backgroundColor: "rgba(245,158,11,0.75)",
    backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 2px, transparent 2px, transparent 6px)",
  },
  low: {
    backgroundColor: "rgb(82,82,91)",
  },
};

export function SignalVolumeChart() {
  const [range, setRange] = useState<Range>("14d");
  // This hover/focus state is intentionally local and never lifted to the parent: it is axis B of
  // the selection-fanout, a self-contained ephemeral preview that the feed table and the Case
  // Inspector (axis A, driven by row selection) never read from or write to.
  const [hovered, setHovered] = useState<number | null>(null);

  const days = range === "7d" ? DAILY_VOLUME.slice(7) : DAILY_VOLUME;
  const maxTotal = Math.max(...DAILY_VOLUME.map((d) => d.total));

  function setHover(day: number | null) {
    setHovered(day);
  }

  return (
    <Card>
      <CardHeader
        title="Signal volume"
        subtitle={`${days.length}-day view, by severity`}
        action={
          <SegmentedControl
            ariaLabel="Chart time range"
            value={range}
            onChange={setRange}
            options={[
              { value: "7d", label: "7D" },
              { value: "14d", label: "14D" },
            ]}
          />
        }
      />

      <div className="flex h-56 items-end gap-1.5 sm:gap-2">
        {days.map((d: DailyVolume) => {
          const barPct = maxTotal > 0 ? (d.total / maxTotal) * 100 : 0;
          const isHovered = hovered === d.day;
          return (
            <div key={d.day} className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              {isHovered ? (
                <div className="absolute bottom-full z-10 mb-2 w-36 rounded-lg border border-white/10 bg-zinc-800 p-2.5 text-left shadow-xl">
                  <p className="text-[11px] font-semibold text-zinc-50">{d.label}</p>
                  <dl className="mt-1.5 space-y-0.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <dt className="text-zinc-400">High</dt>
                      <dd className="tabular-nums text-zinc-200">{d.high}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-zinc-400">Medium</dt>
                      <dd className="tabular-nums text-zinc-200">{d.medium}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-zinc-400">Low</dt>
                      <dd className="tabular-nums text-zinc-200">{d.low}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}

              <span className="mb-1 text-[11px] font-medium tabular-nums text-zinc-400">{d.total}</span>

              <button
                type="button"
                onMouseEnter={() => setHover(d.day)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(d.day)}
                onBlur={() => setHover(null)}
                aria-label={`${d.label}: ${d.total} signals total — ${d.high} high, ${d.medium} medium, ${d.low} low`}
                className={`w-full rounded-sm ${FOCUS_RING}`}
                style={{ height: `${Math.max(barPct, 4)}%` }}
              >
                <div className="flex h-full w-full flex-col overflow-hidden rounded-sm">
                  {d.high > 0 ? <div style={{ ...SEGMENT_STYLE.high, height: `${(d.high / d.total) * 100}%` }} /> : null}
                  {d.medium > 0 ? <div style={{ ...SEGMENT_STYLE.medium, height: `${(d.medium / d.total) * 100}%` }} /> : null}
                  {d.low > 0 ? <div style={{ ...SEGMENT_STYLE.low, height: `${(d.low / d.total) * 100}%` }} /> : null}
                </div>
              </button>

              <span className="mt-1.5 whitespace-nowrap text-[10px] text-zinc-400">{d.label.replace("Oct ", "")}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
        <span className="text-[11px] uppercase tracking-wide text-zinc-400">Severity</span>
        <TierBadge tier="high" />
        <TierBadge tier="medium" />
        <TierBadge tier="low" />
      </div>
    </Card>
  );
}
