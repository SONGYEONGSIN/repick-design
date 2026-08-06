"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

type LogoStripProps = {
  logos: string[];
};

export default function LogoStrip({ logos }: LogoStripProps) {
  const [paused, setPaused] = useState(false);
  // Duplicate the list once so the track can scroll from 0% to -50% and loop seamlessly.
  const track = [...logos, ...logos];

  return (
    <div className="group relative">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-medium text-xs uppercase tracking-wide text-zinc-500">
          Retail and manufacturing partners
        </p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 font-medium text-xs text-zinc-600 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
        >
          {paused ? (
            <>
              <Play aria-hidden="true" className="h-3.5 w-3.5" />
              Play scroll
            </>
          ) : (
            <>
              <Pause aria-hidden="true" className="h-3.5 w-3.5" />
              Pause scroll
            </>
          )}
        </button>
      </div>

      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        role="list"
        aria-label="Partner companies"
      >
        <div
          className="about-logo-track flex w-max gap-10"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {track.map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              role="listitem"
              className="flex h-12 flex-none items-center rounded-lg border border-zinc-200 bg-white px-5 font-semibold text-sm tracking-wide text-zinc-500"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .about-logo-track {
          animation: marquee 32s linear infinite;
        }
        .about-logo-track:hover,
        .about-logo-track:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .about-logo-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
