"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, Command, FileBarChart, GitCompare, Search } from "lucide-react";
import { VENDOR_LIST } from "./data";
import { FOCUS_RING } from "./ui";

/** `outline-none` with nothing to replace it leaves the search input with zero visible focus
 *  indicator, which the automated gate cannot catch (a modal only ever reaches this state after
 *  the person opens it). `FOCUS_RING` below replaces the suppressed default outline rather than
 *  stacking on top of it, so Tab-focusing this field still produces a real, visible change. */

/**
 * Navigation-only. Selecting a vendor here does not set any shared "selected vendor" state — it
 * calls `.focus()` on that vendor's existing row button inside `VendorComparisonPanel` by a
 * predictable DOM id (`rail-vendor-<id>`). Focusing that button triggers the panel's own
 * hover-equivalent preview (see that file), exactly as if the person had tabbed to it themselves.
 * No id, prop or piece of React state is threaded between this component and the panel: this is
 * a plain DOM call, not a second consumer reacting to a shared selection, so the command palette
 * cannot regress the comparison panel's selection model into a shared-id pattern.
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

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(() => {
    const vendorActions: Action[] = VENDOR_LIST.map((v) => ({
      id: `vendor-${v.id}`,
      label: v.name,
      hint: `Inspect in Vendor Comparison — ${v.category}`,
      icon: GitCompare,
      run: () => focusAndScroll(`rail-vendor-${v.id}`),
    }));
    return [
      {
        id: "goto-comparison",
        label: "Go to Vendor Comparison",
        hint: "Jump to the parallel-coordinates chart",
        icon: GitCompare,
        run: () => document.getElementById("vendor-comparison")?.scrollIntoView({ block: "start", behavior: "smooth" }),
      },
      {
        id: "goto-renewals",
        label: "Go to Renewals Calendar",
        hint: "Not part of this prototype view",
        icon: CalendarClock,
        run: () => {},
      },
      {
        id: "goto-reports",
        label: "Go to Spend Reports",
        hint: "Not part of this prototype view",
        icon: FileBarChart,
        run: () => {},
      },
      ...vendorActions,
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q));
  }, [actions, query]);

  // Reset active index when the query changes, and reset query+index when the palette opens.
  // Adjusted during render (compared against the previous value) rather than in a useEffect body,
  // which avoids the cascading-render setState-in-effect pattern while staying synchronous with
  // the prop/state change it reacts to.
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
            placeholder="Search vendors or actions…"
            aria-label="Search vendors or actions"
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
                    i === activeIndex ? "bg-indigo-50" : "hover:bg-zinc-50"
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
          <span>Navigation only — selecting a vendor focuses its row, it does not pin it.</span>
        </div>
      </div>
    </div>
  );
}
