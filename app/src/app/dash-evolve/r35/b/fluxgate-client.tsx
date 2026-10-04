"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./command-palette";
import EventLog from "./event-log";
import Sidebar from "./sidebar";
import StatStrip from "./stat-strip";
import StreamingChart from "./streaming-chart";
import Topbar from "./topbar";
import { DEFAULT_REGION, DEFAULT_WINDOW, SERIES_LENGTH, type RegionId } from "./data";
import { APP_BG, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card, Eyebrow } from "./ui";

export default function FluxgateClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Streaming-chart state. Lives here (not inside StreamingChart) because the hero KPI in
  // StatStrip must read the exact same live tick/region as the chart, without the two
  // widgets being wired through any shared "selection" concept.
  const [region, setRegion] = useState<RegionId>(DEFAULT_REGION);
  const [windowSeconds, setWindowSeconds] = useState<number>(DEFAULT_WINDOW);
  const [isPlaying, setIsPlaying] = useState(true);
  // `tick` is a deterministic counter, never Math.random or Date.now — it only indexes into
  // the fixed, precomputed buffers in data.ts. Starting at the end of the buffer renders a
  // fully "settled" frame before the first interval tick ever fires.
  const [tick, setTick] = useState(SERIES_LENGTH - 1);
  const [cursorIndex, setCursorIndex] = useState(windowSeconds - 1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setPrefersReducedMotion(e.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The one piece of continuous motion on this page. Pausing (or a reduced-motion
  // preference) really stops it — the interval is never created, not just hidden.
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setTick((t) => (t + 1) % SERIES_LENGTH);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, prefersReducedMotion]);

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

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
      >
        Skip to main content
      </a>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>Fluxgate Edge Platform</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-grotesk)" }}>
                Live Traffic
              </h1>
            </div>
            <p className={cx("max-w-sm text-xs font-normal leading-relaxed", TEXT_AUX)}>
              Edge gateway request throughput across the fleet, updated once per second from a fixed, looping buffer.
            </p>
          </div>

          <div className="mt-4">
            <StatStrip region={region} tick={tick} />
          </div>

          <div className="mt-5">
            <Card>
              <StreamingChart
                region={region}
                onRegionChange={setRegion}
                windowSeconds={windowSeconds}
                onWindowSecondsChange={(s) => {
                  setWindowSeconds(s);
                  setCursorIndex(s - 1);
                }}
                tick={tick}
                isPlaying={isPlaying}
                onTogglePlaying={() => setIsPlaying((p) => !p)}
                cursorIndex={cursorIndex}
                onCursorIndexChange={setCursorIndex}
                prefersReducedMotion={prefersReducedMotion}
              />
            </Card>
          </div>

          <div className="mt-5">
            <Card>
              <EventLog />
            </Card>
          </div>

          <p className={cx("mt-6 text-center text-[11px] font-normal", TEXT_AUX)}>
            Demo data for illustration only. The stream above replays a fixed, deterministic buffer and does not reflect live infrastructure.
          </p>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
    </div>
  );
}
