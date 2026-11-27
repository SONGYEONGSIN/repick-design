"use client";

import { useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Search, X, CalendarDays, Building2, ListFilter } from "lucide-react";
import { TRIALS, formatDayShort, type StatusFilter, type TrialId } from "./data";
import { cx, FOCUS_RING } from "./ui";

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: typeof CalendarDays;
  run: () => void;
}

interface CommandPaletteProps {
  onClose: () => void;
  onSwitchTrial: (id: TrialId) => void;
  onSetView: (view: "month" | "week") => void;
  onSelectDay: (day: number) => void;
  onSetStatusFilter: (f: StatusFilter) => void;
  todayDay: number;
  busiestDay: number;
}

export function CommandPalette({ onClose, onSwitchTrial, onSetView, onSelectDay, onSetStatusFilter, todayDay, busiestDay }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const commands = useMemo<Command[]>(
    () => [
      { id: "today", label: `Jump to today — ${formatDayShort(todayDay)}`, icon: CalendarDays, run: () => onSelectDay(todayDay) },
      {
        id: "busiest",
        label: `Jump to busiest day — ${formatDayShort(busiestDay)}`,
        icon: CalendarDays,
        run: () => onSelectDay(busiestDay),
      },
      { id: "month", label: "Switch calendar to month view", icon: CalendarDays, run: () => onSetView("month") },
      { id: "week", label: "Switch calendar to week view", icon: CalendarDays, run: () => onSetView("week") },
      { id: "missed", label: "Filter visit board to missed visits", icon: ListFilter, run: () => onSetStatusFilter("missed") },
      { id: "all-status", label: "Clear visit board status filter", icon: ListFilter, run: () => onSetStatusFilter("all") },
      ...TRIALS.map((trial) => ({
        id: `trial-${trial.id}`,
        label: `Switch trial to ${trial.code}`,
        hint: trial.name,
        icon: Building2,
        run: () => onSwitchTrial(trial.id),
      })),
    ],
    [todayDay, busiestDay, onSelectDay, onSetView, onSetStatusFilter, onSwitchTrial]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q));
  }, [commands, query]);

  // Clamped at read time instead of synced back with an effect: `active` only ever moves through
  // explicit key/mouse handlers below, and this keeps it in range whenever `filtered` shrinks
  // (e.g. the search narrows the list) without a `useEffect` just to mirror derived state.
  const activeIndex = filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1);

  function handleKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, Math.max(0, filtered.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) {
        cmd.run();
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" className="absolute inset-0 bg-zinc-900/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl motion-safe:animate-[rise_0.15s_ease-out] motion-reduce:animate-none"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 focus-within:bg-zinc-50">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={filtered[activeIndex] ? `palette-opt-${filtered[activeIndex].id}` : undefined}
            className="h-14 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
          />
          <button type="button" onClick={onClose} className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100", FOCUS_RING)} aria-label="Close command palette">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul id="palette-listbox" role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-zinc-500">No matching commands.</li>}
          {filtered.map((cmd, idx) => {
            const Icon = cmd.icon;
            const isActive = idx === activeIndex;
            return (
              <li key={cmd.id} id={`palette-opt-${cmd.id}`} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => {
                    cmd.run();
                    onClose();
                  }}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm",
                    isActive ? "bg-lime-50 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50"
                  )}
                >
                  <Icon className={cx("h-4 w-4 shrink-0", isActive ? "text-lime-700" : "text-zinc-400")} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{cmd.label}</span>
                    {cmd.hint && <span className="block truncate text-xs text-zinc-500">{cmd.hint}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
