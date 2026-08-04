"use client";

import { BadgeCheck, Boxes, CalendarDays, Globe2, MapPin, Star, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { AVG_RATING, CATEGORY_COUNTS, CATEGORY_LABELS, INTEGRATIONS, PROFILE, TOTAL_INSTALLS, formatCount, type CategoryKey } from "./data";
import AvatarMark from "./avatar-mark";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const CATEGORY_ORDER: CategoryKey[] = ["support", "crm", "payments", "ecommerce", "analytics", "devops"];

const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" } as const;

export default function Sidebar({
  activeCategory,
  onToggleCategory,
}: {
  activeCategory: CategoryKey | null;
  onToggleCategory: (key: CategoryKey) => void;
}) {
  const [following, setFollowing] = useState(false);
  const followerCount = PROFILE.followers + (following ? 1 : 0);

  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <AvatarMark handle={PROFILE.handle} name={PROFILE.name} className="h-20 w-20" />

        <div className="mt-4">
          <h1 className="text-xl font-semibold leading-tight text-zinc-50" style={DISPLAY_FONT}>
            {PROFILE.name}
          </h1>
          <p className="mt-0.5 text-sm font-normal text-zinc-400">@{PROFILE.handle}</p>
        </div>

        {PROFILE.verified ? (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
            <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Verified maintainer
          </div>
        ) : null}

        <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-300">{PROFILE.title}</p>

        <button
          type="button"
          aria-pressed={following}
          onClick={() => setFollowing((f) => !f)}
          className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${FOCUS} ${
            following
              ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
              : "border border-amber-400/50 text-amber-300 hover:bg-amber-500/10"
          }`}
        >
          {following ? (
            <UserCheck aria-hidden="true" className="h-4 w-4" />
          ) : (
            <UserPlus aria-hidden="true" className="h-4 w-4" />
          )}
          {following ? "Following" : "Follow"}
        </button>

        <p className="mt-2.5 text-center text-sm font-normal text-zinc-400">
          <span className="font-medium tabular-nums text-zinc-100">{formatCount(followerCount)}</span> followers &middot;{" "}
          <span className="font-medium tabular-nums text-zinc-100">{formatCount(PROFILE.following)}</span> following
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-4">
          <div>
            <dt className="text-xs font-normal text-zinc-400">Installs</dt>
            <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
              {formatCount(TOTAL_INSTALLS)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-normal text-zinc-400">Integrations</dt>
            <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
              {INTEGRATIONS.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-normal text-zinc-400">Avg rating</dt>
            <dd
              className="mt-0.5 inline-flex items-center gap-1 text-base font-semibold tabular-nums text-zinc-50"
              style={DISPLAY_FONT}
            >
              <Star aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
              {AVG_RATING.toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-normal text-zinc-400">Member since</dt>
            <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
              {PROFILE.memberSince}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-zinc-50">About</h2>
        <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-300">{PROFILE.bio}</p>

        <dl className="mt-4 space-y-2.5 border-t border-zinc-800 pt-4">
          <div className="flex items-start gap-2">
            <dt className="flex items-center gap-1.5 text-sm font-normal text-zinc-400">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="sr-only">Location</span>
            </dt>
            <dd className="text-sm font-normal text-zinc-300">{PROFILE.location}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="flex items-center gap-1.5 text-sm font-normal text-zinc-400">
              <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="sr-only">Member since</span>
            </dt>
            <dd className="text-sm font-normal text-zinc-300">Joined Loopwire {PROFILE.memberSince}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="flex items-center gap-1.5 text-sm font-normal text-zinc-400">
              <Globe2 aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="sr-only">Website</span>
            </dt>
            <dd className="text-sm font-normal text-zinc-300">{PROFILE.website}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-zinc-50">Specialties</h2>
        <p className="mt-1 text-xs font-normal text-zinc-400">Select a tag to filter published integrations.</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {CATEGORY_ORDER.map((key) => {
            const active = activeCategory === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleCategory(key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${FOCUS} ${
                  active
                    ? "border-amber-400 bg-amber-500/15 text-amber-300"
                    : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:text-zinc-50"
                }`}
              >
                <Boxes aria-hidden="true" className="h-3.5 w-3.5" />
                {CATEGORY_LABELS[key]}
                <span className="tabular-nums text-zinc-400">{CATEGORY_COUNTS[key]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
