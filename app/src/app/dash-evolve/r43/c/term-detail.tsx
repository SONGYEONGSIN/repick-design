"use client";

import { MessageSquare } from "lucide-react";
import { DeltaIndicator, SentimentBadge, Sparkline } from "./ui";
import { FEED_ITEMS, TERM_BY_ID, TOTAL_MENTIONS, getTermTrend, TERMS, type Period } from "./data";
import { formatCount, formatSharePct } from "./format";

/** Independently-scoped selection consumer #2: reacts only to `selectedTermId` (set by
 *  the word cloud or the ranked list) and `period` (the global period toggle). It never
 *  reads or writes the feed's pin state, and the feed's pin never resets this panel. */
export default function TermDetail({ selectedTermId, period }: { selectedTermId: string; period: Period }) {
  const term = TERM_BY_ID[selectedTermId];
  const termIndex = TERMS.findIndex((t) => t.id === selectedTermId);
  const trend = getTermTrend(term, termIndex, period);
  const delta = trend[trend.length - 1] - trend[0];
  const matchingItems = FEED_ITEMS.filter((item) => item.themeIds.includes(selectedTermId));
  const pct = formatSharePct(term.count, TOTAL_MENTIONS);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm text-zinc-900">{term.label}</p>
          <p className="mt-0.5 font-normal text-xs text-zinc-500">Selected theme · updates independently of the pinned ticket</p>
        </div>
        <SentimentBadge sentiment={term.sentiment} className="shrink-0" />
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-semibold tabular-nums text-2xl text-zinc-900">{formatCount(term.count)}</p>
          <p className="mt-0.5 font-normal text-xs text-zinc-500">mentions · {pct} of all feedback</p>
        </div>
        <Sparkline values={trend} stroke={term.sentiment === "negative" ? "stroke-rose-700" : term.sentiment === "positive" ? "stroke-emerald-700" : "stroke-zinc-500"} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <DeltaIndicator delta={delta} goodDirection="up" />
        <span className="font-normal text-xs text-zinc-500">sentiment score over the last {period === "7d" ? "7 days" : period === "30d" ? "30 days" : "90 days"}</span>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
        <p className="flex items-center gap-1.5 font-medium text-xs text-zinc-700">
          <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Mentioned in {matchingItems.length} feed {matchingItems.length === 1 ? "ticket" : "tickets"}
        </p>
        <ul className="mt-2 space-y-1.5">
          {matchingItems.slice(0, 3).map((item) => (
            <li key={item.id} className="truncate font-normal text-xs text-zinc-600">
              <span className="font-medium text-zinc-900">{item.customer}</span> — {item.subject}
            </li>
          ))}
          {matchingItems.length === 0 ? <li className="font-normal text-xs text-zinc-500">No tickets in the current feed sample mention this theme yet.</li> : null}
        </ul>
      </div>
    </div>
  );
}
