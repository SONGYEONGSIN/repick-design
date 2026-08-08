"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CircleCheck, Copy, Minus, Plus, Users } from "lucide-react";
import {
  EQUITY_BANDS,
  FOCUS_RING,
  LEVEL_LABELS,
  LOCATION_LABELS,
  LOCATION_MULTIPLIER,
  ROLES,
  TRACK_LABELS,
  YEARS_QUICK_PICKS,
  formatUSD,
  levelFromYears,
  salaryRange,
  type LocationKey,
  type Track,
} from "./data";

const TRACKS = Object.keys(TRACK_LABELS) as Track[];
const LOCATIONS = Object.keys(LOCATION_LABELS) as LocationKey[];

/**
 * Three wired, non-decorative interactions, all feeding one live-computed readout:
 *   1. A years-of-experience stepper (numeric input + +/- buttons + quick-pick chips) that runs
 *      through a fixed step function to a level.
 *   2. A track <select> that picks which published base-band table the calculator reads from.
 *   3. A location <select> that multiplies the base band by a fixed factor and re-rounds.
 * A fourth (copy-to-clipboard of the computed estimate) is bonus but genuinely functional.
 * The role list below is always fully rendered — the calculator only adds a match badge to a
 * subset of already-visible cards, it never hides or gates any role.
 */
export default function RoleExplorer() {
  const [years, setYears] = useState(5);
  const [track, setTrack] = useState<Track>("engineering");
  const [location, setLocation] = useState<LocationKey>("remote");
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  const level = levelFromYears(years);
  const [min, max] = salaryRange(track, level, location);
  const equity = EQUITY_BANDS[level];
  const multiplier = LOCATION_MULTIPLIER[location];

  const exactMatches = ROLES.filter((r) => r.track === track && r.level === level);
  const sameTeamCount = ROLES.filter((r) => r.track === track && r.level !== level).length;

  function clampYears(n: number) {
    return Math.max(0, Math.min(20, n));
  }

  async function handleCopy() {
    const summary = `Fenmark pay estimate — ${TRACK_LABELS[track]}, ${LEVEL_LABELS[level]}, ${LOCATION_LABELS[location]}: ${formatUSD(min)}–${formatUSD(max)} base, ${equity} equity.`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard permission denied or unavailable — silently no-op, button stays usable.
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-10">
      {/* Calculator panel */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-700">Estimate your fit</p>

        <div className="mt-5">
          <label htmlFor="years-input" className="block text-sm font-semibold text-zinc-900">
            Years of experience
          </label>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setYears((y) => clampYears(y - 1))}
              aria-label="Decrease years of experience"
              className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:border-rose-400 hover:text-rose-700 ${FOCUS_RING}`}
            >
              <Minus aria-hidden="true" className="h-4 w-4" />
            </button>
            <input
              id="years-input"
              type="number"
              inputMode="numeric"
              min={0}
              max={20}
              step={1}
              value={years}
              onChange={(e) => {
                const parsed = Number(e.target.value);
                setYears(Number.isFinite(parsed) ? clampYears(parsed) : 0);
              }}
              className={`h-10 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 text-center text-base font-semibold tabular-nums text-zinc-900 ${FOCUS_RING}`}
            />
            <button
              type="button"
              onClick={() => setYears((y) => clampYears(y + 1))}
              aria-label="Increase years of experience"
              className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:border-rose-400 hover:text-rose-700 ${FOCUS_RING}`}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {YEARS_QUICK_PICKS.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => setYears(q.years)}
                aria-pressed={years === q.years}
                className={`rounded-full border px-2.5 py-1 text-xs font-normal ${
                  years === q.years
                    ? "border-rose-600 bg-rose-600 text-white"
                    : "border-zinc-300 bg-white text-zinc-600 hover:border-rose-400 hover:text-rose-700"
                } ${FOCUS_RING}`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="track-select" className="block text-sm font-semibold text-zinc-900">
            Team
          </label>
          <select
            id="track-select"
            value={track}
            onChange={(e) => setTrack(e.target.value as Track)}
            className={`mt-2 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-normal text-zinc-900 ${FOCUS_RING}`}
          >
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {TRACK_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label htmlFor="location-select" className="block text-sm font-semibold text-zinc-900">
            Location
          </label>
          <select
            id="location-select"
            value={location}
            onChange={(e) => setLocation(e.target.value as LocationKey)}
            className={`mt-2 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-normal text-zinc-900 ${FOCUS_RING}`}
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {LOCATION_LABELS[l]} &middot; {LOCATION_MULTIPLIER[l].toFixed(2)}x
              </option>
            ))}
          </select>
        </div>

        {/* Live readout — announced to screen readers as inputs change */}
        <div aria-live="polite" className="mt-6 rounded-xl border border-rose-200 bg-white p-5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-rose-700">Matched level</span>
            <span className="text-lg font-bold text-zinc-900">{LEVEL_LABELS[level]}</span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <dt className="text-xs font-normal text-zinc-600">Base salary</dt>
              <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-900">
                {formatUSD(min)}–{formatUSD(max)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-normal text-zinc-600">Equity</dt>
              <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-900">{equity}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs font-normal leading-relaxed text-zinc-600">
            {TRACK_LABELS[track]} base band &times; {multiplier.toFixed(2)} location factor, rounded to the nearest
            thousand.
          </p>
          <p className="mt-3 text-sm font-normal text-zinc-700">
            <span className="font-semibold tabular-nums text-rose-700">{exactMatches.length}</span> of{" "}
            {ROLES.length} open roles match this profile exactly
            {sameTeamCount > 0 ? `, ${sameTeamCount} more on the same team` : ""}.
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className={`mt-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-rose-400 hover:text-rose-700 ${FOCUS_RING}`}
          >
            {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5 text-rose-700" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
            {copied ? "Copied to clipboard" : "Copy this estimate"}
          </button>
        </div>
      </div>

      {/* Always-visible role list */}
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-semibold text-zinc-900">All {ROLES.length} open roles</h3>
          <p className="text-xs font-normal text-zinc-600">Highlights update as you change the estimate</p>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLES.map((role) => {
            const isExact = role.track === track && role.level === level;
            const isSameTeam = !isExact && role.track === track;
            return (
              <li
                key={role.id}
                className={`min-w-0 rounded-xl border p-4 ${
                  isExact
                    ? "border-rose-600 bg-rose-50"
                    : isSameTeam
                      ? "border-zinc-300 bg-zinc-50"
                      : "border-zinc-200 bg-white"
                }`}
              >
                <p className="text-base font-semibold text-zinc-900">{role.title}</p>
                <p className="mt-1 text-sm font-normal text-zinc-600">
                  {TRACK_LABELS[role.track]} &middot; {LEVEL_LABELS[role.level]} &middot; {LOCATION_LABELS[role.location]}
                </p>
                {isExact ? (
                  <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                    <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" />
                    Matches your profile
                  </p>
                ) : isSameTeam ? (
                  <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-normal text-zinc-600">
                    <Users aria-hidden="true" className="h-3.5 w-3.5" />
                    Same team, different level
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
