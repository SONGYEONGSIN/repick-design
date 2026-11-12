"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Tag, Ticket, X } from "lucide-react";
import { FOCUS_RING } from "./ui";
import { FEED_ITEMS, TERMS } from "./data";

export default function CommandPalette({
  open,
  onClose,
  onSelectTerm,
  onPin,
}: {
  open: boolean;
  onClose: () => void;
  onSelectTerm: (id: string) => void;
  onPin: (id: string) => void;
}) {
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
  const matchedTerms = q ? TERMS.filter((t) => t.label.includes(q)).slice(0, 5) : TERMS.slice(0, 5);
  const matchedTickets = q
    ? FEED_ITEMS.filter((t) => t.subject.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q)).slice(0, 5)
    : FEED_ITEMS.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/30" />
      <div role="dialog" aria-modal="true" aria-label="Search themes and tickets" className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search themes or tickets…"
            className="min-w-0 flex-1 bg-transparent font-normal text-sm text-zinc-900 placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          <p className="px-2 pt-1 pb-1 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">Themes</p>
          {matchedTerms.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onSelectTerm(t.id);
                onClose();
              }}
              className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              <Tag className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
              <span className="min-w-0 truncate">{t.label}</span>
            </button>
          ))}
          {matchedTerms.length === 0 ? <p className="px-2 py-2 font-normal text-sm text-zinc-500">No matching themes.</p> : null}

          <p className="mt-2 px-2 pt-1 pb-1 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">Tickets</p>
          {matchedTickets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onPin(t.id);
                onClose();
              }}
              className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              <Ticket className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
              <span className="min-w-0 truncate">{t.subject}</span>
            </button>
          ))}
          {matchedTickets.length === 0 ? <p className="px-2 py-2 font-normal text-sm text-zinc-500">No matching tickets.</p> : null}
        </div>
      </div>
    </div>
  );
}
