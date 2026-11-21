"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Server, Siren, X } from "lucide-react";
import { FOCUS_RING } from "./ui";
import { SERVICES, INCIDENTS } from "./data";

interface Result {
  id: string;
  kind: "service" | "incident";
  title: string;
  subtitle: string;
  serviceId: string;
}

const ALL_RESULTS: Result[] = [
  ...SERVICES.map((s) => ({ id: `svc-${s.id}`, kind: "service" as const, title: s.name, subtitle: `${s.team} · ${s.region}`, serviceId: s.id })),
  ...INCIDENTS.map((i) => ({ id: `inc-${i.id}`, kind: "incident" as const, title: i.title, subtitle: `${i.id} · ${i.severity}`, serviceId: i.serviceId })),
];

export function CommandPalette({
  open,
  onClose,
  onSelectService,
}: {
  open: boolean;
  onClose: () => void;
  onSelectService: (serviceId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = "command-palette-listbox";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q.length === 0 ? ALL_RESULTS : ALL_RESULTS.filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q));
    return base.slice(0, 8);
  }, [query]);

  // Reset the query and active index when the palette transitions to open.
  // Adjusted during render (React's documented pattern for resetting state in
  // response to a prop change) rather than inside an effect, since setState
  // belongs in an event handler or render, not synchronously in an effect body.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  useEffect(() => {
    if (open) {
      // Focus the input on open so keyboard users land straight in the searchable field.
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  function choose(r: Result) {
    onSelectService(r.serviceId);
    onClose();
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) choose(r);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      {/* Mouse-only backdrop dismiss; Escape (wired in the input below) is the keyboard equivalent,
          so this is deliberately out of the tab order rather than needing a full-screen focus ring. */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a service or incident"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 px-3">
          <Search className="h-4 w-4 flex-shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={results[activeIndex] ? `cmdk-option-${results[activeIndex].id}` : undefined}
            aria-autocomplete="list"
            aria-label="Search services and incidents"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a service or incident…"
            className={`h-11 flex-1 min-w-0 border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul id={listboxId} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-zinc-500">No matches for &ldquo;{query}&rdquo;</li>}
          {results.map((r, i) => {
            const isActive = i === activeIndex;
            const Icon = r.kind === "service" ? Server : Siren;
            return (
              <li
                key={r.id}
                id={`cmdk-option-${r.id}`}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => choose(r)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${isActive ? "bg-green-50" : ""}`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-green-700" : "text-zinc-400"}`} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate font-medium text-zinc-900">{r.title}</span>
                <span className="flex-shrink-0 truncate text-xs text-zinc-500">{r.subtitle}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
