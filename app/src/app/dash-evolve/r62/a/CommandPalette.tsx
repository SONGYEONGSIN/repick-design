"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Search, X, CornerDownLeft, LayoutGrid, CalendarDays } from "lucide-react";
import { DAYS_IN_MONTH, TODAY_DAY, VIEW_LABEL, getDayStats, usdCompactFmt, type ViewMode } from "./data";
import { FOCUS_RING } from "./ui";

interface Command {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onSwitchView,
  onSelectDay,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  onSwitchView: (view: ViewMode) => void;
  onSelectDay: (day: number) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Reset query + selection on a closed -> open transition, and reset selection whenever the query
  // changes — both applied during render (React's documented pattern for resetting state on a
  // prop/derived change) rather than inside an effect body.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const busyDays = useMemo(
    () => Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).filter((d) => getDayStats(d).activeCount > 0),
    [],
  );

  const commands: Command[] = useMemo(
    () => [
      { id: "view-month", group: "Switch view", label: VIEW_LABEL.month, hint: "Full month grid", run: () => onSwitchView("month") },
      { id: "view-week", group: "Switch view", label: VIEW_LABEL.week, hint: "Selected week, by room", run: () => onSwitchView("week") },
      { id: "view-agenda", group: "Switch view", label: VIEW_LABEL.agenda, hint: "Chronological list", run: () => onSwitchView("agenda") },
      { id: "day-today", group: "Jump to day", label: `November ${TODAY_DAY} (today)`, run: () => onSelectDay(TODAY_DAY) },
      ...busyDays
        .filter((d) => d !== TODAY_DAY)
        .map((d) => {
          const stats = getDayStats(d);
          return {
            id: `day-${d}`,
            group: "Jump to day",
            label: `November ${d}`,
            hint: `${stats.activeCount} ${stats.activeCount === 1 ? "booking" : "bookings"} · ${usdCompactFmt.format(stats.revenue)}`,
            run: () => onSelectDay(d),
          };
        }),
    ],
    [onSwitchView, onSelectDay, busyDays],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const activeId = filtered.length ? `${listboxId}-option-${activeIndex}` : undefined;

  function runActive() {
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    cmd.run();
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  let groupCursor = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full min-w-0 max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex h-11 min-w-0 items-center gap-2 border-b border-zinc-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            placeholder="Switch view or jump to a day…"
            className={`h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button
            type="button"
            aria-label="Close command palette"
            onClick={onClose}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul id={listboxId} role="listbox" aria-label="Commands" className="max-h-80 min-w-0 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No matches.</li>
          ) : (
            filtered.map((cmd, index) => {
              const showGroupHeader = cmd.group !== groupCursor;
              groupCursor = cmd.group;
              const isActive = index === activeIndex;
              const Icon = cmd.group === "Switch view" ? LayoutGrid : CalendarDays;
              return (
                <li key={cmd.id} className="min-w-0">
                  {showGroupHeader ? (
                    <div className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      {cmd.group}
                    </div>
                  ) : null}
                  <div
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      cmd.run();
                      onClose();
                    }}
                    className={`flex h-9 min-w-0 cursor-pointer items-center gap-2 rounded-md px-2.5 text-sm ${
                      isActive ? "bg-orange-50 text-orange-700" : "text-zinc-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                    {cmd.hint ? <span className="shrink-0 truncate text-xs text-zinc-500">{cmd.hint}</span> : null}
                    {isActive ? <CornerDownLeft className="h-3 w-3 shrink-0 text-zinc-500" aria-hidden="true" /> : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
