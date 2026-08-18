"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KanbanSquare, Search } from "lucide-react";
import { findings, STAGE_META, type Finding } from "./data";
import { SeverityBadge } from "./ui";

export function CommandPalette({
  open,
  onClose,
  onSelectFinding,
}: {
  open: boolean;
  onClose: () => void;
  onSelectFinding: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset the query when the dialog transitions open, derived during render rather than an
  // effect (no outside system to synchronize with) — focus below *is* an outside system.
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    const pool: Finding[] = q
      ? findings.filter(
          (f) =>
            f.id.toLowerCase().includes(q) ||
            f.title.toLowerCase().includes(q) ||
            f.asset.toLowerCase().includes(q) ||
            (f.cve ?? "").toLowerCase().includes(q)
        )
      : findings.slice(0, 6);
    return pool.slice(0, 8);
  }, [q]);

  if (!open) return null;

  function handleSelect(id: string) {
    onSelectFinding(id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-zinc-900/40 px-4 pt-24 sm:pt-32">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close command palette"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Quick search"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex h-12 items-center gap-2.5 border-b border-zinc-100 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-600">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search findings, assets, CVEs…"
            aria-label="Search findings"
            className="h-full flex-1 border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          {matches.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-500">No findings match &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul>
              {matches.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(f.id)}
                    className="flex min-h-[48px] w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none"
                  >
                    <KanbanSquare className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-zinc-900">
                        {f.id} · {f.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                        {f.asset} · {STAGE_META[f.stage].label}
                      </span>
                    </span>
                    <SeverityBadge severity={f.severity} className="shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
