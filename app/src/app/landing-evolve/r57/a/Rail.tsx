"use client";

import { ACCENT, BORDER, EYEBROW, FG, FOCUS_RING, MUTED } from "./tokens";

interface Chapter {
  n: string;
  id: string;
  label: string;
}

const CHAPTERS: Chapter[] = [
  { n: "01", id: "hero", label: "The range" },
  { n: "02", id: "preview", label: "The listings" },
  { n: "03", id: "checklist", label: "The checklist" },
  { n: "04", id: "proof", label: "Who's tried it" },
  { n: "05", id: "start", label: "Start" },
];

/**
 * Persistent editorial index, not app chrome: chapter numerals + short labels, never icons-only
 * navigation. At desktop it is a fixed-width sticky column (~22% of the content width) to the
 * left of the 12-col main area; at mobile it collapses to a single thin horizontal strip so it
 * never pushes the hero headline below the first screen. The ghost numerals use MUTED (not a
 * lower-contrast/transparent tone) so they independently clear 3:1 at their rendered size even
 * though they are also marked aria-hidden for the screen-reader label that follows them.
 */
export function Rail() {
  return (
    <nav aria-label="Page sections" className="lg:sticky lg:top-0 lg:h-dvh lg:shrink-0 lg:basis-[22%]">
      {/* Mobile: thin top strip, horizontally scrollable, chapters inline */}
      <div
        className="flex items-center gap-5 overflow-x-auto border-b px-4 py-3 lg:hidden"
        style={{ borderColor: BORDER }}
      >
        {CHAPTERS.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] ${FOCUS_RING}`}
            style={{ color: MUTED }}
          >
            <span aria-hidden="true" style={{ color: ACCENT }}>
              {c.n}
            </span>
            {c.label}
          </a>
        ))}
      </div>

      {/* Desktop: full vertical rail */}
      <div className="hidden h-full flex-col justify-between border-r px-8 py-10 lg:flex" style={{ borderColor: BORDER }}>
        <div>
          <p className={EYEBROW} style={{ color: ACCENT }}>
            Repick
          </p>
          <p className="mt-2 text-[13px] font-normal leading-[1.6]" style={{ color: MUTED }}>
            Budget-fit matching
          </p>
        </div>

        <ol className="flex flex-col gap-7">
          {CHAPTERS.map((c) => (
            <li key={c.id} className="relative">
              <a
                href={`#${c.id}`}
                className={`group flex items-baseline gap-3 ${FOCUS_RING}`}
              >
                <span
                  aria-hidden="true"
                  className="text-[2.1rem] font-extrabold leading-none tracking-[-0.02em] tabular-nums"
                  style={{ color: MUTED }}
                >
                  {c.n}
                </span>
                <span
                  className="text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors"
                  style={{ color: FG }}
                >
                  {c.label}
                </span>
              </a>
            </li>
          ))}
        </ol>

        <p className="text-[11px] font-normal leading-[1.6]" style={{ color: MUTED }}>
          A fixed set of six listings, re-checked live.
        </p>
      </div>
    </nav>
  );
}
