"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LINES, SEARCH_ENTRIES } from "./data";
import type { LineId } from "./data";
import { BORDER, FOCUS, HOVER_BG, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

/**
 * Mounted only while open (see CadenceClient: `{paletteOpen ? <CommandPalette .../> : null}`), so
 * `query` starts fresh on every open by construction — no effect has to reset it, which sidesteps
 * the `react-hooks/set-state-in-effect` failure mode two of the last two rounds hit here.
 */
export default function CommandPalette({
  onClose,
  onFocusLine,
}: {
  onClose: () => void;
  onFocusLine: (id: LineId) => void;
}) {
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

  const orders = useMemo(
    () => SEARCH_ENTRIES.filter((e) => e.kind === "order" && (q === "" || e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q))).slice(0, 8),
    [q],
  );
  const lines = useMemo(() => LINES.filter((l) => q === "" || l.name.toLowerCase().includes(q)), [q]);

  const empty = orders.length === 0 && lines.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-zinc-900/20", BORDER, "bg-white")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search work orders or jump to a production line…"
            aria-label="Search work orders or jump to a production line"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {empty ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_AUX)}>No work orders or lines match that.</p> : null}

          {lines.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <Eyebrow>Production lines</Eyebrow>
              </div>
              {lines.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    onFocusLine(l.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <l.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                  <span className="min-w-0 flex-1 truncate">{`Focus schedule on ${l.name}`}</span>
                </button>
              ))}
            </div>
          ) : null}

          {orders.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <Eyebrow>Work orders</Eyebrow>
              </div>
              {orders.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onFocusLine(e.lineId);
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
