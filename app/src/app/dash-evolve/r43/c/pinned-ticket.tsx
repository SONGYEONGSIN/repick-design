"use client";

import { Clock, UserRound } from "lucide-react";
import { Avatar, PriorityTag, SentimentBadge, StatusBadge } from "./ui";
import { FEED_ITEMS } from "./data";
import { formatHoursAgo } from "./format";

/** Independently-scoped selection consumer #1: reacts only to `pinnedId` (set from the
 *  feed's pin button). It never reads `selectedTermId` and is never reset by it — the
 *  two selection states on this page live entirely apart. `pinnedId` always resolves to
 *  a real ticket, so this card never renders an empty "select something" placeholder. */
export default function PinnedTicket({ pinnedId }: { pinnedId: string }) {
  const item = FEED_ITEMS.find((t) => t.id === pinnedId) ?? FEED_ITEMS[0];

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-mono font-normal text-xs text-zinc-500">{item.id}</p>
          <p className="mt-0.5 truncate font-semibold text-sm text-zinc-900">{item.subject}</p>
        </div>
        <StatusBadge status={item.status} className="shrink-0" />
      </div>

      <p className="mt-3 font-normal text-sm text-zinc-600">{item.snippet}</p>

      <div className="mt-4 flex items-center gap-2">
        <Avatar initials={item.initials} className="h-7 w-7 text-xs" />
        <div className="min-w-0">
          <p className="truncate font-medium text-sm text-zinc-900">{item.customer}</p>
          <p className="truncate font-normal text-xs text-zinc-500">reported {formatHoursAgo(item.hoursAgo)}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-3">
        <div>
          <dt className="flex items-center gap-1 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
            <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
            Priority
          </dt>
          <dd className="mt-1">
            <PriorityTag priority={item.priority} />
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
            <UserRound className="h-3 w-3 shrink-0" aria-hidden="true" />
            Assigned to
          </dt>
          <dd className="mt-1 font-normal text-sm tabular-nums text-zinc-700">{item.assigneeInitials}</dd>
        </div>
      </dl>

      <div className="mt-3">
        <SentimentBadge sentiment={item.sentiment} />
      </div>
    </div>
  );
}
