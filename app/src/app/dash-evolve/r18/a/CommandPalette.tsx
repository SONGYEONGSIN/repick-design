"use client";

/**
 * ⌘K 커맨드 팔레트. 큐 화면에서 손을 떼지 않고 필터·기간·정렬을 바꾸거나
 * 다음 미결 건으로 바로 뛴다.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { FOCUS, cn, useBodyScrollLock } from "./ui";

export type Command = {
  id: string;
  group: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
};

export function CommandPalette({
  open,
  commands,
  onClose,
}: {
  open: boolean;
  commands: Command[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const listId = useId();
  const titleId = useId();

  useBodyScrollLock(open);

  // Reset the search state during render (not in an effect) when `open` flips true — this is the
  // "adjust state while rendering" pattern React recommends over a setState-in-effect cascade.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActive(0);
    }
  }

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint} ${command.keywords} ${command.group}`.toLowerCase().includes(needle),
    );
  }, [commands, query]);

  if (!open) return null;

  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  function runAt(index: number) {
    const command = results[index];
    if (!command) return;
    command.run();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="커맨드 팔레트 닫기"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-zinc-900/25"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_24px_64px_rgba(24,24,27,0.24)]"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
          if (event.key === "Tab") {
            event.preventDefault();
            if (document.activeElement === inputRef.current) closeRef.current?.focus();
            else inputRef.current?.focus();
          }
        }}
      >
        <h2 id={titleId} className="sr-only">
          커맨드 팔레트
        </h2>
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results.length > 0 ? `${listId}-opt-${activeIndex}` : undefined}
            aria-label="명령 검색"
            placeholder="명령 검색 — 기간, 정렬, 다음 미결 건…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((prev) => (results.length === 0 ? 0 : (prev + 1) % results.length));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((prev) => (results.length === 0 ? 0 : (prev - 1 + results.length) % results.length));
              } else if (event.key === "Enter") {
                event.preventDefault();
                runAt(activeIndex);
              }
            }}
            className={cn(
              "h-14 min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500",
              "focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-violet-600",
            )}
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              FOCUS,
            )}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-zinc-600">
              입력한 조건과 일치하는 명령이 없습니다.
            </p>
          ) : null}
          <ul id={listId} role="listbox" aria-label="명령 목록">
            {results.map((command, index) => {
                const selected = index === activeIndex;
                return (
                  <li
                    key={command.id}
                    id={`${listId}-opt-${index}`}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => runAt(index)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm",
                      selected ? "bg-violet-50 text-zinc-900" : "text-zinc-700",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-zinc-600">
                        {command.group}
                      </span>
                      <span className="min-w-0 truncate">{command.label}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="hidden text-xs text-zinc-600 sm:inline">{command.hint}</span>
                      {selected ? (
                        <ArrowRight className="h-3.5 w-3.5 text-violet-700" aria-hidden />
                      ) : null}
                    </span>
                  </li>
              );
            })}
          </ul>
        </div>

        <p className="border-t border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-600">
          위·아래 화살표로 이동, Enter 로 실행, Esc 로 닫기
        </p>
      </div>
    </div>
  );
}
