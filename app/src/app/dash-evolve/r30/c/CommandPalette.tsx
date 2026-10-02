"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { NODES, STATUS_META, DOMAIN_LABEL, statusFor, formatRps, formatPercent, FOCUS_RING } from "./data";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function CommandPalette({ open, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query synchronously during render when `open` flips to true, rather than reacting
  // to it from inside an effect — React's documented pattern for adjusting state from a prop
  // change during render.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? NODES.filter((n) => n.fullName.toLowerCase().includes(q) || n.label.toLowerCase().includes(q) || DOMAIN_LABEL[n.domain].toLowerCase().includes(q))
      : NODES;
    return pool.slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search services"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by service name or domain…"
            aria-label="Search services"
            className={`h-12 flex-1 rounded bg-transparent text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only font-normal">Close search</span>
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.map((node) => {
            const status = statusFor(node.errorRatePct);
            const meta = STATUS_META[status];
            const Icon = meta.icon;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(node.id);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${meta.text}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-normal text-zinc-900">{node.fullName}</span>
                    <span className="block truncate text-xs font-normal text-zinc-500">{DOMAIN_LABEL[node.domain]}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-xs font-normal tabular-nums text-zinc-500">
                    {formatPercent(node.errorRatePct)} &middot; {formatRps(node.rps)}
                  </span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm font-normal text-zinc-500">No matches.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
