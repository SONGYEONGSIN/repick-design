"use client";

import { Card } from "./ui";
import { OPEN_COUNT, OPEN_COUNT_LAST, INVESTIGATING_COUNT, CRITICAL_COUNT, MTTA_MINUTES, MTTA_MINUTES_LAST } from "./data";
import type { Incident } from "./data";

export function KpiRow({ pinned }: { pinned: Incident | null }) {
  const mttaDelta = Math.round((MTTA_MINUTES - MTTA_MINUTES_LAST) * 10) / 10;
  const openDelta = OPEN_COUNT - OPEN_COUNT_LAST;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Open incidents</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
          {OPEN_COUNT}
        </p>
        <p className={`mt-1 text-xs font-normal tabular-nums ${openDelta <= 0 ? "text-emerald-700" : "text-rose-700"}`}>
          {openDelta > 0 ? `+${openDelta}` : openDelta} vs last hour
        </p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Investigating</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
          {INVESTIGATING_COUNT}
        </p>
        <p className="mt-1 text-xs font-normal text-zinc-600">actively being worked</p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Critical (24h)</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
          {CRITICAL_COUNT}
        </p>
        <p className="mt-1 text-xs font-normal text-zinc-600">of 10 total incidents</p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {pinned ? "Pinned incident" : "Mean time to ack"}
        </p>
        {pinned ? (
          <>
            <p className="mt-1.5 truncate font-[family-name:var(--font-display-grotesk)] text-lg font-semibold text-zinc-900">
              {pinned.id}
            </p>
            <p className="mt-1 truncate text-xs font-normal text-zinc-600">{pinned.title}</p>
          </>
        ) : (
          <>
            <p className="mt-1.5 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
              {MTTA_MINUTES}m
            </p>
            <p className="mt-1 text-xs font-normal tabular-nums text-emerald-700">{mttaDelta}m vs last window</p>
          </>
        )}
      </Card>
    </div>
  );
}
