"use client";

import { useEffect, useId, useMemo, useRef, useState, type RefObject } from "react";
import { Search } from "lucide-react";
import type { CategoryId, CompositionSlice } from "./data";
import { CATEGORIES } from "./data";
import { cx } from "./ui";

export default function CommandPalette({
  open,
  onClose,
  slices,
  onSelectCategory,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  slices: CompositionSlice[];
  onSelectCategory: (id: CategoryId) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const sliceByCategory = new Map(slices.map((s) => [s.categoryId, s]));

  // Reset the query whenever the palette transitions to open, without a setState-in-effect:
  // adjusting state during render (guarded by comparing against a render-time-tracked previous
  // value) is the documented escape hatch for "reset state when a prop changes".
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQuery("");
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <span id={headingId} className="sr-only">
          Jump to a ticket category
        </span>
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4 py-3">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a category…"
            className="w-full rounded-sm bg-transparent text-[14px] text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
          />
          <kbd className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            Esc
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-1.5" aria-label="Categories">
          {results.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-zinc-500">No categories match &ldquo;{query}&rdquo;.</li>}
          {results.map((category) => {
            const slice = sliceByCategory.get(category.id);
            const Icon = category.icon;
            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory(category.id);
                    onClose();
                  }}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1450b0]"
                  )}
                >
                  <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: category.color }}>
                    <Icon className={cx("h-3.5 w-3.5", category.iconInk === "dark" ? "text-zinc-900/80" : "text-white/95")} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-zinc-900">{category.name}</span>
                    <span className="block truncate text-[11.5px] text-zinc-500">{category.description}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-[12px] text-zinc-500">{slice?.pct ?? 0}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
