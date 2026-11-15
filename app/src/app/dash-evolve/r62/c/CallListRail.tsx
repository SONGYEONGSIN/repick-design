"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import type { Call, Sentiment } from "./data";
import { CALLS, formatCompactUSD, repById } from "./data";
import { FOCUS, ScoreBadge, SegmentedControl } from "./ui";

export type SentimentFilter = Sentiment | "all";
export type SortMode = "recent" | "score";

const SENTIMENT_OPTIONS: { value: SentimentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "at-risk", label: "At risk" },
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "recent", label: "Recent" },
  { value: "score", label: "Score" },
];

/**
 * The fixed-width list rail. Its only effect outside itself is `onSelect`, which feeds the
 * Spotlight header card in the detail pane — never the Coaching Digest body (see
 * ClearcallClient's comment on `pinnedId`). Search, sentiment filter and sort are entirely local
 * to this rail and never touch the digest's own period toggle.
 */
export function CallListRail({
  query,
  onQueryChange,
  sentimentFilter,
  onSentimentFilterChange,
  sortMode,
  onSortModeChange,
  pinnedId,
  onSelect,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  sentimentFilter: SentimentFilter;
  onSentimentFilterChange: (v: SentimentFilter) => void;
  sortMode: SortMode;
  onSortModeChange: (v: SortMode) => void;
  pinnedId: string | null;
  onSelect: (call: Call) => void;
}) {
  const needle = query.trim().toLowerCase();
  const filtered = CALLS.filter((c) => {
    const matchesQuery =
      needle === "" || c.title.toLowerCase().includes(needle) || c.account.toLowerCase().includes(needle);
    const matchesSentiment = sentimentFilter === "all" || c.sentiment === sentimentFilter;
    return matchesQuery && matchesSentiment;
  });
  const rows = sortMode === "score" ? [...filtered].sort((a, b) => b.score - a.score) : filtered;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="shrink-0 border-b border-white/10 p-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-sm font-semibold text-zinc-50">Calls</h1>
          <span className="shrink-0 font-mono text-xs font-normal tabular-nums text-zinc-400">
            {rows.length} of {CALLS.length}
          </span>
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search account or title"
            aria-label="Search calls by account or title"
            className={`${FOCUS} h-9 w-full min-w-0 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm font-normal text-zinc-50 placeholder:text-zinc-400`}
          />
        </div>

        <div className="mt-3">
          <SegmentedControl
            label="Filter calls by sentiment"
            options={SENTIMENT_OPTIONS}
            value={sentimentFilter}
            onChange={onSentimentFilterChange}
          />
        </div>

        <div className="mt-2">
          <SegmentedControl label="Sort calls" options={SORT_OPTIONS} value={sortMode} onChange={onSortModeChange} />
        </div>
      </div>

      <ul aria-label="Call list" className="min-w-0 flex-1 space-y-1 overflow-y-auto p-2">
        {rows.map((call) => {
          const rep = repById(call.repId);
          const pinned = call.id === pinnedId;
          return (
            <li key={call.id}>
              <button
                type="button"
                aria-pressed={pinned}
                onClick={() => onSelect(call)}
                className={`${FOCUS} flex w-full min-w-0 flex-col items-start gap-1.5 rounded-xl border-l-2 px-3 py-2.5 text-left transition-colors ${
                  pinned ? "border-sky-400 bg-sky-400/10" : "border-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex w-full min-w-0 items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-50">{call.title}</span>
                  <ScoreBadge score={call.score} />
                </div>
                <div className="flex w-full min-w-0 items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-normal text-zinc-400">{call.account}</span>
                  <span className="shrink-0 whitespace-nowrap text-xs font-normal text-zinc-400">{call.date}</span>
                </div>
                {rep && (
                  <div className="flex w-full min-w-0 items-center gap-1.5">
                    <Image
                      src={`https://images.unsplash.com/photo-${rep.avatarId}`}
                      alt={`Portrait of ${rep.name}`}
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0 rounded-full object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate text-xs font-normal text-zinc-400">
                      {rep.name.split(" ")[0]}
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-mono text-xs font-normal tabular-nums text-zinc-300">
                      {formatCompactUSD(call.dealValue)}
                    </span>
                  </div>
                )}
              </button>
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="px-3 py-8 text-center text-sm font-normal text-zinc-400">No calls match your filters.</li>
        )}
      </ul>
    </div>
  );
}
