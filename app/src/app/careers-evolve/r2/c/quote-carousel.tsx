"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { FOCUS_RING, QUOTES } from "./data";

/**
 * First wired interaction: a team-quote carousel with explicit Prev/Next buttons and a Play/Pause
 * toggle (no autoplay the visitor can't stop). Starts paused when prefers-reduced-motion is set.
 * aria-live="polite" announces quote changes without interrupting a screen reader mid-sentence.
 */
export default function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const current = QUOTES[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + QUOTES.length) % QUOTES.length);
  }

  return (
    <div>
      <div aria-live="polite" className="min-h-[11rem] rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
        <p className="text-xs font-normal tabular-nums uppercase tracking-[0.14em] text-zinc-600">
          {index + 1} of {QUOTES.length}
        </p>
        <p className="mt-3 max-w-xl text-lg font-normal leading-relaxed text-zinc-800">&ldquo;{current.body}&rdquo;</p>
        <p className="mt-4 text-sm font-semibold text-zinc-900">
          {current.name} <span className="font-normal text-zinc-600">— {current.role}</span>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous quote"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-green-700 hover:text-green-800 ${FOCUS_RING}`}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next quote"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-green-700 hover:text-green-800 ${FOCUS_RING}`}
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3.5 py-1.5 text-sm font-semibold text-zinc-700 hover:border-green-700 hover:text-green-800 ${FOCUS_RING}`}
        >
          {playing ? <Pause aria-hidden="true" className="h-3.5 w-3.5" /> : <Play aria-hidden="true" className="h-3.5 w-3.5" />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
