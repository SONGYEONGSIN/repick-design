import { CheckCircle2, Clock3, Star, Timer } from "lucide-react";
import AvatarMark from "./avatar-mark";
import { PROFILE, STATS } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" } as const;

// The persistent trust/reach stat cluster. This bar is `sticky top-0` in profile-client.tsx and stays
// mounted (never conditionally hidden by a tab or filter state) so the four core numbers are visible
// at every scroll depth and every filter/sort state — see profile-deltas-provisional.jsonl r1/b.
export default function IdentityBar() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-4">
      <div className="flex items-center gap-3.5">
        <AvatarMark handle={PROFILE.handle} initials="RC" className="h-11 w-11 sm:h-12 sm:w-12" />
        <div className="min-w-0">
          <h1
            className="truncate text-base font-semibold leading-tight text-zinc-900 sm:text-lg"
            style={DISPLAY_FONT}
          >
            {PROFILE.name}
          </h1>
          <p className="truncate text-xs font-normal text-zinc-600 sm:text-sm">
            {PROFILE.title} <span className="text-zinc-400" aria-hidden="true">&middot;</span>{" "}
            <span className="inline-flex items-center gap-1 align-middle text-blue-700">
              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
              {PROFILE.availability}
            </span>
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-zinc-200 pt-3 sm:grid-cols-4 sm:gap-x-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <div className="min-w-0">
          <dt className="flex items-center gap-1 text-[11px] font-normal uppercase tracking-wide text-zinc-600">
            <Star aria-hidden="true" className="h-3 w-3 text-blue-600" />
            Rating
          </dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base" style={DISPLAY_FONT}>
            {STATS.rating.toFixed(1)}
            <span className="ml-1 text-xs font-normal text-zinc-600">({STATS.ratingCount})</span>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] font-normal uppercase tracking-wide text-zinc-600">Completed</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base" style={DISPLAY_FONT}>
            {STATS.completedEngagements}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="flex items-center gap-1 text-[11px] font-normal uppercase tracking-wide text-zinc-600">
            <Timer aria-hidden="true" className="h-3 w-3 text-blue-600" />
            Response
          </dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base" style={DISPLAY_FONT}>
            {STATS.responseTime}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="flex items-center gap-1 text-[11px] font-normal uppercase tracking-wide text-zinc-600">
            <Clock3 aria-hidden="true" className="h-3 w-3 text-blue-600" />
            On-time
          </dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900 sm:text-base" style={DISPLAY_FONT}>
            {STATS.onTimeRate}%
          </dd>
        </div>
      </dl>
    </div>
  );
}
