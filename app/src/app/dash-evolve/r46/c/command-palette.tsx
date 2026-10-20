"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Waves, X } from "lucide-react";
import { CHANNELS } from "./data";
import { FOCUS_RING } from "./ui";

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const matched = q ? CHANNELS.filter((c) => c.name.toLowerCase().includes(q)) : CHANNELS;

  function jumpTo(channelId: string) {
    onClose();
    // Pure navigation — this never writes a shared "selected channel" into state
    // that other widgets read. It scrolls to and focuses that row's own expand
    // toggle, so the row's in-place accordion remains the only thing that reacts.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const row = document.getElementById(`row-${channelId}`);
    row?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    const toggle = document.getElementById(`row-toggle-${channelId}`);
    window.setTimeout(() => toggle?.focus(), prefersReducedMotion ? 0 : 280);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-950/70" />
      <div role="dialog" aria-modal="true" aria-label="Search channels" className="relative w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a revenue channel…"
            className="min-w-0 flex-1 bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          <p className="px-2 pt-1 pb-1 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">Channels</p>
          {matched.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => jumpTo(c.id)}
              className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}
            >
              <Waves className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-left">{c.name}</span>
              <span className="shrink-0 font-normal text-xs text-zinc-400">{c.category}</span>
            </button>
          ))}
          {matched.length === 0 ? <p className="px-2 py-2 font-normal text-sm text-zinc-400">No matching channels.</p> : null}
        </div>
      </div>
    </div>
  );
}
