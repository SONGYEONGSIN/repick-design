"use client";

import { ArrowUpCircle, Ban, CheckCircle2, CircleDashed, RefreshCw, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { QUEUE_META, QUEUE_ORDER, SEVERITY_RANK, STATUS_LABEL } from "./data";
import { BORDER, DISPLAY, DIVIDE, FOCUS, NUM, SEVERITY_TONE, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, Card, CardHeader, FilterPill, SeverityLabel } from "./ui";
import type { FeedEvent, FeedStatus, QueueFilterValue, SortMode } from "./types";

const STATUS_ICON: Record<FeedStatus, LucideIcon> = {
  approved: CheckCircle2,
  removed: Ban,
  escalated: ArrowUpCircle,
  unassigned: CircleDashed,
  reinstated: RotateCcw,
  overridden: RefreshCw,
};

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "severity", label: "Severity" },
];

function FeedItem({ event, isNew, onEntranceEnd }: { event: FeedEvent; isNew: boolean; onEntranceEnd: (id: string) => void }) {
  const StatusIcon = STATUS_ICON[event.status];
  const QueueIcon = QUEUE_META[event.queue].Icon;

  return (
    <li
      onAnimationEnd={() => isNew && onEntranceEnd(event.id)}
      className={cx("flex gap-3 px-4 py-3.5 sm:px-5", isNew && "motion-safe:animate-[rampart-feed-in_360ms_ease-out]")}
    >
      <span aria-hidden="true" className={cx("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", "bg-white/[0.06]", TEXT_CAPTION)}>
        <QueueIcon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>{event.title}</p>
          <span className={cx("shrink-0 text-xs", TEXT_CAPTION, NUM)} style={DISPLAY}>
            {event.time}
          </span>
        </div>
        <p className={cx("mt-0.5 text-[13px] leading-snug", TEXT_CAPTION)}>{event.detail}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Badge tone={badgeToneFor(event.status)} Icon={StatusIcon}>
            {STATUS_LABEL[event.status]}
          </Badge>
          <SeverityLabel severity={event.severity} toneMap={SEVERITY_TONE} />
          <span className={cx("text-xs", TEXT_CAPTION)}>
            {QUEUE_META[event.queue].label} queue · {event.actor}
          </span>
        </div>
      </div>
    </li>
  );
}

function badgeToneFor(status: FeedStatus) {
  const tone = STATUS_TONE[status];
  if (tone === "bad") return { text: "text-rose-300", bg: "bg-rose-500/12", border: "border-rose-500/25" };
  if (tone === "warn") return { text: "text-amber-300", bg: "bg-amber-500/12", border: "border-amber-500/25" };
  if (tone === "good") return { text: "text-emerald-300", bg: "bg-emerald-500/12", border: "border-emerald-500/25" };
  return { text: "text-zinc-300", bg: "bg-white/[0.06]", border: "border-white/10" };
}

export default function ActivityFeed({
  events,
  queueFilter,
  onQueueFilter,
  newIds,
  onEntranceEnd,
  canLoadMore,
  onLoadMore,
}: {
  events: FeedEvent[];
  queueFilter: QueueFilterValue;
  onQueueFilter: (v: QueueFilterValue) => void;
  newIds: Set<string>;
  onEntranceEnd: (id: string) => void;
  canLoadMore: boolean;
  onLoadMore: () => void;
}) {
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const filtered = useMemo(() => (queueFilter === "all" ? events : events.filter((e) => e.queue === queueFilter)), [events, queueFilter]);

  const sorted = useMemo(() => {
    if (sortMode === "newest") return filtered;
    return [...filtered].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
  }, [filtered, sortMode]);

  return (
    <Card id="activity-feed" padded={false} className="scroll-mt-20">
      {/* Entrance keyframe for deterministically-revealed "newer" events — motion-safe gated below,
          the resting state (no class) always renders fully opaque so no-JS/first-paint never shows
          opacity:0. */}
      <style>{`@keyframes rampart-feed-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div className="p-4 pb-0 sm:p-5 sm:pb-0">
        <CardHeader
          titleId="activity-feed-title"
          title="Live activity"
          description={`${filtered.length} action${filtered.length === 1 ? "" : "s"} in view · updated through ${events[0]?.time ?? "—"}`}
          action={
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} aria-hidden="true" className={TEXT_CAPTION} />
              <div role="radiogroup" aria-label="Sort activity feed" className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-950 p-0.5">
                {SORT_OPTIONS.map((opt) => {
                  const active = opt.id === sortMode;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSortMode(opt.id)}
                      className={cx(
                        "h-8 rounded-md px-2.5 text-xs font-medium",
                        TRANSITION,
                        FOCUS,
                        active ? "bg-zinc-800 text-zinc-50 font-semibold" : cx(TEXT_CAPTION, "hover:text-zinc-100"),
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          }
        />

        <div role="radiogroup" aria-label="Filter by queue" className="mt-3.5 flex flex-wrap gap-1.5">
          <FilterPill active={queueFilter === "all"} onClick={() => onQueueFilter("all")}>
            All queues
          </FilterPill>
          {QUEUE_ORDER.map((q) => {
            const Icon = QUEUE_META[q].Icon;
            return (
              <FilterPill key={q} active={queueFilter === q} onClick={() => onQueueFilter(q)}>
                <Icon size={13} aria-hidden="true" />
                {QUEUE_META[q].label}
              </FilterPill>
            );
          })}
        </div>
      </div>

      <ul aria-labelledby="activity-feed-title" className={cx("mt-4 max-h-[560px] divide-y overflow-y-auto [scrollbar-width:thin]", DIVIDE)}>
        {sorted.length === 0 ? (
          <li className={cx("px-4 py-8 text-center text-sm sm:px-5", TEXT_CAPTION)}>No activity for this queue in the current view.</li>
        ) : (
          sorted.map((event) => <FeedItem key={event.id} event={event} isNew={newIds.has(event.id)} onEntranceEnd={onEntranceEnd} />)
        )}
      </ul>

      <div className={cx("border-t p-3 text-center", BORDER)}>
        <button
          type="button"
          disabled={!canLoadMore}
          onClick={onLoadMore}
          className={cx(
            "h-9 rounded-lg px-4 text-xs font-medium",
            TRANSITION,
            FOCUS,
            canLoadMore ? cx("border border-white/10 text-zinc-100 hover:bg-white/5") : cx("border border-transparent", TEXT_CAPTION, "cursor-not-allowed"),
          )}
        >
          {canLoadMore ? "Load 3 newer events" : "You're caught up"}
        </button>
      </div>
    </Card>
  );
}
