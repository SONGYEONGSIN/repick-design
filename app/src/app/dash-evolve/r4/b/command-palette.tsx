"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { SERVICES } from "./data";
import { SERVICE_STATUS_META } from "./status-meta";
import { Badge } from "./ui";
import { cn, FOCUS_RING } from "./cn";

export function CommandPalette({
  open,
  onClose,
  onSelectService,
}: {
  open: boolean;
  onClose: () => void;
  onSelectService: (id: string) => void;
}) {
  // Mounting/unmounting gives the dialog fresh query/activeIndex state each open.
  if (!open) return null;
  return <PaletteDialog onClose={onClose} onSelectService={onSelectService} />;
}

function PaletteDialog({
  onClose,
  onSelectService,
}: {
  onClose: () => void;
  onSelectService: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.team.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  function commit(id: string) {
    onSelectService(id);
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) commit(item.id);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search services"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by service, id or team…"
            aria-label="Search services"
            role="combobox"
            aria-expanded="true"
            aria-controls="wardline-palette-results"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className={cn(FOCUS_RING, "shrink-0 rounded p-1 text-zinc-400 hover:bg-white/5")}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <ul id="wardline-palette-results" role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto p-2">
          {results.map((service, i) => (
            <li key={service.id} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(service.id)}
                className={cn(
                  FOCUS_RING,
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left",
                  i === activeIndex ? "bg-white/10" : "hover:bg-white/5",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium tabular-nums text-zinc-100">
                    {service.name}
                  </span>
                  <span className="block truncate text-xs text-zinc-400">
                    {service.id} · {service.team}
                  </span>
                </span>
                <Badge meta={SERVICE_STATUS_META[service.status]} className="shrink-0" />
              </button>
            </li>
          ))}
          {results.length === 0 ? <li className="px-3 py-6 text-center text-sm text-zinc-400">No matches</li> : null}
        </ul>
      </div>
    </div>
  );
}
