"use client";

import { Card, CardTitle, FOCUS } from "./ui";
import { ZONES, MAX_ZONE_TOTAL, zoneTotal, fmtUsd, fmtUsdCompact, type ZoneId } from "./data";

// Below this share of the row's own width, the on-hand value would overflow its segment, so the
// label is omitted rather than clipped or spilled — the one zone this applies to (Overflow) is the
// smallest bar in the set, which is exactly where the fallback should trigger.
const LABEL_THRESHOLD = 0.12;

export function RankedBarChart({
  hoveredZoneId,
  onHover,
  pinnedZoneId,
  onTogglePin,
}: {
  hoveredZoneId: ZoneId | null;
  onHover: (id: ZoneId | null) => void;
  pinnedZoneId: ZoneId | null;
  onTogglePin: (id: ZoneId) => void;
}) {
  return (
    <Card className="h-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>Inventory value by zone</CardTitle>
          <p className="mt-0.5 text-xs font-normal text-zinc-500">Ranked by total value — on-hand, reserved, and backordered</p>
        </div>
        <ul className="flex flex-shrink-0 flex-wrap items-center gap-3" aria-label="Legend">
          <li className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-700" aria-hidden="true" />
            On-hand
          </li>
          <li className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-zinc-400" aria-hidden="true" />
            Reserved
          </li>
          <li className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
            Backordered
          </li>
        </ul>
      </div>

      <ul className="mt-4 min-w-0 space-y-1.5">
        {ZONES.map((zone) => {
          const total = zoneTotal(zone);
          const barPct = (total / MAX_ZONE_TOTAL) * 100;
          const onHandPct = (zone.onHand / total) * 100;
          const reservedPct = (zone.reserved / total) * 100;
          const backorderedPct = (zone.backordered / total) * 100;
          const overallOnHandFraction = (barPct / 100) * (onHandPct / 100);
          const showOnHandLabel = overallOnHandFraction >= LABEL_THRESHOLD;

          const isPinned = pinnedZoneId === zone.id;
          const isActive = hoveredZoneId === zone.id;
          const detailId = `zone-detail-${zone.id}`;

          return (
            <li key={zone.id}>
              <button
                type="button"
                onMouseEnter={() => onHover(zone.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(zone.id)}
                onBlur={() => onHover(null)}
                onClick={() => onTogglePin(zone.id)}
                aria-pressed={isPinned}
                aria-describedby={isActive ? detailId : undefined}
                className={`w-full min-w-0 rounded-lg p-2 text-left transition-colors ${FOCUS} ${
                  isPinned ? "bg-green-50/70 ring-1 ring-inset ring-green-600" : isActive ? "bg-zinc-50" : ""
                }`}
              >
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium text-zinc-900">{zone.name}</span>
                  <span className="flex-shrink-0 text-sm font-semibold tabular-nums text-zinc-900">{fmtUsd(total)}</span>
                </div>
                <div className="mt-2 h-8 w-full min-w-0 overflow-hidden rounded-md bg-zinc-100">
                  <div className="flex h-full" style={{ width: `${barPct.toFixed(2)}%` }}>
                    <div
                      className="flex h-full flex-shrink-0 items-center overflow-hidden bg-green-700 pl-2"
                      style={{ width: `${onHandPct.toFixed(2)}%` }}
                    >
                      {showOnHandLabel && (
                        <span className="truncate text-[11px] font-semibold text-white">{fmtUsdCompact(zone.onHand)}</span>
                      )}
                    </div>
                    <div className="h-full flex-shrink-0 bg-zinc-400" style={{ width: `${reservedPct.toFixed(2)}%` }} />
                    <div className="h-full flex-shrink-0 bg-amber-500" style={{ width: `${backorderedPct.toFixed(2)}%` }} />
                  </div>
                </div>
              </button>
              {isActive && (
                <p id={detailId} className="mt-1 px-2 text-xs font-normal text-zinc-500">
                  On-hand {fmtUsd(zone.onHand)} · Reserved {fmtUsd(zone.reserved)} · Backordered {fmtUsd(zone.backordered)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
