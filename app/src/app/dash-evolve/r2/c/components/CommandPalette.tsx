"use client";

import { CornerDownLeft, Search } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface Command {
  id: string;
  label: string;
  hint?: string;
}

/**
 * 부모가 open일 때만 마운트하는 형태로 사용한다 — 열릴 때마다 새로 마운트되므로
 * query/highlight 초기값이 자연스럽게 리셋되고, 이펙트에서 setState할 필요가 없다.
 */
export default function CommandPalette({
  onClose,
  commands,
  onRun,
}: {
  onClose: () => void;
  commands: Command[];
  onRun: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase())),
    [commands, query]
  );

  // 필터링으로 목록이 줄어들면 렌더 시점에 안전한 범위로 클램프한다 (이펙트 불필요).
  const safeHighlight = filtered.length === 0 ? 0 : Math.min(highlight, filtered.length - 1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runHighlighted = (index: number) => {
    const cmd = filtered[index];
    if (cmd) onRun(cmd.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runHighlighted(safeHighlight);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24">
      <button type="button" aria-label="닫기" onClick={onClose} className="fixed inset-0 -z-10 cursor-default" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="커맨드 팔레트"
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3.5">
          <Search className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="명령 검색 — 탭 이동, 발송 이력 등"
            aria-label="명령 검색"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            className="h-12 w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
          />
          <span className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline-flex">
            Esc
          </span>
        </div>
        <ul id="command-list" role="listbox" aria-label="명령 목록" className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <li className="px-3.5 py-3 text-sm text-zinc-500">일치하는 명령이 없습니다.</li>
          ) : (
            filtered.map((cmd, index) => (
              <li key={cmd.id} role="option" aria-selected={index === safeHighlight}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => runHighlighted(index)}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm ${
                    index === safeHighlight ? "bg-indigo-50 text-indigo-700" : "text-zinc-700"
                  }`}
                >
                  <span>
                    {cmd.label}
                    {cmd.hint ? <span className="ml-2 text-xs text-zinc-500">{cmd.hint}</span> : null}
                  </span>
                  {index === safeHighlight ? <CornerDownLeft className="size-3.5 shrink-0" aria-hidden="true" /> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
