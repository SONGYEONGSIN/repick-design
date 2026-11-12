"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { SeverityBadge, FOCUS_RING } from "./ui";
import { INCIDENTS, COLUMN_META } from "./data";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function CommandPalette({ open, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query synchronously during render when `open` flips true — React's documented
  // pattern for adjusting state from a prop change during render.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? INCIDENTS.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.service.toLowerCase().includes(q) ||
            i.squad.toLowerCase().includes(q) ||
            (i.assignee?.name.toLowerCase().includes(q) ?? false)
        )
      : INCIDENTS;
    return pool.slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search incidents"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by incident, service, squad, or owner…"
            aria-label="Search incidents"
            className={`h-12 flex-1 rounded bg-transparent text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close search</span>
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.map((incident) => (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(incident.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
              >
                <SeverityBadge severity={incident.severity} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-zinc-50">{incident.title}</span>
                  <span className="block truncate text-xs text-zinc-400">
                    {incident.service} &middot; {COLUMN_META[incident.column].label}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-zinc-400">No matching incidents.</li>}
        </ul>
      </div>
    </div>
  );
}
