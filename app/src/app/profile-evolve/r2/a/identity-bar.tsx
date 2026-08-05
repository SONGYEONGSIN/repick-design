import { Star } from "lucide-react";
import MonogramMark from "./monogram-mark";
import { PROFILE, STATS, formatCount } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-grotesk)" } as const;

/**
 * Persistent identity + trust-stat rail. This is NOT a hero banner and NOT a sidebar card — it is a
 * slim bar, `sticky top-0`, that stays mounted and visible at every scroll depth and every filter/sort
 * state on the page below. The prior round's deciding delta was that the core proof cluster (rating,
 * volume, tenure) must never live behind a tab or require a click — pinning it here, rather than in a
 * once-only hero or a collapsible card, satisfies that at the strongest level: it survives scrolling
 * the entire engagement log, not just the first viewport.
 */
export default function IdentityBar() {
  return (
    <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <MonogramMark className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          <div className="min-w-0">
            <h1
              className="truncate text-base font-semibold leading-tight text-zinc-900 sm:text-lg"
              style={DISPLAY_FONT}
            >
              {PROFILE.name}
            </h1>
            <p className="truncate text-xs font-normal text-zinc-600 sm:text-sm">{PROFILE.title}</p>
          </div>
        </div>

        <dl className="grid grid-cols-4 gap-x-3 gap-y-0 text-center sm:gap-x-5">
          <div className="min-w-0">
            <dt className="truncate text-[10px] font-normal tracking-wide text-zinc-600 uppercase sm:text-xs">
              Rating
            </dt>
            <dd
              className="mt-0.5 inline-flex items-center justify-center gap-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base"
              style={DISPLAY_FONT}
            >
              <Star aria-hidden="true" className="h-3 w-3 shrink-0 fill-emerald-700 text-emerald-700 sm:h-3.5 sm:w-3.5" />
              {STATS.rating.toFixed(1)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="truncate text-[10px] font-normal tracking-wide text-zinc-600 uppercase sm:text-xs">
              Audits
            </dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base" style={DISPLAY_FONT}>
              {formatCount(STATS.engagementsCompleted)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="truncate text-[10px] font-normal tracking-wide text-zinc-600 uppercase sm:text-xs">
              Fixes
            </dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base" style={DISPLAY_FONT}>
              {formatCount(STATS.vulnerabilitiesResolved)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="truncate text-[10px] font-normal tracking-wide text-zinc-600 uppercase sm:text-xs">
              Since
            </dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base" style={DISPLAY_FONT}>
              {STATS.activeSince}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
