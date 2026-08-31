"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import type { SupportCase } from "./data";
import { formatAge } from "./data";
import { FOCUS_RING, StatusBadge } from "./ui";

export function CommandPalette({
  open,
  onClose,
  cases,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  cases: SupportCase[];
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases.slice(0, 8);
    return cases
      .filter(
        (c) =>
          c.subject.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.requester.name.toLowerCase().includes(q) ||
          c.requester.company.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [cases, query]);

  if (!open) return null;

  function commit(id: string) {
    onSelect(id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 p-4 pt-[12vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search cases"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
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
            e.preventDefault();
            const target = results[activeIndex];
            if (target) commit(target.id);
          }
        }}
      >
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4 py-3">
          <Search className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={results[activeIndex] ? `${listboxId}-opt-${results[activeIndex].id}` : undefined}
            aria-autocomplete="list"
            aria-label="Search cases by subject, customer, or case ID"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search cases, customers, or case IDs&hellip;"
            className={`min-w-0 flex-1 rounded text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline">
            Esc
          </kbd>
        </div>

        <ul id={listboxId} role="listbox" aria-label="Matching cases" className="max-h-80 overflow-y-auto py-1.5">
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-zinc-500">No cases match &ldquo;{query}&rdquo;.</li>}
          {results.map((c, i) => (
            <li key={c.id} id={`${listboxId}-opt-${c.id}`} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(c.id)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left ${
                  i === activeIndex ? "bg-teal-50" : "hover:bg-zinc-50"
                }`}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums text-zinc-400">{c.id}</span>
                    <span className="truncate text-sm font-medium text-zinc-900">{c.subject}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-500">
                    {c.requester.name} &middot; {c.requester.company} &middot; {formatAge(c.ageHours)}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={c.status} />
                  {i === activeIndex && <CornerDownLeft className="size-3.5 text-teal-600" aria-hidden="true" />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
