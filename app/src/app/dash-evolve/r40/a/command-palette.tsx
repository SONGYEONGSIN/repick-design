"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { FEED, REGIONS, regionById } from "./data";
import { formatPercent } from "./format";
import { FOCUS_RING, StatusBadge } from "./ui";

export default function CommandPalette({
  open,
  onClose,
  onSelectRegion,
}: {
  open: boolean;
  onClose: () => void;
  onSelectRegion: (regionId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prop-to-state reset done during render (compare to a stored previous value), not inside a
  // useEffect keyed on `open` — avoids the derived-state-in-effect anti-pattern.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase();
  const regionResults = REGIONS.filter(
    (r) => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.cluster.toLowerCase().includes(q)
  );
  const incidentResults = FEED.filter(
    (f) => f.title.toLowerCase().includes(q) || (regionById(f.regionId)?.name.toLowerCase().includes(q) ?? false)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24">
      <div role="dialog" aria-modal="true" aria-label="Search regions and incidents" className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
        <div className="flex h-11 items-center gap-2 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
            aria-label="Search regions and incidents by name"
            placeholder="Search regions and incidents..."
            className={`w-full rounded-md bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {regionResults.length === 0 && incidentResults.length === 0 ? (
            <p className="px-3 py-6 text-center font-normal text-sm text-zinc-400">No matches for &quot;{query}&quot;.</p>
          ) : (
            <>
              {regionResults.length > 0 ? (
                <div className="mb-1">
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">Regions</p>
                  <ul>
                    {regionResults.map((region) => (
                      <li key={region.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectRegion(region.id);
                            onClose();
                          }}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="font-medium text-sm text-zinc-50">{region.code}</span>
                            <span className="truncate text-xs text-zinc-400">{region.name}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="font-medium text-xs tabular-nums text-zinc-400">{formatPercent(region.uptimePct)}</span>
                            <StatusBadge status={region.status} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {incidentResults.length > 0 ? (
                <div>
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">Incidents</p>
                  <ul>
                    {incidentResults.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectRegion(item.regionId);
                            onClose();
                          }}
                          className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
                        >
                          <span className="min-w-0 truncate font-medium text-sm text-zinc-50">{item.title}</span>
                          <span className="shrink-0 font-normal text-xs text-zinc-400">{item.elapsed}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
