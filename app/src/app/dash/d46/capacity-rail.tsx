"use client";

import { AlertTriangle, Users } from "lucide-react";
import { useState } from "react";
import { TECH_STATS, UNASSIGNED_JOBS, WEEKLY_TOTALS, type SelectedKey } from "./data";
import { formatHours, formatPercent } from "./format";
import { ACCENT_FILL, ACCENT_TEXT, BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, TRANSITION_TRANSFORM, cx } from "./tokens";
import { Avatar, Card, CardHeader } from "./ui";

/**
 * Team capacity — the page's secondary chart (horizontal Bar, one row per technician, per
 * charts.catalog "Compare Categories"). Every value (scheduled hours + utilization %) is rendered
 * as always-visible text next to its bar, never hover-only. Doubles as the technician resource rail:
 * clicking a row selects that technician, which the calendar (schedule-week / schedule-day) reads to
 * highlight their slots — this is the "selection syncs multiple widgets" interaction. Hovering or
 * focusing a row also opens a small keyboard-accessible tooltip with the job-count breakdown behind
 * the headline number.
 */
export default function CapacityRail({
  selectedKey,
  onSelectKey,
  className,
}: {
  selectedKey: SelectedKey;
  onSelectKey: (key: SelectedKey) => void;
  className?: string;
}) {
  const [tipKey, setTipKey] = useState<string | null>(null);

  function toggle(key: SelectedKey) {
    onSelectKey(selectedKey === key ? null : key);
  }

  return (
    <Card as="section" ariaLabelledBy="capacity-rail-heading" className={cx("flex flex-col gap-3", className)}>
      <CardHeader
        as="h2"
        titleId="capacity-rail-heading"
        Icon={Users}
        title="Team capacity"
        description={`${WEEKLY_TOTALS.avgUtilizationPct}% avg this week · click to highlight`}
      />

      <ul className="flex flex-col gap-1">
        {TECH_STATS.map(({ tech, scheduledHours, utilizationPct, jobCount, activeCount }) => {
          const selected = selectedKey === tech.id;
          const showTip = tipKey === tech.id;
          return (
            <li key={tech.id} className="relative">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(tech.id)}
                onMouseEnter={() => setTipKey(tech.id)}
                onMouseLeave={() => setTipKey((k) => (k === tech.id ? null : k))}
                onFocus={() => setTipKey(tech.id)}
                onBlur={() => setTipKey((k) => (k === tech.id ? null : k))}
                className={cx(
                  "flex w-full flex-col gap-1.5 rounded-xl border px-2.5 py-2 text-left",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? "border-amber-300 bg-amber-50" : cx(BORDER, "bg-white hover:bg-zinc-50"),
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar avatarId={tech.avatarId} name={tech.name} size={22} />
                  <span className={cx("min-w-0 flex-1 truncate text-[13px] font-medium", TEXT_PRIMARY)}>{tech.name}</span>
                  <span className={cx("shrink-0 text-xs font-semibold", NUM, selected ? ACCENT_TEXT : TEXT_CAPTION)}>{formatPercent(utilizationPct)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className={cx("h-1.5 min-w-0 flex-1 overflow-hidden rounded-full", "bg-zinc-100")} aria-hidden="true">
                    <span
                      className={cx("block h-full rounded-full", ACCENT_FILL, TRANSITION_TRANSFORM)}
                      style={{ width: `${Math.min(100, utilizationPct)}%` }}
                    />
                  </span>
                  <span className={cx("shrink-0 text-[11px]", NUM, TEXT_CAPTION)}>{formatHours(scheduledHours)}</span>
                </span>
              </button>

              {showTip ? (
                <div
                  role="tooltip"
                  className={cx("absolute left-2 right-2 top-full z-30 mt-1 rounded-lg border px-2.5 py-2 text-xs shadow-lg", BORDER, "bg-zinc-900 text-white")}
                >
                  <p className="font-medium">{jobCount} jobs this week</p>
                  <p className="mt-0.5 text-zinc-300">
                    {activeCount > 0 ? `${activeCount} in progress right now` : "None in progress right now"}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        aria-pressed={selectedKey === "unassigned"}
        onClick={() => toggle("unassigned")}
        className={cx(
          "flex w-full items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left",
          TRANSITION,
          FOCUS_RING,
          selectedKey === "unassigned" ? "border-red-300 bg-red-50" : cx(BORDER, "bg-white hover:bg-zinc-50"),
        )}
      >
        <AlertTriangle size={16} aria-hidden="true" className="shrink-0 text-red-600" />
        <span className="min-w-0 flex-1">
          <span className={cx("block text-[13px] font-medium", TEXT_PRIMARY)}>Unassigned</span>
          <span className={cx("block text-[11px]", TEXT_CAPTION_MUTED)}>Needs a technician</span>
        </span>
        <span className={cx("shrink-0 text-sm font-semibold", NUM, "text-red-700")}>{UNASSIGNED_JOBS.length}</span>
      </button>
    </Card>
  );
}
