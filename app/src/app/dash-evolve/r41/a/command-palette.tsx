"use client";

import { useEffect, useRef, useState } from "react";
import { CandlestickChart, Search, X } from "lucide-react";
import { INSTRUMENTS, getTickerStats } from "./data";
import { FOCUS_RING } from "./ui";

export function CommandPalette({
  open,
  onClose,
  onSelectInstrument,
}: {
  open: boolean;
  onClose: () => void;
  onSelectInstrument: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const matches = INSTRUMENTS.filter((inst) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return inst.symbol.toLowerCase().includes(q) || inst.name.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <button type="button" aria-label="Close search" onClick={onClose} className="fixed inset-0 bg-zinc-950/40" />
      <div role="dialog" aria-modal="true" aria-label="Search instruments" className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search instruments…"
            className={`h-12 w-full min-w-0 flex-1 bg-transparent font-normal text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button type="button" aria-label="Close search" onClick={onClose} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto p-1.5">
          {matches.length === 0 ? (
            <li className="px-3 py-6 text-center font-normal text-sm text-zinc-500">No instruments match &ldquo;{query}&rdquo;.</li>
          ) : (
            matches.map((inst) => {
              const stats = getTickerStats(inst);
              return (
                <li key={inst.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectInstrument(inst.id);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left motion-safe:transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
                  >
                    <CandlestickChart className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-sm text-zinc-900">{inst.symbol}</span>
                      <span className="block truncate font-normal text-xs text-zinc-500">{inst.name}</span>
                    </span>
                    <span className={`shrink-0 font-medium text-xs tabular-nums ${stats.changePct >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {stats.changePct >= 0 ? "+" : ""}
                      {stats.changePct.toFixed(2)}%
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
