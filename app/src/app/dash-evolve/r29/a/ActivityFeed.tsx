"use client";

import { Radio } from "lucide-react";
import { Card, SectionLabel } from "./ui";
import { ACTIVITY_FEED, ACTIVITY_ICON, ACTIVITY_TONE, formatRelative } from "./data";

/**
 * Desk-wide activity feed. Deliberately NOT scoped to the pinned lot — it stays
 * constant no matter what you pin in the watchlist, so the trader always has a
 * whole-desk view alongside the lot-specific detail above it.
 */
export function ActivityFeed() {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4 sm:px-5">
        <Radio aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
        <SectionLabel as="h2">Desk activity</SectionLabel>
      </div>
      <p className="px-4 pt-1 text-xs font-normal text-zinc-400 sm:px-5">
        Every lot on the desk, not just the one you&rsquo;ve pinned &mdash; this list never changes when you pin a row.
      </p>
      <ul className="mt-3 max-h-[420px] divide-y divide-white/5 overflow-y-auto">
        {ACTIVITY_FEED.map((ev) => {
          const Icon = ACTIVITY_ICON[ev.type];
          return (
            <li key={ev.id} className="px-4 py-3 sm:px-5">
              <div className="flex items-start gap-2.5">
                <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${ACTIVITY_TONE[ev.type]}`} />
                <div className="min-w-0">
                  <p className="text-xs font-normal text-zinc-200">{ev.description}</p>
                  <p className="mt-0.5 truncate text-[11px] font-normal text-zinc-400">
                    {ev.lotCode} &middot; {ev.lotTitle}
                  </p>
                  <p className="mt-1 text-[11px] font-normal text-zinc-400">{formatRelative(ev.at)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
