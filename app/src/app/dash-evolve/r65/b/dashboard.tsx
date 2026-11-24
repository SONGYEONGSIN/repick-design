"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sidebar, type NavKey } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { FeedPanel, type SeverityFilter } from "./feed-panel";
import { HealthPanel } from "./health-panel";
import { ReviewerPanel } from "./reviewer-panel";
import { INITIAL_FEED_ITEMS, SLA_TARGET_MINUTES, type FeedItem } from "./data";

export function Dashboard() {
  const [items, setItems] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey>("queue");
  const [compact, setCompact] = useState(false);

  const healthRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const reviewersRef = useRef<HTMLDivElement>(null);

  const handleAction = useCallback((id: string, status: "approved" | "removed" | "escalated") => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const breachCount = items.filter((i) => i.status === "pending" && i.queueMinutes > SLA_TARGET_MINUTES[i.severity]).length;

  const jumpTo = useCallback((target: "queue" | "health" | "reviewers") => {
    const refMap = { queue: feedRef, health: healthRef, reviewers: reviewersRef };
    refMap[target].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleNavigate = useCallback(
    (key: NavKey) => {
      setActiveNav(key);
      setMobileNavOpen(false);
      if (key === "queue") jumpTo("queue");
      if (key === "insights") jumpTo("health");
      if (key === "reviewers") jumpTo("reviewers");
    },
    [jumpTo]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        activeNav={activeNav}
        onNavigate={handleNavigate}
        compact={compact}
        onToggleCompact={() => setCompact((v) => !v)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          breachCount={breachCount}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <h1 className="sr-only">Harborwatch trust and safety review queue</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:items-start">
              <div className="order-2 min-w-0 lg:order-1" ref={healthRef}>
                <HealthPanel items={items} headingId="health-heading" />
              </div>

              <div className="order-1 min-w-0 lg:order-2" ref={feedRef}>
                <FeedPanel
                  items={items}
                  compact={compact}
                  severityFilter={severityFilter}
                  onSeverityFilterChange={setSeverityFilter}
                  onAction={handleAction}
                />
              </div>

              <div className="order-3 min-w-0" ref={reviewersRef}>
                <ReviewerPanel headingId="reviewer-heading" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSetSeverityFilter={(f) => setSeverityFilter(f)}
          onJumpTo={(target) => jumpTo(target)}
        />
      )}
    </div>
  );
}
