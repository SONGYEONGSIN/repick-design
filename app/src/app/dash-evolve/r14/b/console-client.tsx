"use client";

import { useCallback, useEffect, useState } from "react";
import ActivityFeed from "./activity-feed";
import BulletGrid from "./bullet-grid";
import CommandPalette from "./command-palette";
import { BRAND, BULLET_KPIS, FEED_INITIAL, FEED_LATER, TIME_RANGES } from "./data";
import ReviewerTable from "./reviewer-table";
import Sidebar from "./sidebar";
import { AtAGlanceCard, QueueTrendCard } from "./side-panel";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import Topbar from "./topbar";
import { SegmentedControl } from "./ui";
import type { FeedEvent, QueueFilterValue, TimeRange } from "./types";

export default function ConsoleClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [queueFilter, setQueueFilter] = useState<QueueFilterValue>("all");
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>(FEED_INITIAL);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loadedMore, setLoadedMore] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLoadMore = useCallback(() => {
    setFeedEvents((prev) => [...FEED_LATER, ...prev]);
    setNewIds(new Set(FEED_LATER.map((e) => e.id)));
    setLoadedMore(true);
  }, []);

  const handleEntranceEnd = useCallback((id: string) => {
    setNewIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
      >
        Skip to main content
      </a>

      <div className="flex">
        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

          <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Moderation operations</h1>
                <p className={cx("mt-1 max-w-xl text-sm", TEXT_CAPTION)}>
                  {BRAND.name} · {BRAND.tagline} for Nimbus Social.
                </p>
              </div>
              <SegmentedControl ariaLabel="Time range" options={TIME_RANGES.map((r) => ({ id: r.id, label: r.label }))} value={timeRange} onChange={setTimeRange} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="order-2 min-w-0 lg:order-1 lg:col-span-3">
                <BulletGrid kpis={BULLET_KPIS} range={timeRange} highlightQueue={queueFilter} />
              </div>

              <div className="order-1 min-w-0 lg:order-2 lg:col-span-6">
                <ActivityFeed
                  events={feedEvents}
                  queueFilter={queueFilter}
                  onQueueFilter={setQueueFilter}
                  newIds={newIds}
                  onEntranceEnd={handleEntranceEnd}
                  canLoadMore={!loadedMore}
                  onLoadMore={handleLoadMore}
                />
              </div>

              <div className="order-3 flex min-w-0 flex-col gap-6 lg:col-span-3">
                <AtAGlanceCard events={feedEvents} />
                <QueueTrendCard />
              </div>
            </div>

            <div className="mt-6">
              <ReviewerTable highlightQueue={queueFilter} />
            </div>
          </main>
        </div>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
    </div>
  );
}
