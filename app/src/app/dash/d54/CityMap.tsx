"use client";

import { Pin, X } from "lucide-react";
import { HUB_NAME, ROUTES, ZONES, ZONE_STATS } from "./data";
import {
  BORDER,
  FOCUS,
  STATUS_DOT,
  STATUS_FILL,
  STATUS_LABEL,
  STATUS_STROKE,
  STATUS_TEXT,
  SURFACE_INSET,
  TEXT_AUX,
  TEXT_PRIMARY,
  TRANSITION_T,
  cx,
  r2,
  type RouteStatus,
} from "./tokens";
import { Badge, Segmented } from "./ui";

export type MapLayer = "routes" | "load";

const VB_W = 600;
const VB_H = 520;
const HUB = { x: 300, y: 240 };
const R_HUB = 20;
const R_OUTER = 230;

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: r2(HUB.x + r * Math.cos(rad)), y: r2(HUB.y - r * Math.sin(rad)) };
}

const LAYER_OPTIONS: { id: MapLayer; label: string }[] = [
  { id: "routes", label: "Live routes" },
  { id: "load", label: "Zone load" },
];

export default function CityMap({
  layer,
  onLayerChange,
  pinnedRouteId,
  hoveredRouteId,
  onHoverRoute,
  onLeaveRoute,
  onTogglePin,
}: {
  layer: MapLayer;
  onLayerChange: (l: MapLayer) => void;
  pinnedRouteId: string | null;
  hoveredRouteId: string | null;
  onHoverRoute: (id: string) => void;
  onLeaveRoute: () => void;
  onTogglePin: (id: string) => void;
}) {
  const pinned = pinnedRouteId ? ROUTES.find((r) => r.id === pinnedRouteId) ?? null : null;
  const hovered = hoveredRouteId ? ROUTES.find((r) => r.id === hoveredRouteId) ?? null : null;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>Dispatch map</h2>
            {pinned ? (
              <span className={cx("ml-1 inline-flex items-center gap-1 rounded-full border py-0.5 pl-2 pr-1 text-[11px] font-medium", BORDER, "border-blue-400/30 bg-blue-400/10 text-blue-300")}>
                <Pin size={11} aria-hidden="true" />
                Pinned {pinned.id}
                <button
                  type="button"
                  onClick={() => onTogglePin(pinned.id)}
                  className={cx("ml-0.5 grid h-4 w-4 place-items-center rounded-full hover:bg-blue-400/20", FOCUS)}
                >
                  <X size={10} aria-hidden="true" />
                  <span className="sr-only">Unpin {pinned.id}</span>
                </button>
              </span>
            ) : null}
          </div>
          <p className={cx("mt-1 max-w-md text-xs font-normal leading-relaxed", TEXT_AUX)}>
            Every marker is a van&rsquo;s last position on its route out of {HUB_NAME}. Hover to inspect, click to pin.
          </p>
        </div>
        <Segmented options={LAYER_OPTIONS} value={layer} onChange={onLayerChange} ariaLabel="Map layer" />
      </div>

      <figure className="relative mt-3 w-full">
        <div className="relative aspect-[600/520] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            {ZONES.map((z) => {
              const stat = ZONE_STATS.find((s) => s.id === z.id)!;
              const p1 = polar(z.angleDeg - 30, R_OUTER);
              const p2 = polar(z.angleDeg + 30, R_OUTER);
              const label = polar(z.angleDeg, R_OUTER * 0.68);
              const loadOpacity = layer === "load" ? 0.1 + (stat.loadPct / 100) * 0.5 : 0.03;
              return (
                <g key={z.id}>
                  <path
                    d={`M ${HUB.x} ${HUB.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`}
                    className="fill-blue-400 stroke-white/10"
                    style={{ opacity: r2(loadOpacity) }}
                    strokeWidth={1}
                  />
                  <text x={label.x} y={label.y} textAnchor="middle" className="fill-zinc-400 text-[10px] font-medium uppercase tracking-wide">
                    {z.name}
                  </text>
                  {layer === "load" ? (
                    <text x={label.x} y={label.y + 14} textAnchor="middle" className="fill-zinc-300 text-[11px] font-semibold [font-feature-settings:'tnum']">
                      {stat.loadPct}%
                    </text>
                  ) : null}
                </g>
              );
            })}

            {layer === "routes"
              ? ROUTES.map((route) => {
                  const zone = ZONES.find((z) => z.id === route.zoneId)!;
                  const angle = zone.angleDeg + route.angleOffsetDeg;
                  const outer = polar(angle, R_OUTER);
                  const vanR = r2(R_HUB + (route.progressPct / 100) * (R_OUTER - R_HUB));
                  const van = polar(angle, vanR);
                  const dimmed = pinnedRouteId !== null && pinnedRouteId !== route.id;
                  const emphasized = pinnedRouteId === route.id || hoveredRouteId === route.id;
                  const strokeW = emphasized ? 2.5 : 1.5;

                  return (
                    <g key={route.id} style={{ opacity: dimmed ? 0.28 : 1 }}>
                      <line x1={HUB.x} y1={HUB.y} x2={van.x} y2={van.y} className={STATUS_STROKE[route.status]} strokeWidth={strokeW} strokeLinecap="round" />
                      {route.progressPct < 100 ? (
                        <line x1={van.x} y1={van.y} x2={outer.x} y2={outer.y} className="stroke-zinc-600" strokeWidth={1} strokeDasharray="3 3" />
                      ) : null}
                      {Array.from({ length: route.stopsTotal }, (_, i) => i + 1).map((i) => {
                        const t = i / route.stopsTotal;
                        const tickR = r2(R_HUB + t * (R_OUTER - R_HUB));
                        const tick = polar(angle, tickR);
                        const done = i <= route.stopsDone;
                        return <circle key={i} cx={tick.x} cy={tick.y} r={done ? 2.4 : 1.8} className={done ? STATUS_FILL[route.status] : "fill-none stroke-zinc-600"} strokeWidth={done ? 0 : 1} />;
                      })}
                      <circle cx={van.x} cy={van.y} r={emphasized ? 7 : 5.5} className={STATUS_FILL[route.status]} stroke="#09090b" strokeWidth={1.5} />
                    </g>
                  );
                })
              : null}

            <circle cx={HUB.x} cy={HUB.y} r={R_HUB} className="fill-zinc-800 stroke-blue-400" strokeWidth={2} />
            <circle cx={HUB.x} cy={HUB.y} r={6} className="fill-blue-400" />
            <text x={HUB.x} y={HUB.y + R_HUB + 14} textAnchor="middle" className="fill-zinc-300 text-[10px] font-semibold uppercase tracking-wide">
              Hub
            </text>
          </svg>

          {layer === "routes"
            ? ROUTES.map((route) => {
                const zone = ZONES.find((z) => z.id === route.zoneId)!;
                const angle = zone.angleDeg + route.angleOffsetDeg;
                const vanR = r2(R_HUB + (route.progressPct / 100) * (R_OUTER - R_HUB));
                const van = polar(angle, vanR);
                const leftPct = r2((van.x / VB_W) * 100);
                const topPct = r2((van.y / VB_H) * 100);
                return (
                  <button
                    key={route.id}
                    type="button"
                    onMouseEnter={() => onHoverRoute(route.id)}
                    onMouseLeave={onLeaveRoute}
                    onFocus={() => onHoverRoute(route.id)}
                    onBlur={onLeaveRoute}
                    onClick={() => onTogglePin(route.id)}
                    aria-pressed={pinnedRouteId === route.id}
                    aria-label={`${route.id}, ${zone.name} route, ${STATUS_LABEL[route.status]}, driver ${route.driver}, ETA ${route.etaLabel}. Press to ${pinnedRouteId === route.id ? "unpin" : "pin"}.`}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className={cx("absolute z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full hover:bg-white/10", TRANSITION_T, "hover:scale-110", FOCUS)}
                  />
                );
              })
            : null}
        </div>
        <figcaption className={cx("mt-1.5 text-[11px] font-normal", TEXT_AUX)}>Stylized zone layout, radial distance from the hub — not a literal map.</figcaption>
      </figure>

      <div aria-live="polite" className={cx("mt-3 min-h-[60px] rounded-xl border p-3", BORDER, SURFACE_INSET)}>
        {hovered ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{hovered.id}</span>
            <span className={cx("text-xs font-medium", STATUS_TEXT[hovered.status])}>{STATUS_LABEL[hovered.status]}</span>
            <span className={cx("text-xs font-normal", TEXT_AUX)}>{hovered.driver}</span>
            <span className={cx("text-xs font-normal", TEXT_AUX)}>
              {hovered.stopsDone}/{hovered.stopsTotal} stops
            </span>
            <span className={cx("text-xs font-normal", TEXT_AUX)}>ETA {hovered.etaLabel}</span>
          </div>
        ) : (
          <p className={cx("text-xs font-normal", TEXT_AUX)}>Hover or tab to a van marker to inspect its route here — this panel clears the moment you look away.</p>
        )}
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {(["on-time", "at-risk", "delayed", "completed"] as RouteStatus[]).map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cx("h-2 w-2 rounded-full", STATUS_DOT[s])} />
            <span className={cx("text-[11px] font-medium", TEXT_AUX)}>{STATUS_LABEL[s]}</span>
          </li>
        ))}
        <li>
          <Badge>Solid = traveled · dashed = remaining</Badge>
        </li>
      </ul>
    </div>
  );
}
