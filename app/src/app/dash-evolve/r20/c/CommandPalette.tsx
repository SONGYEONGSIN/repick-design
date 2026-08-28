"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEARCH_ENTRIES } from "./data";
import { BORDER, FOCUS, HOVER_BG, PANEL_BG, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

export default function CommandPalette({ onClose, onSelectService }: { onClose: () => void; onSelectService: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => SEARCH_ENTRIES.filter((e) => q === "" || e.title.toLowerCase().includes(q)), [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-black/50", BORDER, PANEL_BG)}>
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search services by name…"
            aria-label="Search services by name"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {results.length === 0 ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_AUX)}>No services match that.</p> : null}
          {results.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <Eyebrow>Services</Eyebrow>
              </div>
              {results.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onSelectService(e.serviceId);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-mono text-[13px]">{e.title}</span>
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{e.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
