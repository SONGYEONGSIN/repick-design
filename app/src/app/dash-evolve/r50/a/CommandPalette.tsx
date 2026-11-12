"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Release } from "./data";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export function CommandPalette({
  open,
  onClose,
  releases,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  releases: Release[];
  onJump: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // Reset-on-open belongs to the open/close event handlers below, not to a setState-in-effect
  // (focus is the one thing here that's an external-system sync, so it's the only thing the
  // effect does).
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleClose() {
    setQuery("");
    onClose();
  }

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape" && open) handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const filtered = releases
    .filter((r) => `${r.version} ${r.title}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-28" onClick={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jump to release"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-3 shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 px-2 pb-2">
          <Search className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a release…"
            className={`w-full bg-transparent py-2 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button type="button" onClick={handleClose} aria-label="Close command menu" className={`flex-shrink-0 rounded p-1 text-zinc-500 hover:text-zinc-600 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-2 max-h-72 space-y-0.5 overflow-y-auto">
          {filtered.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  onJump(r.id);
                  handleClose();
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <span className="min-w-0 flex-1 truncate">
                  {r.version} &mdash; {r.title}
                </span>
                <span className="flex-shrink-0 text-xs font-normal text-zinc-500">{r.status === "pending" ? "Pending" : "Approved"}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-2.5 py-2 text-sm font-normal text-zinc-500">No matching releases.</li>}
        </ul>
      </div>
    </div>
  );
}
