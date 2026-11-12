"use client";

import { useState } from "react";
import { FilePlus2, UserPlus, ArrowUpCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { Card, CardHeader } from "./Card";
import { SegmentedControl } from "./SegmentedControl";
import { FEED_EVENTS, FEED_TIME_FORMATTER, type FeedEventType } from "./data";

const FILTERS: { value: FeedEventType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "created", label: "Created" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
];

const EVENT_META: Record<FeedEventType, { icon: typeof FilePlus2; tone: string; verb: string }> = {
  created: { icon: FilePlus2, tone: "text-sky-400", verb: "Created" },
  assigned: { icon: UserPlus, tone: "text-slate-300", verb: "Assigned" },
  escalated: { icon: ArrowUpCircle, tone: "text-red-400", verb: "Escalated" },
  resolved: { icon: CheckCircle2, tone: "text-green-400", verb: "Resolved" },
  reopened: { icon: RotateCcw, tone: "text-amber-400", verb: "Reopened" },
};

// Deliberately NOT wired to the box plot's pinned team (see BoxPlotCard.tsx). A dashboard where
// every widget mirrors one shared `selectedId` is a disguised master-detail page; this feed stays
// an independent, always-global stream so the two interactions read as genuinely separate.
export function TicketFeedCard() {
  const [filter, setFilter] = useState<FeedEventType | "all">("all");
  const events = filter === "all" ? FEED_EVENTS : FEED_EVENTS.filter((e) => e.type === filter);

  return (
    <Card>
      <CardHeader
        title="Ticket activity"
        description="Live-style stream of ticket events across every team, independent of the chart above."
        action={<SegmentedControl label="Filter activity feed" value={filter} onChange={setFilter} options={FILTERS} />}
      />
      <ul id="activity-feed" className="max-h-80 min-w-0 space-y-1 overflow-y-auto pr-1">
        {events.map((event) => {
          const meta = EVENT_META[event.type];
          return (
            <li key={event.id} className="flex min-w-0 items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
              <meta.icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${meta.tone}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-normal text-slate-200">
                  <span className="font-medium text-slate-100">{event.actor}</span> {event.detail}
                </p>
                <p className="mt-0.5 text-xs font-normal text-slate-400">
                  {event.team} · {FEED_TIME_FORMATTER.format(new Date(event.at))}
                </p>
              </div>
              <span className={`flex-shrink-0 text-xs font-medium ${meta.tone}`}>{meta.verb}</span>
            </li>
          );
        })}
        {events.length === 0 ? <li className="px-2 py-6 text-center text-sm font-normal text-slate-400">No events for this filter.</li> : null}
      </ul>
    </Card>
  );
}
