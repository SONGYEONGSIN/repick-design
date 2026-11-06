"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, FileBarChart, Filter, Search, Table2, Workflow } from "lucide-react";
import { TEAM_ORDER, TEAMS, type ViewFilter } from "./data";
import { FOCUS_RING } from "./ui";

/**
 * Navigation-only, with one exception: the two "view filter" actions call the `onSetViewFilter`
 * callback the page passes in, which flips the SAME page-level `viewFilter` state the segmented
 * control above the chart already writes to — a plain view filter (like `period` elsewhere on
 * this route), not an entity-identity selection, so it never fans out a `selectedId`-style state.
 * The per-team "quick jump" entries never touch React state at all: they call `.focus()` on that
 * team's existing chip button in `team-spotlight.tsx` by a predictable DOM id
 * (`team-chip-<id>`). Focusing that button triggers the chip's own `onFocus`, which previews it
 * exactly as clicking it would — a plain DOM call, not a second write path into that widget's
 * click-to-pin state.
 */

interface Action {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  run: () => void;
}

function focusAndScroll(elementId: string) {
  const el = document.getElementById(elementId);
  if (el) {
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.focus();
  }
}

export function CommandPalette({
  open,
  onClose,
  onSetViewFilter,
}: {
  open: boolean;
  onClose: () => void;
  onSetViewFilter: (filter: ViewFilter) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(() => {
    const teamActions: Action[] = TEAM_ORDER.map((id) => ({
      id: `team-${id}`,
      label: TEAMS[id].name,
      hint: `Inspect in Team Spotlight — ${TEAMS[id].category}`,
      icon: Workflow,
      run: () => focusAndScroll(`team-chip-${id}`),
    }));
    return [
      {
        id: "goto-flow",
        label: "Go to Handoff Flow",
        hint: "Jump to the arc diagram",
        icon: Workflow,
        run: () => document.getElementById("handoff-flow")?.scrollIntoView({ block: "start", behavior: "smooth" }),
      },
      {
        id: "goto-spotlight",
        label: "Go to Team Spotlight",
        hint: "Jump to the team roster",
        icon: FileBarChart,
        run: () => document.getElementById("team-spotlight")?.scrollIntoView({ block: "start", behavior: "smooth" }),
      },
      {
        id: "goto-table",
        label: "Go to Handoff Log",
        hint: "Jump to the full sortable table",
        icon: Table2,
        run: () => document.getElementById("handoff-log")?.scrollIntoView({ block: "start", behavior: "smooth" }),
      },
      {
        id: "filter-rework",
        label: "Filter: Rework only",
        hint: "Show only backward handoffs in the diagram",
        icon: Filter,
        run: () => onSetViewFilter("rework"),
      },
      {
        id: "filter-all",
        label: "Filter: All handoffs",
        hint: "Clear the rework-only filter",
        icon: Filter,
        run: () => onSetViewFilter("all"),
      },
      ...teamActions,
    ];
  }, [onSetViewFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q));
  }, [actions, query]);

  // Reset active index when the query changes, and reset query+index when the palette opens.
  // Adjusted during render (compared against the previous value) rather than in a useEffect body.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
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
        const action = filtered[activeIndex];
        if (action) {
          action.run();
          onClose();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, filtered, activeIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl motion-safe:animate-[rise_150ms_ease-out]">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams or actions…"
            aria-label="Search teams or actions"
            className={`h-12 min-w-0 flex-1 rounded-md bg-transparent font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <kbd className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-normal text-[11px] text-zinc-500">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-1.5" role="listbox" aria-label="Results">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center font-normal text-sm text-zinc-500">No matches for “{query}”.</li>
          ) : (
            filtered.map((action, i) => (
              <li key={action.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    action.run();
                    onClose();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left ${FOCUS_RING} ${
                    i === activeIndex ? "bg-emerald-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <action.icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-sm text-zinc-900">{action.label}</span>
                    <span className="block truncate font-normal text-xs text-zinc-500">{action.hint}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center gap-1.5 border-t border-zinc-200 px-3 py-2 font-normal text-xs text-zinc-500">
          <Command className="h-3 w-3" aria-hidden="true" />
          <span>Team entries focus their roster chip — they never pin it for you.</span>
        </div>
      </div>
    </div>
  );
}
