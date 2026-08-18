"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Sku } from "./data";
import { FOCUS_RING } from "./ui";

/**
 * ⌘K quick-jump. The parent only mounts this component while the palette is open (rather than
 * always rendering it with an `open` boolean), so a fresh `useState("")` on mount is the reset —
 * no effect needs to call `setQuery` itself. Deliberately small in scope otherwise: one input, a
 * filtered result list of real `<button>` rows (never anchors to nowhere), Escape closes and
 * hands focus back to the trigger that opened it. Every focusable node inside uses the same
 * literal-color focus ring as the rest of the page, audited here specifically because this state
 * only exists after a keypress — the exact non-default surface the 2026-08-17 gate promotion
 * targets.
 */
export function CommandPalette({
  onClose,
  skus,
  onSelectSku,
}: {
  onClose: () => void;
  skus: Sku[];
  onSelectSku: (sku: Sku) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skus.slice(0, 6);
    return skus
      .filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, skus]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center bg-zinc-900/40 px-4 pt-24"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick jump to SKU"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a SKU by name or code…"
            className={`h-8 w-full rounded-md border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick jump"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No SKUs match &ldquo;{query}&rdquo;.</li>
          ) : (
            results.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelectSku(s)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <span className="truncate">
                    <span className="font-semibold text-zinc-900">{s.name}</span>
                    <span className="ml-2 font-mono text-xs text-zinc-500 tabular-nums">{s.code}</span>
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500">{s.warehouse}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
