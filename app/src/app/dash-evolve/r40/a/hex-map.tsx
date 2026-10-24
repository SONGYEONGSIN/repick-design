"use client";

import { Pin } from "lucide-react";
import type { Region, RegionStatus } from "./data";
import { STATUS_WORD } from "./data";
import { STATUS_STYLES, FOCUS_RING } from "./ui";
import { formatMs, formatPercent } from "./format";

const STATUS_FILL: Record<RegionStatus, string> = {
  healthy: "bg-green-500",
  degraded: "bg-amber-500",
  critical: "bg-red-500",
  maintenance: "bg-sky-500",
};

const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

function tileLine3(region: Region): string {
  if (region.incidentCount > 0) return `${region.incidentCount} open`;
  if (region.status === "maintenance") return "maint.";
  return "stable";
}

/**
 * The hex-tile choropleth — the page's dominant visualization. Every tile always renders its own
 * uptime % and incident state as plain text (never hover-only, at every state this component has:
 * there is no drill/zoom level here, so that guarantee holds unconditionally). Hover reveals extra
 * detail (full name, cluster, latency) through a pure-CSS tooltip driven by `group-hover` /
 * `group-focus-within` — no React state is involved in showing or hiding it, matching the brief's
 * "non-persistent hover" requirement. Clicking or activating a tile writes to the SAME pin axis the
 * incident feed writes to (`pinnedId` is one piece of state with two entry points), which keeps the
 * tile keyboard-operable without introducing a second, competing selection axis.
 */
export default function HexMap({
  regions,
  pinnedId,
  onPin,
}: {
  regions: Region[];
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const counts = regions.reduce<Record<RegionStatus, number>>(
    (acc, r) => {
      acc[r.status] += 1;
      return acc;
    },
    { healthy: 0, degraded: 0, critical: 0, maintenance: 0 }
  );

  return (
    <div>
      <div className="mx-auto grid w-full max-w-[380px] grid-cols-4 gap-2 sm:gap-3">
        {regions.map((region, i) => {
          const col = i % 4;
          const isPinned = region.id === pinnedId;
          const tooltipAnchor = col === 0 ? "left-0" : col === 3 ? "right-0" : "left-1/2 -translate-x-1/2";
          return (
            <div key={region.id} className="group relative">
              <button
                type="button"
                onClick={() => onPin(region.id)}
                aria-describedby={`tip-${region.id}`}
                className={`relative flex aspect-[0.86] w-full flex-col items-center justify-center gap-0.5 text-zinc-950 motion-safe:transition-transform ${
                  STATUS_FILL[region.status]
                } ${isPinned ? "scale-[1.04]" : ""} ${FOCUS_RING}`}
                style={{ clipPath: HEX_CLIP }}
              >
                <span className="text-[11px] font-semibold leading-none">{region.code}</span>
                <span className="text-[9px] leading-none tabular-nums">{formatPercent(region.uptimePct)}</span>
                <span className="text-[8px] font-medium leading-none tabular-nums">{tileLine3(region)}</span>
                {isPinned ? (
                  <Pin className="absolute top-1.5 right-2 h-2.5 w-2.5" aria-hidden="true" fill="currentColor" />
                ) : null}
                <span className="sr-only"> — {region.name}, {region.cluster}</span>
              </button>
              <div
                id={`tip-${region.id}`}
                role="tooltip"
                className={`pointer-events-none absolute top-full z-30 mt-2 w-44 rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-xs opacity-0 shadow-xl motion-safe:transition-opacity motion-safe:duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${tooltipAnchor}`}
              >
                <p className="font-medium text-zinc-50">{region.name}</p>
                <p className="mt-0.5 text-zinc-400">{region.cluster}</p>
                <p className="mt-1 flex items-center justify-between gap-2 tabular-nums text-zinc-400">
                  <span>Latency</span>
                  <span className="text-zinc-50">{formatMs(region.latencyMs)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Status legend">
        {(Object.keys(counts) as RegionStatus[]).map((status) => {
          const s = STATUS_STYLES[status];
          const Icon = s.icon;
          return (
            <li key={status} className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Icon className={`h-3.5 w-3.5 ${s.text}`} aria-hidden="true" />
              <span className="tabular-nums text-zinc-50">{counts[status]}</span>
              <span>{STATUS_WORD[status]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
