"use client";

import {
  ArrowRight,
  Calendar,
  CreditCard,
  Filter,
  LayoutList,
  Search,
  Table2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Period } from "../lib/data";
import type { TypeFilter } from "./FilterRail";
import type { FeedView } from "./dashboard-client";

interface Command {
  id: string;
  label: string;
  group: string;
  Icon: LucideIcon;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  setTypeFilter: (t: TypeFilter) => void;
  setView: (v: FeedView) => void;
  setPeriod: (p: Period) => void;
  setErrorOnly: (v: boolean) => void;
}

export default function CommandPalette({
  open,
  onClose,
  setTypeFilter,
  setView,
  setPeriod,
  setErrorOnly,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands: Command[] = useMemo(() => {
    const close = (fn: () => void) => () => {
      fn();
      onClose();
    };
    return [
      { id: "err", group: "필터", label: "오류 이벤트만 보기", Icon: TriangleAlert, run: close(() => { setTypeFilter("error"); setErrorOnly(true); }) },
      { id: "conv", group: "필터", label: "전환 이벤트만 보기", Icon: CreditCard, run: close(() => { setTypeFilter("conversion"); setErrorOnly(false); }) },
      { id: "all", group: "필터", label: "모든 이벤트 보기 (필터 초기화)", Icon: Filter, run: close(() => { setTypeFilter("all"); setErrorOnly(false); }) },
      { id: "timeline", group: "뷰", label: "타임라인 뷰로 전환", Icon: LayoutList, run: close(() => setView("timeline")) },
      { id: "table", group: "뷰", label: "테이블 뷰로 전환", Icon: Table2, run: close(() => setView("table")) },
      { id: "p-today", group: "기간", label: "기간: 오늘", Icon: Calendar, run: close(() => setPeriod("today")) },
      { id: "p-7d", group: "기간", label: "기간: 최근 7일", Icon: Calendar, run: close(() => setPeriod("7d")) },
      { id: "p-30d", group: "기간", label: "기간: 최근 30일", Icon: Calendar, run: close(() => setPeriod("30d")) },
    ];
  }, [onClose, setTypeFilter, setView, setPeriod, setErrorOnly]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // 다음 프레임에 포커스 (모달 마운트 후)
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  if (!open) return null;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]" role="presentation">
      <button type="button" aria-label="명령 팔레트 닫기" onClick={onClose} className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="명령 팔레트"
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-zinc-100 px-4">
          <Search className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            placeholder="명령 검색 — 필터, 뷰, 기간…"
            className="h-12 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline">
            esc
          </kbd>
        </div>

        <ul id="palette-list" ref={listRef} role="listbox" aria-label="명령 목록" className="max-h-72 overflow-y-auto p-1.5">
          {filtered.map((cmd, i) => {
            const isActive = i === active;
            const showGroup = i === 0 || filtered[i - 1].group !== cmd.group;
            return (
              <li key={cmd.id} role="presentation">
                {showGroup && (
                  <p className="px-2.5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    {cmd.group}
                  </p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => setActive(i)}
                  onClick={() => cmd.run()}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    isActive ? "bg-violet-50 text-violet-900" : "text-zinc-700"
                  }`}
                >
                  <cmd.Icon className={`size-4 shrink-0 ${isActive ? "text-violet-600" : "text-zinc-400"}`} aria-hidden="true" />
                  <span className="flex-1 truncate">{cmd.label}</span>
                  {isActive && <ArrowRight className="size-3.5 shrink-0 text-violet-500" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-zinc-500">일치하는 명령이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
