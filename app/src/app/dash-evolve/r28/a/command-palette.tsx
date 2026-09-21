"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CalendarCheck, PieChart, AlertTriangle, X } from "lucide-react";
import type { Metric } from "./data";
import { FOCUS_RING, FOCUS_RING_FULL } from "./ui";

export interface PaletteCommand {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  run: () => void;
}

export function useCommandPalette(opts: {
  jumpToToday: () => void;
  setMetric: (m: Metric) => void;
  toggleRiskOnly: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands: PaletteCommand[] = useMemo(
    () => [
      { id: "today", label: "Jump to today", hint: "Sep 21, 2026", icon: CalendarCheck, run: opts.jumpToToday },
      { id: "m-util", label: "View metric: Booked capacity", hint: "Calendar color", icon: PieChart, run: () => opts.setMetric("utilization") },
      { id: "m-rev", label: "View metric: Revenue booked", hint: "Calendar color", icon: PieChart, run: () => opts.setMetric("revenue") },
      { id: "m-risk", label: "View metric: SLA risk", hint: "Calendar color", icon: PieChart, run: () => opts.setMetric("risk") },
      { id: "risk-only", label: "Toggle: show at-risk days only", hint: "Calendar filter", icon: AlertTriangle, run: opts.toggleRiskOnly },
    ],
    [opts]
  );

  return { open, setOpen, commands };
}

export function CommandPalette({
  open, onClose, commands,
}: { open: boolean; onClose: () => void; commands: PaletteCommand[] }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query]
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 10);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  function runActive() {
    const cmd = filtered[activeIndex];
    if (cmd) {
      cmd.run();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4">
          <Search aria-hidden="true" className="h-4.5 w-4.5 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
              if (e.key === "Enter") { e.preventDefault(); runActive(); }
            }}
            placeholder="Search commands…"
            aria-label="Search commands"
            className={`h-12 w-full rounded-md bg-transparent text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING_FULL}`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <ul role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm font-normal text-zinc-500">No matching commands.</li>
          )}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <li key={cmd.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => { cmd.run(); onClose(); }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${FOCUS_RING} ${
                    i === activeIndex ? "bg-orange-50 text-orange-800" : "text-zinc-700"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate font-medium">{cmd.label}</span>
                  <span className="shrink-0 text-xs font-normal text-zinc-500">{cmd.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
