"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Hash, Search, X } from "lucide-react";
import { ALL_NODES, RISK_BAND_LABEL, TIER_LABEL, isSupplierNode, riskBand } from "./data";
import { FOCUS_RING } from "./focus";

export default function CommandPalette({
  onClose,
  onPin,
}: {
  onClose: () => void;
  onPin: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_NODES.slice(0, 20);
    return ALL_NODES.filter(
      (n) => n.name.toLowerCase().includes(q) || n.code.toLowerCase().includes(q) || n.category.toLowerCase().includes(q),
    ).slice(0, 20);
  }, [query]);

  const safeHighlight = Math.min(highlight, Math.max(0, results.length - 1));

  function choose(id: string) {
    onPin(id);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[safeHighlight];
      if (target) choose(target.id);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Jump to a node" onKeyDown={handleKeyDown} className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="palette-results"
            aria-activedescendant={results[safeHighlight] ? `palette-opt-${results[safeHighlight].id}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            placeholder="Search vendors, sites, categories…"
            className={`min-w-0 flex-1 rounded bg-transparent text-sm font-normal text-zinc-100 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button type="button" aria-label="Close command palette" onClick={onClose} className={`flex size-8 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-white/10 ${FOCUS_RING}`}>
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <ul id="palette-results" role="listbox" aria-label="Nodes" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm font-normal text-zinc-400">No nodes match &quot;{query}&quot;.</li>}
          {results.map((n, i) => {
            const band = isSupplierNode(n) ? riskBand(n.riskScore) : null;
            return (
              <li key={n.id}>
                <button
                  id={`palette-opt-${n.id}`}
                  type="button"
                  role="option"
                  aria-selected={i === safeHighlight}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => choose(n.id)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-normal ${FOCUS_RING} ${
                    i === safeHighlight ? "bg-violet-400/15 text-violet-100" : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <Hash aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
                  <span className="min-w-0 flex-1 truncate">
                    {n.name} <span className="text-zinc-400">&middot; {TIER_LABEL[n.tier]}</span>
                  </span>
                  <span className="shrink-0 text-xs font-normal text-zinc-400">{band ? RISK_BAND_LABEL[band] : "—"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
