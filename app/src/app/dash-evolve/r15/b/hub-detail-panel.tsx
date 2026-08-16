"use client";

import { Clock3, Package, Waypoints } from "lucide-react";
import { CORRIDOR_LABEL, HUB_BY_ID, STATUS_LABEL, TOTAL_VOLUME, connectedHubIds, fmtVolume, onTimeForPeriod, statusForOnTime } from "./data";
import type { PeriodId } from "./types";
import { ACCENT_TEXT, BORDER, FOCUS_VISIBLE, NUM, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";
import { Badge, CapacityBar, EyebrowLabel } from "./ui";

/**
 * The map-node-click → detail-panel half of the selection sync (the other half is the trend chart's
 * overlay line). Every stat here is derived from the same `HUBS` records the map and table read, so
 * the three widgets can never disagree.
 */
export default function HubDetailPanel({ hubId, period, onSelectHub }: { hubId: string; period: PeriodId; onSelectHub: (id: string) => void }) {
  const hub = HUB_BY_ID[hubId];
  const onTime = onTimeForPeriod(hub, period);
  const status = statusForOnTime(onTime);
  const tone = TONE[STATUS_TONE[status]];
  const share = (hub.volume / TOTAL_VOLUME) * 100;
  const connections = connectedHubIds(hub.id).map((id) => HUB_BY_ID[id]);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <EyebrowLabel>{CORRIDOR_LABEL[hub.corridor]}</EyebrowLabel>
          <h3 className={cx("mt-0.5 truncate text-lg font-semibold", TEXT_PRIMARY)}>{hub.name}</h3>
          <p className={cx("text-xs", TEXT_CAPTION, NUM)}>Hub {hub.code}</p>
        </div>
        <Badge tone={tone}>{STATUS_LABEL[status]}</Badge>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={cx("text-4xl font-semibold", NUM, TEXT_PRIMARY)}>{onTime.toFixed(1)}%</span>
        <span className={cx("text-xs", TEXT_CAPTION)}>on time</span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className={cx("rounded-lg border p-2.5", BORDER, "bg-white/[0.03]")}>
          <dt className={cx("flex items-center gap-1.5 text-[11px]", TEXT_CAPTION)}>
            <Package size={12} aria-hidden="true" />
            Daily volume
          </dt>
          <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>
            {fmtVolume(hub.volume)} <span className={cx("text-[11px] font-normal", TEXT_CAPTION)}>({share.toFixed(1)}% of network)</span>
          </dd>
        </div>
        <div className={cx("rounded-lg border p-2.5", BORDER, "bg-white/[0.03]")}>
          <dt className={cx("flex items-center gap-1.5 text-[11px]", TEXT_CAPTION)}>
            <Clock3 size={12} aria-hidden="true" />
            Avg transit
          </dt>
          <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{hub.transitHours.toFixed(1)} hrs</dd>
        </div>
      </dl>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <p className={cx("text-[11px]", TEXT_CAPTION)}>Capacity in use</p>
          <p className={cx("text-[11px] font-medium", NUM, TEXT_PRIMARY)}>{hub.capacityPct}%</p>
        </div>
        <div className="mt-1.5">
          <CapacityBar pct={hub.capacityPct} />
        </div>
      </div>

      <div className="mt-4">
        <p className={cx("mb-1.5 flex items-center gap-1.5 text-[11px]", TEXT_CAPTION)}>
          <Waypoints size={12} aria-hidden="true" />
          Connected hubs ({connections.length})
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {connections.map((c) => {
            const cOnTime = onTimeForPeriod(c, period);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelectHub(c.id)}
                  className={cx("rounded-full border px-2.5 py-1 text-xs font-medium", BORDER, "bg-white/[0.03] hover:bg-white/[0.08]", TRANSITION, FOCUS_VISIBLE, TEXT_PRIMARY)}
                >
                  {c.code} <span className={cx(NUM, TEXT_CAPTION)}>{cOnTime.toFixed(0)}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className={cx("mt-4 text-[11px]", ACCENT_TEXT)}>Selecting a hub also highlights its lanes on the map and overlays its trend below.</p>
    </div>
  );
}
