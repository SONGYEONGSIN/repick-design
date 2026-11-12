"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Building2, ClipboardCheck } from "lucide-react";
import { VENDORS, INITIAL_APPROVALS } from "./data";

type Item = { id: string; label: string; sub: string; kind: "vendor" | "approval" };

function buildIndex(): Item[] {
  const vendors = VENDORS.map((v) => ({
    id: `vendor-${v.id}`,
    label: v.name,
    sub: `${v.riskTier} risk · ${v.status}`,
    kind: "vendor" as const,
  }));
  const approvals = INITIAL_APPROVALS.map((a) => ({
    id: `approval-${a.id}`,
    label: a.vendorName,
    sub: `Pending request · ${a.submittedBy}`,
    kind: "approval" as const,
  }));
  return [...vendors, ...approvals];
}

const INDEX = buildIndex();

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (open && !wasOpen) {
    setWasOpen(true);
    if (query !== "") setQuery("");
    if (activeIndex !== 0) setActiveIndex(0);
  } else if (!open && wasOpen) {
    setWasOpen(false);
  }

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INDEX.slice(0, 8);
    return INDEX.filter((item) => item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          else if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            onClose();
          }
        }}
      >
        <div className="flex h-12 items-center gap-2 border-b border-white/10 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={results[activeIndex] ? `palette-opt-${results[activeIndex].id}` : undefined}
            placeholder="Search vendors or approvals…"
            className="h-full flex-1 bg-transparent text-sm text-zinc-50 outline-none placeholder:text-zinc-400"
          />
        </div>
        <ul id="palette-listbox" role="listbox" aria-label="Results" className="max-h-72 overflow-y-auto p-1">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-400">No matches</li>
          ) : (
            results.map((item, idx) => {
              const Icon = item.kind === "vendor" ? Building2 : ClipboardCheck;
              const active = idx === activeIndex;
              return (
                <li
                  key={item.id}
                  id={`palette-opt-${item.id}`}
                  role="option"
                  aria-selected={active}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={onClose}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors motion-reduce:transition-none ${
                    active ? "bg-lime-400/15 text-lime-200" : "text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.label}</span>
                    <span className="block truncate text-xs text-zinc-400">{item.sub}</span>
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
