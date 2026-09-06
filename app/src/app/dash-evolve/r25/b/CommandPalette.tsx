"use client";

import { Landmark, Search, Store, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEARCH_ENTRIES } from "./data";
import { BORDER, FOCUS, HOVER_BG, PANEL_BG, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

export default function CommandPalette({ onClose, onPinRun }: { onClose: () => void; onPinRun: (runId: string) => void }) {
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
  const results = useMemo(() => SEARCH_ENTRIES.filter((e) => q === "" || e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q)), [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/50 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-zinc-900/20", BORDER, PANEL_BG)}>
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_MUTED)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search runs, sellers, sections…"
            aria-label="Search runs, sellers, sections"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_MUTED} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {results.length === 0 ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_MUTED)}>Nothing matches that.</p> : null}
          {results.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <Eyebrow>Results</Eyebrow>
              </div>
              {results.map((e) => {
                const Icon = e.kind === "run" ? Landmark : e.kind === "seller" ? Store : Search;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      if (e.kind === "run") onPinRun(e.runId);
                      onClose();
                    }}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                  >
                    <Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_MUTED)} />
                    <span className="min-w-0 flex-1 truncate">
                      <span className={e.kind === "run" ? "font-mono text-[13px]" : "text-[13px]"}>{e.title}</span>
                      <span className={cx("ml-2 text-[11px] font-normal", TEXT_MUTED)}>{e.meta}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
