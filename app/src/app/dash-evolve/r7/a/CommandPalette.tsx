"use client";

import { CornerDownLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { CUSTOMERS, STAGE_META } from "./data";
import { BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

export default function CommandPalette({ onClose, onSelectCustomer }: { onClose: () => void; onSelectCustomer: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? CUSTOMERS.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.contactName.toLowerCase().includes(q) ||
            c.csm.toLowerCase().includes(q) ||
            STAGE_META[c.stage].label.toLowerCase().includes(q),
        )
      : CUSTOMERS;
    return pool.slice(0, 8);
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function choose(idx: number) {
    const c = results[idx];
    if (!c) return;
    onSelectCustomer(c.id);
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
      <button type="button" aria-label="명령 팔레트 닫기" onClick={onClose} className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="계정 검색"
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
            placeholder="계정, 담당자, 단계 검색"
            aria-label="계정 검색어"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400", TEXT_PRIMARY)}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className={cx("grid h-8 w-8 place-items-center rounded-lg", TEXT_CAPTION, "hover:bg-zinc-100 dark:hover:bg-zinc-800", FOCUS_RING)}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <ul ref={listRef} className="max-h-[46vh] overflow-y-auto p-1.5 [scrollbar-width:thin]">
          {results.length === 0 ? (
            <li className={cx("px-3 py-6 text-center text-sm", TEXT_CAPTION)}>검색 결과가 없습니다.</li>
          ) : (
            results.map((c, i) => {
              const m = STAGE_META[c.stage];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(i)}
                    aria-current={i === active}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left",
                      i === active ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <span aria-hidden="true" className={cx("h-2 w-2 shrink-0 rounded-full", m.chipDot)} />
                    <span className="min-w-0 flex-1">
                      <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{c.name}</span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>
                        {c.contactName} · {m.label}
                      </span>
                    </span>
                    <span className={cx("shrink-0 text-xs font-semibold", NUM, TEXT_CAPTION)}>{c.health["30d"]}점</span>
                    {i === active ? <CornerDownLeft size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className={cx("flex items-center justify-between border-t px-3.5 py-2 text-[11px]", BORDER, TEXT_CAPTION)}>
          <span>계정을 선택하면 궤도·상세·테이블이 동기화됩니다</span>
          <span className={NUM}>{results.length}건</span>
        </div>
      </div>
    </div>
  );
}
