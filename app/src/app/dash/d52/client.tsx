"use client";

import { useCallback, useEffect, useState } from "react";
import { WATCHLIST, type PeriodId } from "./data";
import { IconRail } from "./IconRail";
import { TopBar } from "./TopBar";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { WatchlistRail } from "./WatchlistRail";
import { CenterTerminal } from "./CenterTerminal";
import { CompFeedPanel } from "./CompFeedPanel";
import { CommandPalette } from "./CommandPalette";
import { Card } from "./ui/Card";

const DEFAULT_ID = WATCHLIST[0].id;

export default function FloorlineTerminal() {
  // `activeId` drives the chart + summary stat strip — cheap, purely local recomputation, so a
  // watchlist click (or a command-palette pick) updates it immediately.
  const [activeId, setActiveId] = useState(DEFAULT_ID);
  // `pinnedFeedId` drives the right-hand comp feed. It intentionally does NOT follow `activeId`
  // automatically: refreshing live comp listings is treated as the expensive operation here, so the
  // feed only moves when the analyst explicitly presses "Pin comps to …" in CompFeedPanel. Until
  // then it keeps showing whichever item was last pinned, even while the chart has moved on.
  const [pinnedFeedId, setPinnedFeedId] = useState(DEFAULT_ID);
  const [period, setPeriod] = useState<PeriodId>("90d");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  const handleSelect = useCallback((id: string) => setActiveId(id), []);
  const handlePinFeed = useCallback(() => setPinnedFeedId(activeId), [activeId]);

  const activeItem = WATCHLIST.find((i) => i.id === activeId) ?? WATCHLIST[0];
  const pinnedItem = WATCHLIST.find((i) => i.id === pinnedFeedId) ?? WATCHLIST[0];

  return (
    <div className="flex min-h-dvh w-full flex-col bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex w-full min-w-0 max-w-[2560px] flex-1 flex-col lg:flex-row">
        <IconRail />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onOpenPalette={() => setPaletteOpen(true)} onOpenDrawer={() => setDrawerOpen(true)} />

          {/* `<main>` 랜드마크. 없으면 axe 의 `landmark-one-main` 이 실패한다 — 게이트는 a11y 98 로
              통과시켰지만(하드페일 목록 밖) 실제 결함이라 승격 시 해소했다(2026-09-01 §3-1). */}
          <main id="main-content" className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-6 lg:h-[calc(100dvh-4rem)] lg:flex-row lg:overflow-hidden">
            <Card padded={false} className="h-80 w-full min-w-0 shrink-0 lg:h-full lg:w-[300px]">
              <WatchlistRail activeId={activeId} pinnedFeedId={pinnedFeedId} onSelect={handleSelect} />
            </Card>

            <div className="min-h-[26rem] min-w-0 flex-1 lg:h-full">
              <CenterTerminal item={activeItem} period={period} onPeriodChange={setPeriod} />
            </div>

            <Card padded={false} className="h-[30rem] w-full min-w-0 shrink-0 lg:h-full lg:w-[360px]">
              <CompFeedPanel activeItem={activeItem} pinnedItem={pinnedItem} onPin={handlePinFeed} />
            </Card>
          </main>
        </div>
      </div>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={handleSelect} />

      <p className="sr-only" aria-live="polite">
        {`Showing ${activeItem.name} on the chart. Comp feed pinned to ${pinnedItem.name}.`}
      </p>
    </div>
  );
}

