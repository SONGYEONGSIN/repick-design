"use client";

import type { CSSProperties } from "react";
import type { Incident } from "./data";

/**
 * Fully ephemeral hover/focus preview — no persistent state of its own. It is positioned
 * from a measured DOMRect rather than CSS `absolute` inside the card, specifically because
 * board columns are independently `overflow-y-auto`: an absolutely-positioned popover
 * anchored to a scrolled-past card would be clipped by its own column. `position: fixed`
 * with a rect captured on hover/focus sidesteps that entirely.
 *
 * The same information is always available to assistive tech via the card's own
 * `aria-describedby` (see card.tsx), so this layer is purely a decorative convenience for
 * pointer/sighted users and is marked `aria-hidden`.
 */
export function HoverPreview({ incident, anchor }: { incident: Incident; anchor: DOMRect }) {
  const width = 264;
  const margin = 12;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  let left = anchor.left;
  if (left + width + margin > vw) left = vw - width - margin;
  if (left < margin) left = margin;

  const openBelow = anchor.bottom + 132 < vh;
  const style: CSSProperties = openBelow
    ? { top: Math.round(anchor.bottom + 8), left: Math.round(left) }
    : { bottom: Math.round(vh - anchor.top + 8), left: Math.round(left) };

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", width, zIndex: 40, ...style }}
      className="pointer-events-none rounded-lg border border-white/10 bg-zinc-800 p-3 shadow-xl shadow-black/40 motion-reduce:transition-none"
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">Quick preview</p>
      <p className="mt-1 text-xs text-zinc-200">{incident.lastUpdate}</p>
      <p className="mt-1.5 text-[11px] text-zinc-400">Next: {incident.nextAction}</p>
    </div>
  );
}
