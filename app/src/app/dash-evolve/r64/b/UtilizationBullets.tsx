"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  BULLET_SCALE_MAX, getAllUtilizations, getJobsForTech, formatHours, formatClock, pctFmt,
  type TechUtilization,
} from "./data";
import { Card, NUM, SectionLabel, IconButton, DISPLAY_FACE } from "./ui";

/** The next job on a technician's board that isn't done or cancelled yet — purely a read of
 *  `JOBS`, never a second hand-typed fact, so the hover note can never say something the board
 *  itself disagrees with. */
function nextJobNote(util: TechUtilization): string {
  const upcoming = getJobsForTech(util.tech.id).find((job) => job.status === "scheduled" || job.status === "in_progress");
  if (!upcoming) return "No more jobs queued today.";
  const verb = upcoming.status === "in_progress" ? "On site now" : "Next up";
  return `${verb}: ${upcoming.title} at ${formatClock(upcoming.start)}`;
}

function BulletRow({ util }: { util: TechUtilization }) {
  // Ephemeral, local-only inspector state — hover or focus on this row's own info control reveals
  // an extra note inline. Nothing here reaches outside this component: it does not touch
  // `pinnedTechId` or any other shared state, and the persistent value/target text below never
  // depends on it (it is visible unconditionally, hover or not).
  const [expanded, setExpanded] = useState(false);
  const { tech, assignedMin, utilization } = util;
  const valuePct = Math.min(100, (assignedMin / BULLET_SCALE_MAX) * 100);
  const targetPct = Math.min(100, (tech.capacityMin / BULLET_SCALE_MAX) * 100);
  const nearPct = Math.min(100, (tech.capacityMin * 1.25 / BULLET_SCALE_MAX) * 100);
  const over = utilization > 1;

  return (
    <li className="min-w-0 py-2.5">
      {/* `flex-wrap` + the track's `basis-full` puts the track on its own full-width line below
          390px, where a fixed name column + fixed value column would otherwise squeeze it to a
          few illegible pixels. At `sm:` and up every piece returns to one row (basis reset,
          `sm:flex-nowrap`), matching the original single-row bullet layout. */}
      <div className="flex min-w-0 flex-wrap items-center gap-2 gap-y-1.5 sm:flex-nowrap sm:gap-3">
        <div className="min-w-0 shrink-0 sm:w-44">
          <span className="block truncate text-sm font-medium text-zinc-900">{tech.name}</span>
          <span className="block truncate text-xs text-zinc-500">{tech.role}</span>
        </div>

        {/* Persistent, always-visible value + target text — never hover-only. */}
        <div className={`ml-auto shrink-0 whitespace-nowrap text-right text-sm font-medium sm:order-3 sm:ml-0 sm:w-36 ${NUM} ${over ? "text-green-800" : "text-zinc-900"}`}>
          {formatHours(assignedMin)} <span className="text-zinc-500">/</span> {formatHours(tech.capacityMin)}
          <span className="ml-1.5 text-xs text-zinc-500">{pctFmt.format(utilization)}</span>
        </div>

        <IconButton
          aria-label={`Show next job for ${tech.name}`}
          aria-expanded={expanded}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onFocus={() => setExpanded(true)}
          onBlur={() => setExpanded(false)}
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 sm:order-4"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </IconButton>

        <div className="relative order-last h-6 min-w-0 basis-full rounded-sm bg-zinc-100 sm:order-2 sm:basis-0 sm:flex-1" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 rounded-sm bg-zinc-200" style={{ width: `${nearPct}%` }} />
          <div
            className={`absolute inset-y-0 left-0 rounded-sm ${over ? "bg-green-700" : "bg-green-600"}`}
            style={{ width: `${valuePct}%` }}
          />
          <div className="absolute -top-0.5 -bottom-0.5 w-[2px] bg-zinc-900" style={{ left: `${targetPct}%` }} />
        </div>
      </div>
      {expanded ? (
        <p className="mt-1.5 text-xs text-zinc-600" role="status">
          {nextJobNote(util)}
        </p>
      ) : null}
    </li>
  );
}

export function UtilizationBullets() {
  const rows = getAllUtilizations();

  return (
    <Card>
      <SectionLabel className="mb-1">Team utilization — today</SectionLabel>
      <h2 className="mb-3 text-lg font-semibold text-zinc-900 sm:text-xl" style={DISPLAY_FACE}>
        Crew capacity vs. target
      </h2>
      <ul className="flex min-w-0 flex-col divide-y divide-zinc-100">
        {rows.map((util) => (
          <BulletRow key={util.tech.id} util={util} />
        ))}
      </ul>
      <div aria-hidden="true" className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-green-600" />
          Assigned minutes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-[2px] bg-zinc-900" />
          Daily capacity target
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-zinc-200" />
          Overtime band
        </span>
      </div>
    </Card>
  );
}
