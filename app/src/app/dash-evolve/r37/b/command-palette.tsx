"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Vendor } from "./data";

/**
 * Lightweight ⌘K palette. Selecting a result only scrolls the page down to
 * the vendor-directory section by id — it never sets a "selected vendor"
 * anywhere, and never touches the box-plot strip's or the table's own
 * state. That keeps it from becoming a second, hidden way to couple the
 * two independent widgets below.
 */
export function CommandPalette({
  open,
  onClose,
  vendors,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  vendors: readonly Vendor[];
  returnFocusRef: React.RefObject<HTMLElement | null>;
}) {
  // Local-only query state. Reset happens by unmounting the input below
  // (the dialog body only renders while `open` is true), not via a
  // useEffect watching `open` — avoids react-hooks/set-state-in-effect.
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const matches = vendors.filter((v) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.shortCode.toLowerCase().includes(q)
    );
  });

  function handleClose() {
    setQuery("");
    onClose();
    returnFocusRef.current?.focus();
  }

  function goToDirectory() {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById("vendor-directory")
      ?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={handleClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Vendor search"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <Search className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleClose();
            }}
            placeholder="Search vendors by name or category…"
            className="h-12 min-w-0 flex-1 bg-transparent text-sm text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-400"
          />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ul role="listbox" aria-label="Vendor results" className="max-h-72 overflow-y-auto p-1.5">
          {matches.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-zinc-400">No vendors match.</li>
          )}
          {matches.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={goToDirectory}
                className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-zinc-50">{v.name}</span>
                  <span className="block truncate text-xs text-zinc-400">{v.category}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-zinc-400">{v.shortCode}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
