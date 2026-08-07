"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { FOCUS_RING, PILLARS } from "./data";

/**
 * Third wired interaction: a culture-pillar carousel with explicit Prev/Next buttons and a
 * Play/Pause toggle (no autoplay the visitor can't stop). Starts paused when
 * prefers-reduced-motion is set, and the current pillar's title/body is always fully rendered
 * (never clipped behind a hover-only reveal). aria-live="polite" announces pillar changes to
 * screen readers without interrupting whatever they're currently reading.
 */
export default function PillarCarousel() {
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
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % PILLARS.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const current = PILLARS[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + PILLARS.length) % PILLARS.length);
  }

  return (
    <div>
      <div
        aria-live="polite"
        className="min-h-[9rem] rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8"
      >
        <p className="text-xs font-normal tabular-nums uppercase tracking-[0.14em] text-zinc-400">
          {index + 1} of {PILLARS.length}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-zinc-50">{current.title}</h3>
        <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">{current.body}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous pillar"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-fuchsia-400 hover:text-fuchsia-300 ${FOCUS_RING}`}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next pillar"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-fuchsia-400 hover:text-fuchsia-300 ${FOCUS_RING}`}
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3.5 py-1.5 text-sm font-semibold text-zinc-300 hover:border-fuchsia-400 hover:text-fuchsia-300 ${FOCUS_RING}`}
        >
          {playing ? <Pause aria-hidden="true" className="h-3.5 w-3.5" /> : <Play aria-hidden="true" className="h-3.5 w-3.5" />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
