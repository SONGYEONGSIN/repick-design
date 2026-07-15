"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { DELIVERY_HISTORY, VEHICLES } from "./data";
import { VEHICLE_STATUS_META, DELIVERY_STATUS_META } from "./status-meta";
import { Badge } from "./ui";
import { cn, FOCUS_RING } from "./cn";

interface ResultItem {
  kind: "vehicle" | "delivery";
  id: string;
  title: string;
  subtitle: string;
}

export function CommandPalette({
  open,
  onClose,
  onSelectVehicle,
  onSelectDelivery,
}: {
  open: boolean;
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
  onSelectDelivery: (id: string) => void;
}) {
  // Mounting/unmounting the dialog (rather than resetting its state in an
  // effect) gives it fresh `query`/`activeIndex` state every time it opens.
  if (!open) return null;
  return (
    <PaletteDialog onClose={onClose} onSelectVehicle={onSelectVehicle} onSelectDelivery={onSelectDelivery} />
  );
}

function PaletteDialog({
  onClose,
  onSelectVehicle,
  onSelectDelivery,
}: {
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
  onSelectDelivery: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const vehicleResults: ResultItem[] = VEHICLES.filter(
      (v) => !q || v.id.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q),
    ).map((v) => ({
      kind: "vehicle",
      id: v.id,
      title: v.id,
      subtitle: `${v.driver} · ${VEHICLE_STATUS_META[v.status].label}`,
    }));
    const deliveryResults: ResultItem[] = DELIVERY_HISTORY.filter(
      (d) => !q || d.id.toLowerCase().includes(q) || d.customer.toLowerCase().includes(q),
    ).map((d) => ({
      kind: "delivery",
      id: d.id,
      title: d.id,
      subtitle: `${d.customer} · ${DELIVERY_STATUS_META[d.status].label}`,
    }));
    return [...vehicleResults, ...deliveryResults].slice(0, 8);
  }, [query]);

  // Reset the highlighted row whenever the query changes — adjusted during
  // render (React's recommended pattern) instead of in a separate effect.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  function commit(item: ResultItem) {
    if (item.kind === "vehicle") onSelectVehicle(item.id);
    else onSelectDelivery(item.id);
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
      if (item) commit(item);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search vehicles and deliveries"
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
            placeholder="Search by vehicle, driver, delivery ID or customer…"
            aria-label="Search vehicles and deliveries"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
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
        <ul id="palette-results" role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto p-2">
          {results.map((item, i) => {
            const meta =
              item.kind === "vehicle"
                ? VEHICLE_STATUS_META[VEHICLES.find((v) => v.id === item.id)!.status]
                : DELIVERY_STATUS_META[DELIVERY_HISTORY.find((d) => d.id === item.id)!.status];
            return (
              <li key={`${item.kind}-${item.id}`} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => commit(item)}
                  className={cn(
                    FOCUS_RING,
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left",
                    i === activeIndex ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium tabular-nums text-zinc-100">
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-zinc-400">{item.subtitle}</span>
                  </span>
                  <Badge meta={meta} className="shrink-0" />
                </button>
              </li>
            );
          })}
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-400">No matches</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
