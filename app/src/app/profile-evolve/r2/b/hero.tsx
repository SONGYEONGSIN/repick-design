import { ShieldCheck, UserCheck, UserPlus } from "lucide-react";
import AvatarMark from "./avatar-mark";
import { PROFILE } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

export default function Hero({ following, onToggleFollow }: { following: boolean; onToggleFollow: () => void }) {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300" style={DISPLAY_FONT}>
            Meridian
          </span>
          <span className="text-xs font-normal text-zinc-400">Track records audited monthly by an independent administrator</span>
        </div>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <AvatarMark initials="RK" className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold leading-tight text-zinc-50 sm:text-3xl" style={DISPLAY_FONT}>
                {PROFILE.name}
              </h1>
              <p className="mt-0.5 text-sm font-normal text-zinc-400">
                @{PROFILE.handle} &middot; {PROFILE.strategyName} &middot; {PROFILE.title}
              </p>
              {PROFILE.audited ? (
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                  <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
                  Audited track record
                </div>
              ) : null}
              <p className="mt-3 max-w-xl text-sm font-normal leading-relaxed text-zinc-300">{PROFILE.bio}</p>
            </div>
          </div>

          <button
            type="button"
            aria-pressed={following}
            onClick={onToggleFollow}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${FOCUS} ${
              following ? "bg-cyan-400 text-zinc-950 hover:bg-cyan-300" : "border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
            }`}
          >
            {following ? (
              <UserCheck aria-hidden="true" className="h-4 w-4" />
            ) : (
              <UserPlus aria-hidden="true" className="h-4 w-4" />
            )}
            {following ? "Copying" : "Copy strategy"}
          </button>
        </div>
      </div>
    </header>
  );
}
