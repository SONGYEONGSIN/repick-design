"use client";

import { Pin } from "lucide-react";
import {
  REGIONS,
  balanceOf,
  statusOf,
  formatSignedMw,
  STATUS_LABEL,
  type Region,
  type RegionStatus,
} from "./data";
import Badge, { type BadgeTone } from "./components/Badge";
import Sparkline from "./components/Sparkline";
import ProgressBar from "./components/ProgressBar";
import { FOCUS_RING_INSET } from "./components/focus";

const STATUS_TONE: Record<RegionStatus, BadgeTone> = {
  surplus: "emerald",
  balanced: "indigo",
  tight: "amber",
  deficit: "rose",
};

export default function RegionRail({
  pinnedId,
  onPin,
}: {
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  return (
    <section aria-labelledby="regions-heading" className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <h2 id="regions-heading" className="text-sm font-semibold text-zinc-50">
          Balancing regions
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          <span className="tabular-nums">{REGIONS.length}</span> regions tracked &middot; pin one to inspect its snapshot
        </p>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto p-2">
        {REGIONS.map((region) => (
          <RegionRow key={region.id} region={region} pinned={region.id === pinnedId} onPin={() => onPin(region.id)} />
        ))}
      </ul>
    </section>
  );
}

function RegionRow({ region, pinned, onPin }: { region: Region; pinned: boolean; onPin: () => void }) {
  const latest = region.hourly[region.hourly.length - 1];
  const balance = balanceOf(latest);
  const status = statusOf(latest);
  const trend = region.hourly.slice(-12).map((b) => balanceOf(b));

  return (
    <li className="mb-1.5">
      <button
        type="button"
        aria-pressed={pinned}
        onClick={onPin}
        className={`block w-full rounded-lg border px-3 py-2.5 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING_INSET} ${
          pinned ? "border-indigo-400/40 bg-indigo-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {pinned && <Pin aria-hidden="true" className="size-3 shrink-0 text-indigo-300" />}
              <span className="truncate text-sm font-medium text-zinc-100">{region.name}</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-zinc-400">{region.code}</p>
          </div>
          <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold tabular-nums ${balance >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
            {formatSignedMw(balance)}
          </span>
          <Sparkline values={trend} tone={balance >= 0 ? "emerald" : "rose"} />
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Storage SOC</span>
            <span className="tabular-nums">{region.storageSocPct}%</span>
          </div>
          <div className="mt-1">
            <ProgressBar value={region.storageSocPct} tone="indigo" label={`${region.name} storage state of charge`} />
          </div>
        </div>
      </button>
    </li>
  );
}
