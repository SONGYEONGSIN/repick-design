"use client";

import { useEffect, useRef, useState } from "react";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { DEFAULT_END, DEFAULT_START, clampIndex, windowLabel, windowStats } from "./data";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

const ANNOUNCE_MS = 4000;

export default function Page() {
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [announcement, setAnnouncement] = useState("");
  const [justChanged, setJustChanged] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stats = windowStats(start, end);

  function handleWindowChange(nextStart: number, nextEnd: number) {
    const s = clampIndex(Math.min(nextStart, nextEnd));
    const e = clampIndex(Math.max(nextStart, nextEnd));
    setStart(s);
    setEnd(e);

    const nextStats = windowStats(s, e);
    const trendPhrase =
      nextStats.deltaPct === null
        ? "not enough history yet for a prior-window comparison"
        : nextStats.deltaPct === 0
          ? "flat versus the prior window"
          : `${nextStats.deltaPct > 0 ? "up" : "down"} ${Math.abs(nextStats.deltaPct)}% versus the prior window`;
    setAnnouncement(`${windowLabel(s, e)}: average ${nextStats.avgDays} days to sell, ${trendPhrase}.`);
    setJustChanged(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setJustChanged(false);
      setAnnouncement("");
    }, ANNOUNCE_MS);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#09090B]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#09090B] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-[#E4E4E7] px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-[#09090B]">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#trend" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-[#09090B] ${FOCUS_RING} rounded-sm`}>
              The window
            </a>
            <a href="#preview" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-[#09090B] ${FOCUS_RING} rounded-sm`}>
              Current listings
            </a>
          </nav>
          <a
            href="#trend"
            className={`rounded-full bg-[#059669] px-4 py-2 text-sm font-semibold text-[#09090B] transition-colors duration-200 hover:opacity-90 ${FOCUS_RING}`}
          >
            Try the window
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero start={start} end={end} stats={stats} onWindowChange={handleWindowChange} />
        <ProductPreview start={start} end={end} stats={stats} />
        <ValueSplit start={start} end={end} stats={stats} />
        <SocialProof />
        <ClosingCTA start={start} end={end} stats={stats} />
      </main>

      <footer className="border-t border-[#E4E4E7] px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1280px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Buy used, priced for the window you pick.</span>
          <span>Trend figures are historical averages — repick doesn&rsquo;t guarantee any specific listing will match them.</span>
        </div>
      </footer>

      {/* The one aria-live region on this page. role="alert" is added only for the few seconds right
          after a window change, then both the role and the text reset so a screen reader never
          re-reads stale content on an unrelated page update. */}
      <div aria-live="polite" role={justChanged ? "alert" : undefined} className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
