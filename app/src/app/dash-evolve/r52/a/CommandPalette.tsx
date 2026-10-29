"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CalendarDays, User2 } from "lucide-react";
import { ENGINEERS, INCIDENTS } from "./data";

type Item = { id: string; label: string; sub: string; kind: "day" | "engineer" };

function buildIndex(): Item[] {
  const days = Array.from(new Set(INCIDENTS.map((i) => i.dateIso))).map((dateIso) => ({
    id: `day-${dateIso}`,
    label: dateIso,
    sub: "Jump to this day on the calendar",
    kind: "day" as const,
  }));
  const engineers = ENGINEERS.map((e) => ({
    id: `eng-${e.id}`,
    label: e.name,
    sub: `${e.team} · on-call roster`,
    kind: "engineer" as const,
  }));
  return [...days, ...engineers];
}

const INDEX = buildIndex();

export function CommandPalette({
  open,
  onClose,
  onSelectDay,
}: {
  open: boolean;
  onClose: () => void;
  onSelectDay: (dateIso: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [wasOpen, setWasOpen] = useState(false);

  // Reset query/selection the instant `open` flips true, adjusted during render rather than in an
  // effect (React's documented pattern for state derived from a prop change) — avoids the
  // set-state-in-effect lint rule entirely.
  if (open && !wasOpen) {
    setWasOpen(true);
    if (query !== "") setQuery("");
    if (activeIndex !== 0) setActiveIndex(0);
  } else if (!open && wasOpen) {
    setWasOpen(false);
  }

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INDEX.slice(0, 8);
    return INDEX.filter((item) => item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  function commit(item: Item | undefined) {
    if (!item) return;
    if (item.kind === "day") onSelectDay(item.label);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            commit(results[activeIndex]);
          }
        }}
      >
        <div className="flex h-12 items-center gap-2 border-b border-zinc-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={results[activeIndex] ? `palette-opt-${results[activeIndex].id}` : undefined}
            placeholder="Jump to a day or an engineer…"
            className="h-full flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
        </div>
        <ul id="palette-listbox" role="listbox" aria-label="Results" className="max-h-72 overflow-y-auto p-1">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No matches</li>
          ) : (
            results.map((item, idx) => {
              const Icon = item.kind === "day" ? CalendarDays : User2;
              const active = idx === activeIndex;
              return (
                <li
                  key={item.id}
                  id={`palette-opt-${item.id}`}
                  role="option"
                  aria-selected={active}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => commit(item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors motion-reduce:transition-none ${
                    active ? "bg-sky-50 text-sky-800" : "text-zinc-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.label}</span>
                    <span className="block truncate text-xs text-zinc-600">{item.sub}</span>
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
