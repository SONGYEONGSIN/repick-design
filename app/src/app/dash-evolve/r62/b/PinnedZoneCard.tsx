"use client";

import { Pin, X } from "lucide-react";
import { Card, CardTitle, FOCUS, Progress } from "./ui";
import { ZONE_BY_ID, zoneTotal, fmtUsd, type ZoneId } from "./data";

export function PinnedZoneCard({ zoneId, onClear }: { zoneId: ZoneId | null; onClear: () => void }) {
  if (!zoneId) {
    return (
      <Card className="flex h-full min-h-56 flex-col items-center justify-center text-center">
        <Pin className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-zinc-700">No zone pinned</p>
        <p className="mt-1 max-w-[220px] text-xs font-normal text-zinc-500">
          Select any row in the ranking to pin its breakdown here.
        </p>
      </Card>
    );
  }

  const zone = ZONE_BY_ID.get(zoneId)!;
  const total = zoneTotal(zone);
  const reservedShare = (zone.reserved / total) * 100;

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Pin className="h-4 w-4 flex-shrink-0 text-green-700" aria-hidden="true" />
          <CardTitle className="truncate">{zone.name}</CardTitle>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Unpin zone"
          className={`flex-shrink-0 rounded-md p-1 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 text-xs font-normal text-zinc-500">
        Pinning a zone only updates this card — the ranking and task list stay as they are.
      </p>

      <dl className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-xs font-normal text-zinc-500">On-hand</dt>
          <dd className="text-sm font-medium tabular-nums text-zinc-900">{fmtUsd(zone.onHand)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-xs font-normal text-zinc-500">Reserved</dt>
          <dd className="text-sm font-medium tabular-nums text-zinc-900">{fmtUsd(zone.reserved)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-xs font-normal text-zinc-500">Backordered</dt>
          <dd className="text-sm font-medium tabular-nums text-zinc-900">{fmtUsd(zone.backordered)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-zinc-100 pt-2">
          <dt className="text-xs font-normal text-zinc-600">Total value</dt>
          <dd className="text-sm font-semibold tabular-nums text-zinc-900">{fmtUsd(total)}</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-normal text-zinc-500">Reserved share of value</p>
          <p className="text-xs font-medium tabular-nums text-zinc-700">{reservedShare.toFixed(1)}%</p>
        </div>
        <div className="mt-1.5">
          <Progress value={reservedShare} label={`Reserved share of ${zone.name} value`} />
        </div>
      </div>
    </Card>
  );
}
