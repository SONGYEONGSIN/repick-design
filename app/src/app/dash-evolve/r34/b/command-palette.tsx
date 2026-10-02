"use client";

import { useEffect, useId, useMemo, useRef, useState, type RefObject } from "react";
import { Building2, CalendarClock, Command, Search } from "lucide-react";
import type { PeriodId, Vendor } from "./data";
import { PERIODS } from "./data";

interface CommandItem {
  id: string;
  group: "Vendors" | "Reporting period";
  label: string;
  hint: string;
  icon: typeof Search;
  run: () => void;
}

/**
 * The ⌘K palette is a second entry point into the same two controls already on the page (vendor
 * overlay toggling and the period segmented control) — it never opens a separate pane or view.
 */
export function CommandPalette({
  open,
  onClose,
  vendors,
  selectedIds,
  onToggleVendor,
  period,
  onSetPeriod,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  vendors: Vendor[];
  selectedIds: string[];
  onToggleVendor: (id: string) => void;
  period: PeriodId;
  onSetPeriod: (p: PeriodId) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevOpen, setPrevOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const items = useMemo<CommandItem[]>(() => {
    const vendorItems: CommandItem[] = vendors.map((v) => ({
      id: `vendor-${v.id}`,
      group: "Vendors",
      label: `${selectedIds.includes(v.id) ? "Remove" : "Add"} ${v.name} from radar overlay`,
      hint: v.category,
      icon: Building2,
      run: () => onToggleVendor(v.id),
    }));
    const periodItems: CommandItem[] = PERIODS.map((p) => ({
      id: `period-${p.id}`,
      group: "Reporting period",
      label: `Switch to ${p.label}`,
      hint: p.id === period ? "Current" : "",
      icon: CalendarClock,
      run: () => onSetPeriod(p.id),
    }));
    return [...vendorItems, ...periodItems];
  }, [vendors, selectedIds, period, onToggleVendor, onSetPeriod]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) {
          item.run();
          onClose();
          triggerRef.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, filtered, activeIndex, onClose, triggerRef]);

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/30 px-4 pt-[12vh]" onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
        triggerRef.current?.focus();
      }
    }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
      >
        <div className="flex h-11 items-center gap-2 border-b border-zinc-200 px-3.5 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-lime-700">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={filtered[activeIndex] ? `${listboxId}-${filtered[activeIndex].id}` : undefined}
            placeholder="Toggle a vendor or switch period…"
            className="h-full flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] text-zinc-500">Esc</kbd>
        </div>
        <ul id={listboxId} role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <li className="px-3.5 py-6 text-center text-sm text-zinc-500">No matching commands.</li>
          )}
          {filtered.map((item, i) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                {showGroup && (
                  <p className="px-3.5 pt-2 pb-1 text-[11px] uppercase tracking-wide text-zinc-500">{item.group}</p>
                )}
                <button
                  id={`${listboxId}-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    item.run();
                    onClose();
                    triggerRef.current?.focus();
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 ${
                    i === activeIndex ? "bg-lime-50 text-zinc-900" : "text-zinc-700"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.hint && <span className="shrink-0 text-xs text-zinc-500">{item.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-1.5 border-t border-zinc-200 px-3.5 py-2 text-[11px] text-zinc-500">
          <Command aria-hidden="true" className="h-3 w-3" />
          <span>K to toggle this palette anytime</span>
        </div>
      </div>
    </div>
  );
}
