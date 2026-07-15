"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { MEMBERS, STATUS_META, TASKS, WEEKS } from "../lib/data";
import { formatDayRange } from "../lib/format";

export default function CommandPalette({
  open,
  onClose,
  onSelectTask,
}: {
  open: boolean;
  onClose: () => void;
  onSelectTask: (taskId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Adjust state during render when `open` or `query` change, rather than in
  // an effect — see https://react.dev/learn/you-might-not-need-an-effect.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQuery("");
  }
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withMember = TASKS.map((t) => ({
      task: t,
      member: MEMBERS.find((m) => m.id === t.memberId)!,
    }));
    if (!q) return withMember.slice(0, 8);
    return withMember
      .filter(
        ({ task, member }) =>
          task.title.toLowerCase().includes(q) || member.name.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  // Move focus into the search field when the palette opens (DOM side effect,
  // not a state update, so this stays in an effect).
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  function commit(taskId: string) {
    onSelectTask(taskId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="palette-title"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            const r = results[activeIndex];
            if (r) commit(r.task.id);
          }
        }}
      >
        <h2 id="palette-title" className="sr-only">
          Jump to task
        </h2>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks by title or assignee…"
            className="h-11 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-indigo-500"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[activeIndex] ? `palette-item-${results[activeIndex].task.id}` : undefined}
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-300 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">
            Esc
          </kbd>
        </div>

        <ul id="palette-results" role="listbox" aria-label="Task results" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No tasks match &ldquo;{query}&rdquo;</li>
          ) : (
            results.map(({ task, member }, i) => {
              const meta = STATUS_META[task.status];
              const active = i === activeIndex;
              return (
                <li key={task.id} id={`palette-item-${task.id}`} role="option" aria-selected={active}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => commit(task.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left ${
                      active ? "bg-indigo-50" : "hover:bg-zinc-50"
                    }`}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${meta.swatch}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-zinc-900">{task.title}</span>
                      <span className="block truncate text-xs text-zinc-500">
                        {member.name} · {formatDayRange(task.startDay, task.durationDays, WEEKS)}
                      </span>
                    </span>
                    {active ? <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-indigo-500" aria-hidden="true" /> : null}
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
