"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../utils";
import { useOps } from "../context";
import { SHIPMENTS, getCarrier } from "../data";
import { ModeIcon, StatusPill } from "./ui";

/**
 * ⌘K command palette. Global keydown listener lives here (mounted once in
 * Shell) so the shortcut works from anywhere on the page, not just while the
 * search trigger has focus. Selecting a result drives the same selection
 * state the rail rows and detail pane read from — palette, rail, chart and
 * right pane all stay in sync through one source of truth.
 */
export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setSelectedShipmentId, selectedShipmentId } = useOps();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset the query + selection whenever the palette transitions from closed
  // to open — adjusted during render (React's documented pattern for
  // resetting state on a change) rather than in an effect, since setting
  // state synchronously inside an effect body is disallowed by the repo's
  // lint config (react-hooks/set-state-in-effect).
  const [prevOpen, setPrevOpen] = useState(paletteOpen);
  if (paletteOpen !== prevOpen) {
    setPrevOpen(paletteOpen);
    if (paletteOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? SHIPMENTS.filter(
          (s) =>
            s.id.toLowerCase().includes(q) ||
            s.originCity.toLowerCase().includes(q) ||
            s.destCity.toLowerCase().includes(q) ||
            s.originCode.toLowerCase().includes(q) ||
            s.destCode.toLowerCase().includes(q) ||
            getCarrier(s.carrierId).name.toLowerCase().includes(q),
        )
      : SHIPMENTS;
    return list.slice(0, 8);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  function handleKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) {
        setSelectedShipmentId(target.id);
        setPaletteOpen(false);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={() => setPaletteOpen(false)} className="absolute inset-0 bg-black/70" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shipment command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-400">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a shipment, lane, or carrier…"
            aria-label="Search shipments"
            aria-activedescendant={results[activeIndex] ? `cmdk-option-${results[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-listbox"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-400"
          />
          <button
            type="button"
            onClick={() => setPaletteOpen(false)}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-400 outline-none transition-colors hover:bg-white/5 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <ul id="cmdk-listbox" role="listbox" aria-label="Shipment results" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-zinc-400">No shipments match &ldquo;{query}&rdquo;.</li>}
          {results.map((s, i) => {
            const carrier = getCarrier(s.carrierId);
            return (
              <li key={s.id}>
                <button
                  id={`cmdk-option-${s.id}`}
                  type="button"
                  role="option"
                  aria-selected={s.id === selectedShipmentId}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    setSelectedShipmentId(s.id);
                    setPaletteOpen(false);
                  }}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left outline-none transition-colors",
                    i === activeIndex ? "bg-rose-500/10 ring-1 ring-inset ring-rose-500/30" : "hover:bg-white/5",
                  )}
                >
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-zinc-300">
                    <ModeIcon mode={s.mode} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-zinc-100">
                      {s.id} · {s.originCode} → {s.destCode}
                    </span>
                    <span className="block truncate text-[11px] text-zinc-400">{carrier.name}</span>
                  </span>
                  <StatusPill status={s.status} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
