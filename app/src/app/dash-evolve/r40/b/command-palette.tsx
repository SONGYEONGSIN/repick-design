"use client";

import { Gauge, Pin, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { VendorDef, VendorId } from "./data";
import type { ViewMode } from "./format";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: typeof Pin;
  run: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: VendorDef[];
  onPin: (id: VendorId) => void;
  view: ViewMode;
  onSetView: (view: ViewMode) => void;
  onOpenDrawer: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  vendors,
  onPin,
  view,
  onSetView,
  onOpenDrawer,
}: CommandPaletteProps) {
  const headingId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const commands: Command[] = useMemo(() => {
    const pinCommands = vendors.map((vendor) => ({
      id: `pin-${vendor.id}`,
      label: `Pin ${vendor.shortName}`,
      hint: "Supplier",
      icon: Pin,
      run: () => onPin(vendor.id),
    }));
    const viewCommands: Command[] = [
      {
        id: "view-raw",
        label: "Switch to Raw Score view",
        hint: "View",
        icon: Gauge,
        run: () => onSetView("raw"),
      },
      {
        id: "view-percentile",
        label: "Switch to Percentile Rank view",
        hint: "View",
        icon: SlidersHorizontal,
        run: () => onSetView("percentile"),
      },
    ];
    const drawerCommand: Command = {
      id: "open-drawer",
      label: "Open full scorecard for the pinned supplier",
      hint: "Detail",
      icon: Search,
      run: onOpenDrawer,
    };
    return [...pinCommands, ...viewCommands.filter((c) => c.id !== `view-${view}`), drawerCommand];
  }, [vendors, onPin, onSetView, view, onOpenDrawer]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) {
          cmd.run();
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, filtered, activeIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/30"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <h2 id={headingId} className="sr-only">
          Command palette
        </h2>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Pin a supplier, switch view, open scorecard…"
            aria-label="Command palette search"
            className="w-full bg-transparent text-sm font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline">
            Esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto py-1.5" role="listbox" aria-label="Commands">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm font-normal text-zinc-500">
              No matching commands.
            </li>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              const active = i === activeIndex;
              return (
                <li key={cmd.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      cmd.run();
                      onClose();
                    }}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-normal motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                      active ? "bg-rose-50 text-rose-700" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                    <span className="shrink-0 text-xs font-normal text-zinc-600">{cmd.hint}</span>
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
