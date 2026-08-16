"use client";

import { useState } from "react";
import { CORRIDOR_LABEL, HUBS, LANES, STATUS_LABEL, bubbleRadius, laneTouchesHub, onTimeForPeriod, statusForOnTime } from "./data";
import type { Hub, PeriodId, Status } from "./types";
import { NUM, STATUS_SVG, STATUS_TONE, TEXT_CAPTION, TONE, cx } from "./tokens";
import { Badge } from "./ui";

const VB_W = 1000;
const VB_H = 460;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Gentle quadratic control point for a lane, offset perpendicular to the straight segment so
 *  overlapping backbone lanes stay visually distinct. Pure arithmetic on fixed hub coordinates, so
 *  it is identical on server and client — rounded to 2dp per the SVG-coordinate convention. */
function laneControl(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = -dy / len;
  const uy = dx / len;
  const bow = len * 0.05;
  return { cx: round2((x1 + x2) / 2 + ux * bow), cy: round2((y1 + y2) / 2 + uy * bow) };
}

const STATUS_ORDER: Status[] = ["on-track", "at-risk", "delayed"];

export default function NetworkMap({
  period,
  selectedHubId,
  onSelectHub,
}: {
  period: PeriodId;
  selectedHubId: string;
  onSelectHub: (id: string) => void;
}) {
  const [focusedHubId, setFocusedHubId] = useState<string | null>(null);

  function activate(hub: Hub) {
    onSelectHub(hub.id);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className={cx("text-xs", TEXT_CAPTION)}>Bubble size = average daily volume · ring color = on-time status. Select a hub for its full readout.</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_ORDER.map((s) => (
            <Badge key={s} tone={TONE[STATUS_TONE[s]]}>
              {STATUS_LABEL[s]}
            </Badge>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto [scrollbar-width:thin] lg:overflow-visible">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-label={`Schematic map of ${HUBS.length} regional hubs across the west, central, and east corridors, connected by ${LANES.length} lanes. Each hub shows its code and current on-time percentage.`}
          className="h-auto w-full min-w-[760px] lg:min-w-0"
        >
          <defs>
            <pattern id="tv-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className="fill-white/[0.06]" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#tv-grid)" />

          {LANES.map(([aId, bId], i) => {
            const a = HUBS.find((h) => h.id === aId)!;
            const b = HUBS.find((h) => h.id === bId)!;
            const { cx: ccx, cy: ccy } = laneControl(a.x, a.y, b.x, b.y);
            const touched = laneTouchesHub([aId, bId], selectedHubId);
            return (
              <path
                key={i}
                d={`M ${a.x},${a.y} Q ${ccx},${ccy} ${b.x},${b.y}`}
                fill="none"
                className={touched ? "stroke-cyan-400" : "stroke-white/15"}
                strokeWidth={touched ? 2.5 : 1.25}
                strokeLinecap="round"
              />
            );
          })}

          {HUBS.map((hub) => {
            const onTime = onTimeForPeriod(hub, period);
            const status = statusForOnTime(onTime);
            const svgTone = STATUS_SVG[status];
            const r = bubbleRadius(hub.volume);
            const selected = hub.id === selectedHubId;
            const focused = hub.id === focusedHubId;

            return (
              <g key={hub.id}>
                {selected ? <circle cx={hub.x} cy={hub.y} r={r + 7} fill="none" className="stroke-cyan-400" strokeWidth={2} strokeDasharray="4 3" /> : null}
                {focused ? <circle cx={hub.x} cy={hub.y} r={r + 4} fill="none" className="stroke-zinc-50" strokeWidth={2} /> : null}

                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={r}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected}
                  aria-label={`${hub.name} hub, code ${hub.code}, ${CORRIDOR_LABEL[hub.corridor]}, ${onTime.toFixed(1)} percent on time, ${hub.volume.toLocaleString("en-US")} parcels per day, status ${STATUS_LABEL[status]}${selected ? ", selected" : ""}`}
                  onClick={() => activate(hub)}
                  onFocus={() => setFocusedHubId(hub.id)}
                  onBlur={() => setFocusedHubId((cur) => (cur === hub.id ? null : cur))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activate(hub);
                    }
                  }}
                  className={cx("cursor-pointer outline-none", svgTone.fill, svgTone.stroke)}
                  strokeWidth={selected ? 2.5 : 1.5}
                />

                <text x={hub.x} y={round2(hub.y - r - 9)} textAnchor="middle" className="fill-zinc-50 pointer-events-none select-none" style={{ fontSize: 13, fontWeight: 600 }}>
                  {hub.code}
                </text>
                <text
                  x={hub.x}
                  y={round2(hub.y + r + 17)}
                  textAnchor="middle"
                  className={cx("pointer-events-none select-none", NUM, status === "on-track" ? "fill-emerald-300" : status === "at-risk" ? "fill-amber-300" : "fill-rose-300")}
                  style={{ fontSize: 11, fontWeight: 500 }}
                >
                  {onTime.toFixed(1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
