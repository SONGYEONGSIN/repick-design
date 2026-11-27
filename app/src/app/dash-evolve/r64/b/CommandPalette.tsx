"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Search, X, CornerDownLeft, LayoutGrid, UserCheck, Filter } from "lucide-react";
import { TECHNICIANS, VIEW_LABEL, getTechUtilization, pctFmt, type BoardView, type StatusFilter, type TechnicianId } from "./data";
import { FOCUS_RING } from "./ui";

interface Command {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

const STATUS_FILTER_LABEL: Record<StatusFilter, string> = {
  all: "All jobs",
  scheduled: "Scheduled jobs",
  active: "Active jobs",
  completed: "Completed jobs",
};

export function CommandPalette({
  open,
  onClose,
  onSwitchView,
  onSetStatusFilter,
  onPinTechnician,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  onSwitchView: (view: BoardView) => void;
  onSetStatusFilter: (filter: StatusFilter) => void;
  onPinTechnician: (id: TechnicianId) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Reset query + selection on a closed -> open transition, and reset selection whenever the query
  // changes — both applied during render (React's documented pattern for resetting state on a
  // prop/derived change) rather than inside an effect body, so there is no `set-state-in-effect`.
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

  const commands: Command[] = useMemo(
    () => [
      { id: "view-board", group: "Switch view", label: VIEW_LABEL.board, hint: "Technician columns, today's jobs", run: () => onSwitchView("board") },
      { id: "view-calendar", group: "Switch view", label: VIEW_LABEL.calendar, hint: "Day timeline, 7a–6p", run: () => onSwitchView("calendar") },
      ...(["all", "scheduled", "active", "completed"] as StatusFilter[]).map((f) => ({
        id: `filter-${f}`,
        group: "Filter jobs",
        label: STATUS_FILTER_LABEL[f],
        run: () => onSetStatusFilter(f),
      })),
      ...TECHNICIANS.map((tech) => {
        const util = getTechUtilization(tech);
        return {
          id: `pin-${tech.id}`,
          group: "Pin technician",
          label: tech.name,
          hint: `${tech.role} · ${pctFmt.format(util.utilization)} utilized`,
          run: () => onPinTechnician(tech.id),
        };
      }),
    ],
    [onSwitchView, onSetStatusFilter, onPinTechnician],
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

  function groupIcon(group: string) {
    if (group === "Switch view") return LayoutGrid;
    if (group === "Filter jobs") return Filter;
    return UserCheck;
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
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            placeholder="Switch view, filter jobs, or pin a technician…"
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
              const Icon = groupIcon(cmd.group);
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
                      isActive ? "bg-green-50 text-green-800" : "text-zinc-700"
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
