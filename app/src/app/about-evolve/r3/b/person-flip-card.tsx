"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { FOCUS_RING, type Person } from "./data";
import MonogramAvatar from "./monogram-avatar";

/**
 * First wired interaction: a click/focus-operable flip card, not a hover reveal (hover excludes
 * keyboard and touch users). The whole card is a single <button> so the flip state has one
 * unambiguous control; `aria-pressed` carries the state and the visually-hidden label announces
 * which face is now showing. Both faces stay in the DOM at all times (no conditional render) so
 * layout height never jumps, but the face that's rotated away is `aria-hidden` + `inert`-equivalent
 * (no focusable content on either face, so aria-hidden alone is sufficient here).
 *
 * `prefers-reduced-motion` drops the transition duration (`motion-reduce:transition-none`) so the
 * flip becomes an instant, non-animated swap — the state change and the backface-visibility
 * mechanism are identical either way, only the animated transition is removed.
 */
export default function PersonFlipCard({ person }: { person: Person }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className={`group relative h-64 w-full [perspective:1200px] text-left ${FOCUS_RING} rounded-2xl`}
    >
      <span className="sr-only">
        {person.name}, {person.role}. {flipped ? "Showing bio. Press to show role." : "Press to show bio."}
      </span>
      <span
        aria-hidden="true"
        className={`relative block h-full w-full rounded-2xl transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <span className="absolute inset-0 flex h-full w-full flex-col items-start justify-between rounded-2xl border border-zinc-200 bg-white p-5 [backface-visibility:hidden]">
          <MonogramAvatar initials={person.initials} color={person.color} className="h-12 w-12 shrink-0" />
          <span className="mt-auto">
            <span className="block text-base font-semibold leading-snug text-zinc-900">{person.name}</span>
            <span className="mt-1 block text-sm font-normal leading-snug text-zinc-600">{person.role}</span>
            <span className="mt-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-emerald-700">
              <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
              Before Millrace
            </span>
          </span>
        </span>

        {/* Back */}
        <span className="absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-xs font-medium uppercase tracking-[0.1em] text-emerald-700">{person.before}</span>
          <span className="mt-2 block text-sm font-normal leading-relaxed text-zinc-700">{person.bioBack}</span>
        </span>
      </span>
    </button>
  );
}
