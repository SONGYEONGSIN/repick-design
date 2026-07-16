"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
  CircleEllipsis,
  CornerDownLeft,
  Search,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  XCircle,
} from "lucide-react";
import { ISSUES, IssueStatus, Priority, STATUS_META, memberById } from "../lib/data";

const STATUS_ICON: Record<IssueStatus, typeof Circle> = {
  backlog: CircleDashed,
  todo: Circle,
  "in-progress": CircleDot,
  "in-review": CircleEllipsis,
  done: CheckCircle2,
  cancelled: XCircle,
};

const PRIORITY_ICON: Record<Priority, typeof Circle> = {
  urgent: AlertTriangle,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
  none: SignalZero,
};

export default function CommandPalette({
  open,
  onClose,
  onSelectIssue,
}: {
  open: boolean;
  onClose: () => void;
  onSelectIssue: (issueId: string) => void;
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
    if (!q) return ISSUES.slice(0, 8);
    return ISSUES.filter(
      (issue) =>
        issue.title.toLowerCase().includes(q) ||
        issue.id.toLowerCase().includes(q) ||
        memberById(issue.assigneeId ?? undefined)?.name.toLowerCase().includes(q)
    ).slice(0, 8);
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

  function commit(issueId: string) {
    onSelectIssue(issueId);
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
            if (r) commit(r.id);
          }
        }}
      >
        <h2 id="palette-title" className="sr-only">
          Jump to issue
        </h2>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues by title, ID, or assignee…"
            className="h-11 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-indigo-500"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[activeIndex] ? `palette-item-${results[activeIndex].id}` : undefined}
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-300 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">
            Esc
          </kbd>
        </div>

        <ul id="palette-results" role="listbox" aria-label="Issue results" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No issues match &ldquo;{query}&rdquo;</li>
          ) : (
            results.map((issue, i) => {
              const statusMeta = STATUS_META[issue.status];
              const StatusIcon = STATUS_ICON[issue.status];
              const PriorityIcon = PRIORITY_ICON[issue.priority];
              const active = i === activeIndex;
              const assignee = memberById(issue.assigneeId ?? undefined);
              return (
                <li key={issue.id} id={`palette-item-${issue.id}`} role="option" aria-selected={active}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => commit(issue.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left ${
                      active ? "bg-indigo-50" : "hover:bg-zinc-50"
                    }`}
                  >
                    <StatusIcon className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                    <PriorityIcon
                      className={`h-3.5 w-3.5 shrink-0 ${issue.priority === "urgent" ? "text-rose-600" : "text-zinc-400"}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-zinc-900">
                        <span className="tabular-nums text-zinc-500">{issue.id}</span> {issue.title}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {statusMeta.label} · {assignee?.name ?? "Unassigned"}
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
