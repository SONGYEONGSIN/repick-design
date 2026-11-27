"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, FileWarning } from "lucide-react";
import { SIGNALS, CATEGORIES, type Category, type Window, anomalyCount, casesFor, isCurrentlyElevated } from "./data";
import { Sidebar, MobileDrawer } from "./sidebar";
import Topbar from "./topbar";
import CommandPalette from "./command-palette";
import SignalPanel from "./signal-panel";
import { FOCUS_RING, SegmentedControl, cx } from "./ui";

type CategoryFilter = Category | "all";

const DEFAULT_PINNED = SIGNALS.reduce((worst, s) => (anomalyCount(s) > anomalyCount(worst) ? s : worst), SIGNALS[0]).id;

export default function TripwireConsole() {
  const [windowDays, setWindowDays] = useState<Window>(30);
  // `categoryFilter` and `pinnedId` are two independently-scoped selection axes: the filter
  // narrows which panels appear in the wall, the pin controls which panel is expanded in place.
  // Neither reads nor writes the other's state, and the filter never resets the pin.
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [pinnedId, setPinnedId] = useState<string | null>(DEFAULT_PINNED);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = paletteOpen || drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen, drawerOpen]);

  // The pinned signal stays visible in the wall even when it doesn't match the current category
  // filter, so the persistent detail view is never silently orphaned by an unrelated control.
  const visibleSignals = useMemo(
    () => SIGNALS.filter((s) => categoryFilter === "all" || s.category === categoryFilter || s.id === pinnedId),
    [categoryFilter, pinnedId]
  );

  const elevatedCount = useMemo(() => SIGNALS.filter(isCurrentlyElevated).length, []);
  const openCaseCount = useMemo(() => SIGNALS.reduce((sum, s) => sum + casesFor(s).length, 0), []);

  return (
    <div className="flex min-h-dvh w-full bg-zinc-50 font-sans text-zinc-900">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenDrawer={() => setDrawerOpen(true)} />

        <main className="flex flex-1 flex-col gap-5 p-4 lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1
                className="text-[22px] font-semibold tracking-tight text-zinc-900"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                Fraud &amp; dispute watch
              </h1>
              <p className="mt-1 max-w-xl text-[13px] text-zinc-600">
                Ten trust &amp; safety signals across payments, listings, logistics and account security, refreshed daily. Click a panel to pin its full history and root cause.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] text-zinc-600">
                <AlertTriangle aria-hidden className="h-3.5 w-3.5 text-rose-600" />
                <span className="font-semibold tabular-nums text-zinc-900">{elevatedCount}</span>
                of {SIGNALS.length} signals elevated
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] text-zinc-600">
                <FileWarning aria-hidden className="h-3.5 w-3.5 text-zinc-500" />
                <span className="font-semibold tabular-nums text-zinc-900">{openCaseCount}</span>
                open cases
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="category-filter" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                className={cx(
                  "h-8 rounded-lg border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50",
                  FOCUS_RING
                )}
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <SegmentedControl
              label="Trailing window shown in the wall"
              value={String(windowDays) as "7" | "30" | "90"}
              onChange={(v) => setWindowDays(Number(v) as Window)}
              options={[
                { value: "7", label: "7d" },
                { value: "30", label: "30d" },
                { value: "90", label: "90d" },
              ]}
            />
          </div>

          <h2 className="sr-only">Signal wall</h2>
          <div className="grid grid-flow-row-dense grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleSignals.map((signal) => {
              const pinned = signal.id === pinnedId;
              return (
                <div key={signal.id} className={cx("min-w-0", pinned && "sm:col-span-2")}>
                  <SignalPanel
                    signal={signal}
                    windowDays={windowDays}
                    isPinned={pinned}
                    onPin={setPinnedId}
                    onClose={() => setPinnedId(null)}
                  />
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        signals={SIGNALS}
        onClose={() => setPaletteOpen(false)}
        onSelect={(id) => {
          setCategoryFilter("all");
          setPinnedId(id);
        }}
      />
    </div>
  );
}
