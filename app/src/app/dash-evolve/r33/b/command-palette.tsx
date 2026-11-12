"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { METRICS, STATUS_META, type MetricKey, type Zone } from "./data";
import { cx, useDismissable, useFocusTrapReturn } from "./ui";

export default function CommandPalette({
  open,
  onClose,
  zones,
  metric,
  onSelectZone,
}: {
  open: boolean;
  onClose: () => void;
  zones: Zone[];
  metric: MetricKey;
  onSelectZone: (id: string) => void;
}) {
  // Lives here, not in the dialog below, because it needs to see both the open->true and the
  // open->false transition (it captures the trigger on open and restores focus to it on close) —
  // the dialog itself is only mounted while open, so it would never observe the close edge.
  useFocusTrapReturn(open);

  if (!open) return null;

  return <PaletteDialog zones={zones} metric={metric} onClose={onClose} onSelectZone={onSelectZone} />;
}

/** Mounted only while the palette is open (the parent returns null otherwise), so `query` and
 *  `activeIndex` start fresh on every open for free, via normal `useState` initial values —
 *  no imperative reset inside a `useEffect` needed. The remaining effect below is a genuine
 *  external-system sync (moving real DOM focus into the input) with no state updates in it. */
function PaletteDialog({
  zones,
  metric,
  onClose,
  onSelectZone,
}: {
  zones: Zone[];
  metric: MetricKey;
  onClose: () => void;
  onSelectZone: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = METRICS[metric];

  useDismissable(true, onClose, panelRef);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return zones;
    return zones.filter(
      (z) => z.code.toLowerCase().includes(q) || z.name.toLowerCase().includes(q) || z.manager.toLowerCase().includes(q)
    );
  }, [zones, query]);

  function commit(id: string) {
    onSelectZone(id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-[12vh]">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Jump to zone"
        className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[activeIndex]) {
                e.preventDefault();
                commit(results[activeIndex].id);
              }
            }}
            placeholder="Jump to a zone…"
            aria-label="Jump to a zone"
            aria-activedescendant={results[activeIndex] ? `cmdk-${results[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            className={cx(
              "h-12 w-full bg-transparent text-[13px] font-normal text-zinc-50 placeholder:text-zinc-400",
              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6cc0b3]"
            )}
          />
          <kbd className="shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10.5px] font-medium text-zinc-400">Esc</kbd>
        </div>
        <ul id="cmdk-list" role="listbox" aria-label="Zones" className="max-h-80 overflow-y-auto p-1.5">
          {results.map((z, i) => (
            <li key={z.id} id={`cmdk-${z.id}`} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(z.id)}
                className={cx(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left",
                  i === activeIndex ? "bg-[#3f9c90]/15" : ""
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium text-zinc-50">
                    {z.code} &middot; {z.name}
                  </span>
                  <span className="block truncate text-[11px] font-normal text-zinc-400">
                    {STATUS_META[z.status].label} &middot; {z.manager}
                  </span>
                </span>
                <span className="shrink-0 text-[12px] font-semibold tabular-nums text-zinc-50">{meta.format(z)}</span>
              </button>
            </li>
          ))}
          {results.length === 0 ? <li className="px-2.5 py-6 text-center text-[12.5px] font-normal text-zinc-400">No zones found.</li> : null}
        </ul>
      </div>
    </div>
  );
}
