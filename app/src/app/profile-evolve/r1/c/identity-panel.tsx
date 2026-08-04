"use client";

import { useId, useState } from "react";
import { BadgeCheck, FileText, Globe, Mail, Rss, TrendingUp, UserCheck, UserPlus, Users } from "lucide-react";
import { CREATOR, PLATFORM_NAME, STATS_BASE } from "./data";

// Tailwind's arbitrary-value class syntax for font-family is finicky across bundler versions, so —
// matching the convention already established in catalog-client.tsx / product-client.tsx / scene's
// tokens.ts — the display face is applied via a plain inline style referencing the allow-listed CSS
// var directly, never a new @font-face or literal family name.
const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

function formatCount(n: number) {
  return n.toLocaleString("en-US");
}

/**
 * Hero identity header + the permanently-visible reach/credibility stat cluster.
 *
 * The two live in one client component because the "Follow" toggle has to move a number that sits
 * in the stat strip, not in the button itself — per the assignment's hard requirement, that strip
 * renders at rest on load (it is not behind a tab or a click) and only its subscriber figure reacts
 * to the follow state.
 */
export default function IdentityPanel() {
  const [isFollowing, setIsFollowing] = useState(false);
  const liveRegionId = useId();
  const subscribers = STATS_BASE.subscribers + (isFollowing ? 1 : 0);

  const stats = [
    { key: "subscribers", label: "Subscribers", value: subscribers, icon: Users, live: true },
    { key: "paidMembers", label: "Paid members", value: STATS_BASE.paidMembers, icon: BadgeCheck, live: false },
    { key: "posts", label: "Posts published", value: STATS_BASE.posts, icon: FileText, live: false },
    { key: "openRate", label: "Avg. open rate", value: `${STATS_BASE.openRate}%`, icon: TrendingUp, live: false },
  ] as const;

  return (
    <section aria-label="Creator identity and reach" className="border-b border-zinc-800">
      <div className="mx-auto max-w-5xl px-5 pt-10 pb-8 sm:px-8 sm:pt-14">
        <p className="text-xs font-medium tracking-[0.14em] text-zinc-400 uppercase">On {PLATFORM_NAME}</p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div
            aria-hidden="true"
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-zinc-800 ring-1 ring-zinc-700 sm:h-28 sm:w-28"
          >
            <span style={DISPLAY_FONT} className="text-2xl font-semibold text-zinc-950 sm:text-3xl">
              {CREATOR.initials}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 style={DISPLAY_FONT} className="text-2xl font-semibold text-zinc-50 sm:text-3xl">
                {CREATOR.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Verified creator
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-cyan-300">{CREATOR.handle}</p>
            <p className="mt-1 text-sm font-medium text-zinc-400">Publishes {CREATOR.newsletter}</p>

            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-normal text-zinc-300">{CREATOR.bio}</p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {CREATOR.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                aria-pressed={isFollowing}
                aria-describedby={liveRegionId}
                onClick={() => setIsFollowing((v) => !v)}
                className={
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
                  (isFollowing
                    ? "border border-zinc-700 bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                    : "bg-cyan-400 text-zinc-950 hover:bg-cyan-300")
                }
              >
                {isFollowing ? (
                  <UserCheck className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                )}
                {isFollowing ? "Following" : "Follow"}
              </button>

              <a
                href={`mailto:${CREATOR.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Email</span>
              </a>
              <a
                href={`https://${CREATOR.website}`}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Website</span>
              </a>
              <a
                href="#latest-posts"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                <Rss className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Feed</span>
              </a>
            </div>

            <p id={liveRegionId} role="status" aria-live="polite" className="sr-only">
              {isFollowing
                ? `You are following ${CREATOR.name}. Subscriber count is now ${formatCount(subscribers)}.`
                : `You unfollowed ${CREATOR.name}. Subscriber count is now ${formatCount(subscribers)}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Reach/credibility stat cluster — always rendered at rest, never gated behind a tab or click. */}
      <div className="border-t border-zinc-800 bg-zinc-900/40">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-none bg-zinc-800 px-5 sm:grid-cols-4 sm:px-8">
          {stats.map(({ key, label, value, icon: Icon, live }) => (
            <div key={key} className="min-w-0 bg-zinc-950/60 px-4 py-5 sm:px-6">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </dt>
              <dd
                style={DISPLAY_FONT}
                className="mt-1.5 text-xl font-semibold tabular-nums text-zinc-50 sm:text-2xl"
                {...(live ? { "aria-live": "polite" as const } : {})}
              >
                {typeof value === "number" ? formatCount(value) : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
