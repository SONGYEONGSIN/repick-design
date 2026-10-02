"use client";

import { ArrowDownToLine, Command, Pin, SlidersHorizontal, Workflow } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Period, StageId } from "./data";
import { PERIOD_OPTIONS, STAGES } from "./data";
import { FOCUS_RING } from "./ui";

interface Action {
  id: string;
  group: string;
  label: string;
  hint: string;
  icon: typeof Pin;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onPinStage,
  onSetPeriod,
}: {
  open: boolean;
  onClose: () => void;
  onPinStage: (id: StageId) => void;
  onSetPeriod: (p: Period) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(
    () => [
      ...STAGES.map((s) => ({
        id: `pin-${s.id}`,
        group: "Pin funnel stage",
        label: s.name,
        hint: "Reveals its cohort breakdown below the funnel",
        icon: Pin,
        run: () => onPinStage(s.id),
      })),
      ...PERIOD_OPTIONS.map((p) => ({
        id: `period-${p.id}`,
        group: "Change period",
        label: p.label,
        hint: "Recomputes the funnel and KPI strip",
        icon: SlidersHorizontal,
        run: () => onSetPeriod(p.id),
      })),
      {
        id: "jump-cohort",
        group: "Navigate",
        label: "Jump to cohort table",
        hint: "Scrolls to the pinned stage's breakdown",
        icon: ArrowDownToLine,
        run: () => document.getElementById("cohort-section")?.scrollIntoView({ block: "start" }),
      },
      {
        id: "jump-funnel",
        group: "Navigate",
        label: "Jump to funnel",
        hint: "Scrolls to the top of the console",
        icon: Workflow,
        run: () => document.getElementById("funnel-heading")?.scrollIntoView({ block: "start" }),
      },
    ],
    [onPinStage, onSetPeriod],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery("");
  }, [open]);

  function runAction(a: Action) {
    a.run();
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const a = filtered[activeIndex];
      if (a) runAction(a);
    }
  }

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 ${FOCUS_RING}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <Command size={16} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pin a stage, change period, jump to a section…"
            aria-label="Command palette search"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-activedescendant={filtered[activeIndex]?.id}
            className={`h-12 w-full min-w-0 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <kbd className="flex-shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
            Esc
          </kbd>
        </div>
        <div id="command-palette-listbox" className="max-h-[22rem] overflow-y-auto p-2" role="listbox" aria-label="Actions">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-zinc-400">No matching action.</p>
          ) : (
            filtered.map((a, i) => {
              const showGroup = a.group !== lastGroup;
              lastGroup = a.group;
              const Icon = a.icon;
              const active = i === activeIndex;
              return (
                <div key={a.id}>
                  {showGroup ? (
                    <div className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                      {a.group}
                    </div>
                  ) : null}
                  <button
                    id={a.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => runAction(a)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left motion-safe:transition-colors ${
                      active ? "bg-violet-500/15" : "hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-zinc-200">{a.label}</span>
                      <span className="block truncate text-[11px] text-zinc-400">{a.hint}</span>
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
