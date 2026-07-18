"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TASK_TYPE_ICON, TASK_TYPE_LABEL, TASKS } from "../lib/data";
import { STATUS, BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "../lib/tokens";

export default function CommandPalette({
  onClose,
  onSelectTask,
}: {
  onClose: () => void;
  onSelectTask: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TASKS;
    return TASKS.filter((t) => t.label.toLowerCase().includes(q) || t.type.includes(q) || t.owner.toLowerCase().includes(q));
  }, [query]);

  function onQueryChange(next: string) {
    setQuery(next);
    setActiveIdx(0);
  }

  function commit(id: string) {
    onSelectTask(id);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const t = results[activeIdx];
      if (t) commit(t.id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="커맨드 팔레트"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl", BORDER, "bg-white dark:bg-zinc-900")}
      >
        <div className={cx("flex h-12 items-center gap-2 border-b px-4", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="태스크 이름, 타입, 오너로 검색…"
            aria-label="태스크 검색"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            className={cx("h-full flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400 dark:placeholder:text-zinc-500")}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
          >
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>
        <ul id="palette-results" role="listbox" aria-label="검색 결과" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className={cx("px-3 py-6 text-center text-sm", TEXT_CAPTION)}>일치하는 태스크가 없습니다.</li>
          ) : (
            results.map((t, idx) => {
              const Icon = TASK_TYPE_ICON[t.type];
              const active = idx === activeIdx;
              return (
                <li key={t.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => commit(t.id)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left",
                      TRANSITION,
                      FOCUS_RING,
                      active ? "bg-violet-50 dark:bg-violet-500/10" : "",
                    )}
                  >
                    <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", STATUS[t.status].bg)}>
                      <Icon size={15} aria-hidden="true" className={STATUS[t.status].text} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cx("block truncate font-mono text-sm", TEXT_PRIMARY)}>{t.label}</span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>
                        {TASK_TYPE_LABEL[t.type]} · {t.owner}
                      </span>
                    </span>
                    <span className={cx("shrink-0 text-xs font-medium", STATUS[t.status].text)}>{t.status}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
