"use client";

import { CornerDownLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { CHANNELS, OUTCOMES, TIERS } from "./data";
import { BORDER, FOCUS_RING, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

type ResultItem = {
  id: string;
  label: string;
  hint: string;
  Icon: (typeof CHANNELS)[number]["Icon"];
};

export default function CommandPalette({ onClose, onSelectNode }: { onClose: () => void; onSelectNode: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const allItems: ResultItem[] = useMemo(
    () => [
      ...CHANNELS.map((c) => ({ id: c.id, label: c.label, hint: "Acquisition channel", Icon: c.Icon })),
      ...TIERS.map((t) => ({ id: t.id, label: t.label, hint: "Plan tier", Icon: t.Icon })),
      ...OUTCOMES.map((o) => ({ id: o.id, label: o.label, hint: "90-day outcome", Icon: o.Icon })),
    ],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? allItems.filter((it) => it.label.toLowerCase().includes(q) || it.hint.toLowerCase().includes(q)) : allItems;
    return pool.slice(0, 9);
  }, [query, allItems]);

  // The reset is derived from the query changing, so React's "adjust state during render" pattern
  // fits better than an effect — an effect here only costs an extra render.
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setActive(0);
  }

  function choose(idx: number) {
    const it = results[idx];
    if (!it) return;
    onSelectNode(it.id);
    onClose();
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search channels, tiers, and outcomes"
        onKeyDown={onKeyDown}
        className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl", BORDER, "bg-white dark:bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2 border-b px-3.5", BORDER)}>
          <Search size={17} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels, tiers, outcomes"
            aria-label="Search query"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400", TEXT_PRIMARY)}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cx("grid h-8 w-8 place-items-center rounded-lg", TEXT_CAPTION, "hover:bg-zinc-100 dark:hover:bg-zinc-800", FOCUS_RING)}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-[46vh] overflow-y-auto p-1.5 [scrollbar-width:thin]">
          {results.length === 0 ? (
            <li className={cx("px-3 py-6 text-center text-sm", TEXT_CAPTION)}>No results.</li>
          ) : (
            results.map((it, i) => (
              <li key={it.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  aria-current={i === active}
                  className={cx(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left",
                    i === active ? "bg-sky-50 dark:bg-sky-500/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                  )}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <it.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{it.label}</span>
                    <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{it.hint}</span>
                  </span>
                  {i === active ? <CornerDownLeft size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className={cx("flex items-center justify-between border-t px-3.5 py-2 text-[11px]", BORDER, TEXT_CAPTION)}>
          <span>Select a channel, tier, or outcome to sync the flow diagram and detail panel</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
