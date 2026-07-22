"use client";

import { CornerDownLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { formatUsd, type AccountSnapshot } from "./data";
import { QUADRANT } from "./tokens";
import { BORDER, FOCUS_RING, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

export default function CommandPalette({
  accounts,
  onClose,
  onSelectAccount,
}: {
  accounts: AccountSnapshot[];
  onClose: () => void;
  onSelectAccount: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? accounts.filter((a) => a.name.toLowerCase().includes(q) || a.industry.toLowerCase().includes(q)) : accounts;
    return pool.slice(0, 9);
  }, [query, accounts]);

  // Reset the highlighted row whenever the query changes — adjusted during render (React's
  // recommended pattern for derived state), not inside an effect, to avoid a cascading re-render.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActive(0);
  }

  function choose(idx: number) {
    const it = results[idx];
    if (!it) return;
    onSelectAccount(it.id);
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
        aria-label="Jump to an account"
        onKeyDown={onKeyDown}
        className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl", BORDER, "bg-white")}
      >
        <div className={cx("flex items-center gap-2 rounded-t-2xl border-b px-3.5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600", BORDER)}>
          <Search size={17} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts by name or industry"
            aria-label="Search accounts"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500", TEXT_PRIMARY)}
          />
          <button type="button" onClick={onClose} aria-label="Close" className={cx("grid h-8 w-8 place-items-center rounded-lg", TEXT_CAPTION, "hover:bg-zinc-100", FOCUS_RING)}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-[46vh] overflow-y-auto p-1.5 [scrollbar-width:thin]">
          {results.length === 0 ? (
            <li className={cx("px-3 py-6 text-center text-sm", TEXT_CAPTION)}>No accounts match this search.</li>
          ) : (
            results.map((a, i) => {
              const q = QUADRANT[a.quadrant];
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(i)}
                    aria-current={i === active}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left", i === active ? "bg-indigo-50" : "hover:bg-zinc-50")}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-zinc-100">
                      <a.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{a.name}</span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>
                        <span className={q.textClass}>{q.label}</span> · {formatUsd(a.arr)} ARR · health {a.health.toFixed(0)}
                      </span>
                    </span>
                    {i === active ? <CornerDownLeft size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className={cx("flex items-center justify-between border-t px-3.5 py-2 text-[11px]", BORDER, TEXT_CAPTION)}>
          <span>Select an account to sync the scatter, detail rail, and signals table</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
