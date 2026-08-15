"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, KanbanSquare, Search, Users } from "lucide-react";
import { deals, owners, stageMeta } from "./data";
import { formatKRWCompact } from "./format";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset on open via React's "adjust state during render" pattern rather than an effect: the reset
  // is derived from a prop change, not a synchronisation with an outside system, so an effect would
  // only buy an extra render. Focus stays in an effect — that one *is* an outside system.
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
  const { matchedDeals, matchedCompanies, matchedOwners } = useMemo(() => {
    const md = q
      ? deals.filter((d) => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)).slice(0, 6)
      : deals.slice(0, 5);
    const mc = q
      ? Array.from(new Set(deals.filter((d) => d.company.toLowerCase().includes(q)).map((d) => d.company))).slice(0, 4)
      : [];
    const mo = q ? owners.filter((o) => o.name.toLowerCase().includes(q)) : [];
    return { matchedDeals: md, matchedCompanies: mc, matchedOwners: mo };
  }, [q]);

  if (!open) return null;
  const hasResults = matchedDeals.length + matchedCompanies.length + matchedOwners.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-zinc-900/40 px-4 pt-24 sm:pt-32">
      <button
        type="button"
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
        <div className="flex h-12 items-center gap-2.5 border-b border-zinc-100 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals, accounts, reps…"
            aria-label="Search input"
            className="h-full flex-1 border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          {!hasResults ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-500">No results found.</p>
          ) : (
            <>
              {matchedDeals.length > 0 ? (
                <ResultGroup label="Deals">
                  {matchedDeals.map((d) => (
                    <ResultItem
                      key={d.id}
                      icon={KanbanSquare}
                      label={`${d.company} · ${d.title}`}
                      meta={`${stageMeta[d.stage].label} · ${formatKRWCompact(d.amount)}`}
                      onClose={onClose}
                    />
                  ))}
                </ResultGroup>
              ) : null}
              {matchedCompanies.length > 0 ? (
                <ResultGroup label="Accounts">
                  {matchedCompanies.map((c) => (
                    <ResultItem key={c} icon={Building2} label={c} onClose={onClose} />
                  ))}
                </ResultGroup>
              ) : null}
              {matchedOwners.length > 0 ? (
                <ResultGroup label="Reps">
                  {matchedOwners.map((o) => (
                    <ResultItem key={o.id} icon={Users} label={`${o.name} · ${o.role}`} onClose={onClose} />
                  ))}
                </ResultGroup>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">{label}</p>
      <ul>{children}</ul>
    </div>
  );
}

function ResultItem({
  icon: Icon,
  label,
  meta,
  onClose,
}: {
  icon: typeof KanbanSquare;
  label: string;
  meta?: string;
  onClose: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClose}
        className="flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {meta ? <span className="shrink-0 text-xs whitespace-nowrap text-zinc-500 tabular-nums">{meta}</span> : null}
      </button>
    </li>
  );
}
