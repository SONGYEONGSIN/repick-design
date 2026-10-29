"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, CalendarDays, ClipboardList, Pin, PinOff, Download, Store, Gauge, type LucideIcon } from "lucide-react";
import { METRIC_META, TODAY_ISO, WAREHOUSES, type Metric, type WarehouseId } from "./data";
import { cn, FOCUS_RING } from "./ui";

interface Action {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  currentWarehouseId,
  onSelectWarehouse,
  currentMetric,
  onSelectMetric,
  onPinToday,
  onClearPin,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  currentWarehouseId: WarehouseId;
  onSelectWarehouse: (id: WarehouseId) => void;
  currentMetric: Metric;
  onSelectMetric: (metric: Metric) => void;
  onPinToday: () => void;
  onClearPin: () => void;
  onExport: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resets search + selection whenever the palette transitions to open.
  // Adjusted during render (React's documented pattern for state tracking a
  // prop) rather than in an effect, so there's no synchronous
  // setState-in-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const actions = useMemo<Action[]>(() => {
    const navActions: Action[] = [
      { id: "nav-calendar", label: "Go to shipping calendar", hint: "Section", icon: CalendarDays, run: () => onNavigate("shipping-calendar") },
      { id: "nav-exceptions", label: "Go to exceptions ledger", hint: "Section", icon: ClipboardList, run: () => onNavigate("exceptions-ledger") },
    ];
    const warehouseActions: Action[] = WAREHOUSES.filter((w) => w.id !== currentWarehouseId).map((w) => ({
      id: `warehouse-${w.id}`,
      label: `Switch to ${w.name}`,
      hint: w.region,
      icon: Store,
      run: () => onSelectWarehouse(w.id),
    }));
    const metricActions: Action[] = (["shipped", "onTime"] as Metric[])
      .filter((m) => m !== currentMetric)
      .map((m) => ({
        id: `metric-${m}`,
        label: `Show calendar by ${METRIC_META[m].label.toLowerCase()}`,
        hint: "View",
        icon: Gauge,
        run: () => onSelectMetric(m),
      }));
    return [
      ...navActions,
      ...warehouseActions,
      ...metricActions,
      { id: "pin-today", label: `Pin today — ${TODAY_ISO}`, hint: "Day detail", icon: Pin, run: onPinToday },
      { id: "clear-pin", label: "Clear pinned day", hint: "Reset", icon: PinOff, run: onClearPin },
      { id: "export", label: "Export shipping calendar as CSV", hint: "Download", icon: Download, run: onExport },
    ];
  }, [currentWarehouseId, currentMetric, onNavigate, onSelectWarehouse, onSelectMetric, onPinToday, onClearPin, onExport]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  // The one genuine side effect here — moving DOM focus — doesn't call
  // setState, so it isn't the pattern the lint rule flags.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  function runAction(action: Action | undefined) {
    if (!action) return;
    action.run();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="fixed inset-0 bg-black/40" />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4">
          <Command className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                runAction(filtered[activeIndex]);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Type a command or search…"
            aria-label="Command palette search"
            aria-activedescendant={filtered[activeIndex]?.id}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            className={cn("h-12 w-full rounded-md bg-transparent text-sm font-normal text-zinc-900 placeholder:text-zinc-500", FOCUS_RING)}
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-sans text-[11px] font-medium text-zinc-500 sm:inline">Esc</kbd>
        </div>
        <ul id="command-palette-list" role="listbox" className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 && <li className="px-4 py-6 text-center text-sm font-normal text-zinc-500">No matching commands.</li>}
          {filtered.map((action, index) => {
            const ActionIcon = action.icon;
            const active = index === activeIndex;
            return (
              <li key={action.id} id={action.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runAction(action)}
                  className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-normal transition-colors motion-reduce:transition-none", FOCUS_RING, active ? "bg-emerald-50 text-emerald-800" : "text-zinc-700")}
                >
                  <ActionIcon className={cn("h-4 w-4 shrink-0", active ? "text-emerald-700" : "text-zinc-500")} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{action.label}</span>
                  <span className="shrink-0 text-xs font-normal text-zinc-500">{action.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
