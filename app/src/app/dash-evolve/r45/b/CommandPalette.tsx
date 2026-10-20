"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, Download, LayoutGrid, Pin, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { REGIONS, regionTotal, type MekkoView } from "./data";
import { formatArr } from "./format";
import { FOCUS_RING, cn } from "./ui";

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
  onSelectRegion,
  onSetView,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  onSelectRegion: (id: string) => void;
  onSetView: (view: MekkoView) => void;
  onExport: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const actions = useMemo<Action[]>(() => {
    const regionActions: Action[] = REGIONS.map((r) => ({
      id: `region-${r.id}`,
      label: `Pin ${r.name} to the spotlight card`,
      hint: formatArr(regionTotal(r)),
      icon: Pin,
      run: () => onSelectRegion(r.id),
    }));
    return [
      { id: "view-share", label: "Switch board to Share mix view", hint: "View", icon: LayoutGrid, run: () => onSetView("share") },
      { id: "view-scale", label: "Switch board to Revenue scale view", hint: "View", icon: SlidersHorizontal, run: () => onSetView("scale") },
      ...regionActions,
      { id: "export", label: "Export region × tier breakdown as CSV", hint: "Download", icon: Download, run: onExport },
    ];
  }, [onSelectRegion, onSetView, onExport]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  if (!open) return null;

  function runAction(action: Action | undefined) {
    if (!action) return;
    action.run();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className={cn("fixed inset-0 bg-zinc-950/70", FOCUS_RING)} />
      <div role="dialog" aria-modal="true" aria-label="Search regions, tiers and actions" className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4">
          <Command className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
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
              }
            }}
            placeholder="Type a region, tier or action…"
            aria-label="Command palette search"
            aria-activedescendant={filtered[activeIndex]?.id}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            className={cn("h-12 w-full rounded-md bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400", FOCUS_RING)}
          />
          <kbd className="hidden shrink-0 rounded border border-white/10 bg-zinc-950 px-1.5 py-0.5 font-normal text-[11px] text-zinc-400 sm:inline">Esc</kbd>
        </div>
        <ul id="command-palette-list" role="listbox" className="max-h-72 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center font-normal text-sm text-zinc-400">No matching commands.</li>
          ) : (
            filtered.map((action, index) => {
              const Icon = action.icon;
              const active = index === activeIndex;
              return (
                <li key={action.id} id={action.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runAction(action)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-normal text-sm motion-safe:transition-colors",
                      FOCUS_RING,
                      active ? "bg-teal-500/10 text-teal-300" : "text-zinc-300",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-teal-400" : "text-zinc-400")} aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{action.label}</span>
                    <span className="shrink-0 font-normal text-xs text-zinc-400">{action.hint}</span>
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
