"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ASSIGNEE_BY_ID, DEPARTMENT_BY_ID, FEED_EVENTS, type Priority } from "./data";
import { formatAgo } from "./format";
import { Avatar, FOCUS_RING, PriorityBadge, ReviewedBadge, Tabs } from "./ui";

type FilterTab = "all" | Priority;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "high", label: "High" },
  { id: "normal", label: "Normal" },
];

/** Ephemeral, session-only review marks and filter tab — both local to this
 *  component, never persisted and never read by anything else on the page (in
 *  particular, the chord diagram's own selection state is completely separate
 *  from this). */
export default function RoutingFeed() {
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FilterTab>("all");

  function toggleReviewed(id: string) {
    setReviewed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const visible = filter === "all" ? FEED_EVENTS : FEED_EVENTS.filter((e) => e.priority === filter);

  return (
    <div>
      <Tabs<FilterTab> options={FILTER_TABS} value={filter} onChange={setFilter} ariaLabel="Filter routing feed by priority" />
      {visible.length === 0 ? (
        <p className="py-6 text-center font-normal text-sm text-zinc-500">
          No {filter === "all" ? "" : `${filter} `}handoffs right now.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {visible.map((event) => {
            const from = DEPARTMENT_BY_ID[event.fromId];
            const to = DEPARTMENT_BY_ID[event.toId];
            const agent = ASSIGNEE_BY_ID[event.agentId];
            const isReviewed = Boolean(reviewed[event.id]);
            return (
              <li key={event.id} className="flex flex-wrap items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-normal tabular-nums text-xs text-zinc-500">{event.ticketId}</span>
                    <PriorityBadge priority={event.priority} />
                  </div>
                  <div className="mt-1 flex min-w-0 items-center gap-1.5">
                    <span className="truncate font-medium text-sm text-zinc-900">{from.short}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                    <span className="truncate font-medium text-sm text-zinc-900">{to.short}</span>
                  </div>
                  <p className="mt-1 font-normal text-xs text-zinc-600">{event.note}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Avatar initials={agent.initials} className="h-6 w-6 text-[10px]" />
                    <span className="font-normal text-xs text-zinc-600">{agent.name}</span>
                  </div>
                  <span className="font-normal tabular-nums text-xs text-zinc-500">{formatAgo(event.ageMinutes)}</span>
                  {isReviewed ? (
                    <ReviewedBadge />
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleReviewed(event.id)}
                      className={`rounded-md px-2 py-0.5 font-medium text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 motion-safe:transition-colors ${FOCUS_RING}`}
                    >
                      Mark reviewed
                      <span className="sr-only"> for ticket {event.ticketId}</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
