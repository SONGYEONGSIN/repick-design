"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CornerDownLeft, X } from "lucide-react";
import { CASES, STATUS_META, formatKrw } from "./data";
import { Badge, FOCUS_LIGHT, cx } from "./ui";

/**
 * ⌘K command palette (bonus interaction). Selecting a result calls `onSelect`, which sets the same
 * lifted `selectedCaseId` that a rail-row click does — this is Mode A (the pin) reached through a
 * second entry point, not a third propagation mode.
 */
export function CommandPalette({ onSelect, onClose }: { onSelect: (id: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CASES;
    return CASES.filter((c) =>
      [c.id, c.itemTitle, c.buyer.name, c.seller.name, c.claimType].some((f) => f.toLowerCase().includes(q)),
    );
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      onSelect(results[activeIndex].id);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/40 px-4 pt-[12vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search cases"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl motion-safe:animate-[rise_150ms_ease-out]"
      >
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search cases, buyers, sellers…"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={cx("rounded p-1 text-zinc-400 hover:text-zinc-700", FOCUS_LIGHT)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul role="listbox" aria-label="Case results" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-zinc-500">No cases match “{query}”.</li>}
          {results.map((c, i) => {
            const meta = STATUS_META[c.status];
            const active = i === activeIndex;
            return (
              <li key={c.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    onSelect(c.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left", active ? "bg-amber-50" : "hover:bg-zinc-50", FOCUS_LIGHT)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-zinc-900">{c.itemTitle}</span>
                    <span className="block truncate text-[11px] tabular-nums text-zinc-500">
                      {c.id} · {c.buyer.name} vs {c.seller.name}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span className="hidden text-[12px] tabular-nums whitespace-nowrap text-zinc-500 sm:inline">{formatKrw(c.amountKrw)}</span>
                    {active && <CornerDownLeft className="h-3.5 w-3.5 text-amber-700" />}
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
