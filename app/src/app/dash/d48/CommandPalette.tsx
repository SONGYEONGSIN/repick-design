"use client";

import { Globe2, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RegionId } from "./data";
import { QUICK_COMPARISONS, QUICK_JUMPS, REGIONS } from "./data";
import { BORDER, FOCUS_VISIBLE, FOCUS_WITHIN, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  onClose,
  onSelectPair,
  onSelectRegionA,
}: {
  onClose: () => void;
  onSelectPair: (a: RegionId, b: RegionId) => void;
  onSelectRegionA: (id: RegionId) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedPairs = useMemo(() => (q === "" ? QUICK_COMPARISONS : QUICK_COMPARISONS.filter((p) => p.label.toLowerCase().includes(q))), [q]);

  const matchedRegions = useMemo(
    () => (q === "" ? REGIONS : REGIONS.filter((r) => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q))),
    [q],
  );

  const matchedJumps = useMemo(() => (q === "" ? QUICK_JUMPS : QUICK_JUMPS.filter((j) => j.label.toLowerCase().includes(q))), [q]);

  function jumpTo(targetId: string) {
    onClose();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/40 px-4 pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15", BORDER, "bg-white")}>
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER, FOCUS_WITHIN)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Compare two regions, or jump to a view…"
            aria-label="Search regions, comparisons, or views"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Quick comparisons</EyebrowLabel>
            </div>
            {matchedPairs.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching comparisons.</p>
            ) : (
              matchedPairs.map((pair) => (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => {
                    onSelectPair(pair.a, pair.b);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
                >
                  <Globe2 size={14} aria-hidden="true" className={TEXT_CAPTION} />
                  <span className="min-w-0 flex-1 truncate">{pair.label}</span>
                </button>
              ))
            )}
          </div>

          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Regions — sets Region A</EyebrowLabel>
            </div>
            {matchedRegions.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching regions.</p>
            ) : (
              matchedRegions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onSelectRegionA(r.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
                >
                  <MapPin size={14} aria-hidden="true" className={TEXT_CAPTION} />
                  <span className="min-w-0 flex-1 truncate">
                    {r.name}
                    <span className={cx("ml-1.5 text-xs", TEXT_CAPTION)}>
                      {r.city}, {r.countryCode}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Views</EyebrowLabel>
            </div>
            {matchedJumps.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => jumpTo(v.targetId)}
                className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
              >
                <v.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
