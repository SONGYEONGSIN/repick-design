"use client";

import {
  HORIZONTAL_ROADS,
  RING_ROAD_POINTS,
  ROAD_X_MAX,
  ROAD_X_MIN,
  ROAD_Y_MAX,
  ROAD_Y_MIN,
  VERTICAL_ROADS,
  ZONES,
  type Vehicle,
  type ZoneId,
} from "./data";
import { VEHICLE_STATUS_META } from "./status-meta";
import { cn, FOCUS_RING } from "./cn";

const MAP_W = 1000;
const MAP_H = 600;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function toPercentLeft(x: number): number {
  return round2((x / MAP_W) * 100);
}

function toPercentTop(y: number): number {
  return round2((y / MAP_H) * 100);
}

export interface Selection {
  type: "vehicle" | "delivery";
  id: string;
}

export function MapPanel({
  vehicles,
  activeZone,
  selection,
  onSelectVehicle,
}: {
  vehicles: Vehicle[];
  activeZone: ZoneId | "all";
  selection: Selection | null;
  onSelectVehicle: (id: string) => void;
}) {
  const selectedVehicleId = selection?.type === "vehicle" ? selection.id : null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative aspect-[5/3] w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Live map of vehicle positions across five delivery zones"
          className="absolute inset-0 h-full w-full"
        >
          <rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#09090b" />

          {ZONES.map((zone) => {
            const dimmed = activeZone !== "all" && activeZone !== zone.id;
            return (
              <g key={zone.id}>
                <polygon
                  points={zone.points}
                  fill={dimmed ? "rgba(255,255,255,0.015)" : "rgba(34,211,238,0.045)"}
                  stroke={dimmed ? "rgba(255,255,255,0.06)" : "rgba(34,211,238,0.25)"}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <text
                  x={zone.labelX}
                  y={zone.labelY}
                  fill={dimmed ? "rgba(161,161,170,0.55)" : "#a1a1aa"}
                  fontSize={13}
                  fontWeight={600}
                  letterSpacing="0.04em"
                  style={{ textTransform: "uppercase" }}
                >
                  {zone.code}
                </text>
              </g>
            );
          })}

          {VERTICAL_ROADS.map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1={ROAD_Y_MIN}
              x2={x}
              y2={ROAD_Y_MAX}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={2}
            />
          ))}
          {HORIZONTAL_ROADS.map((y) => (
            <line
              key={`h-${y}`}
              x1={ROAD_X_MIN}
              y1={y}
              x2={ROAD_X_MAX}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={2}
            />
          ))}
          <polyline
            points={RING_ROAD_POINTS}
            fill="none"
            stroke="rgba(34,211,238,0.22)"
            strokeWidth={3}
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
        </svg>

        {vehicles.map((vehicle) => {
          const meta = VEHICLE_STATUS_META[vehicle.status];
          const Icon = meta.icon;
          const selected = selectedVehicleId === vehicle.id;
          return (
            <button
              key={vehicle.id}
              type="button"
              aria-pressed={selected}
              aria-label={`${vehicle.id} · ${vehicle.driver} · ${meta.label} · ${
                ZONES.find((z) => z.id === vehicle.zoneId)?.name ?? ""
              }`}
              onClick={() => onSelectVehicle(vehicle.id)}
              style={{ left: `${toPercentLeft(vehicle.x)}%`, top: `${toPercentTop(vehicle.y)}%` }}
              className={cn(
                FOCUS_RING,
                "group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2 text-zinc-950 shadow-sm shadow-black/40",
                  meta.dot,
                  selected ? "border-zinc-50" : "border-zinc-950/70",
                  meta.pulse && "motion-safe:animate-pulse",
                )}
              >
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
              {selected ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -m-1.5 rounded-full ring-2 ring-cyan-300"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 shadow-lg group-hover:block group-focus-visible:block"
              >
                {vehicle.id} · {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-400">
        {Object.entries(VEHICLE_STATUS_META).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <li key={key} className="flex items-center gap-1.5">
              <span className={cn("flex size-4 items-center justify-center rounded-full text-zinc-950", meta.dot)}>
                <Icon aria-hidden="true" className="size-2.5" />
              </span>
              {meta.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
