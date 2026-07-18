"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, CalendarDays, LineChart, Percent, Search } from "lucide-react";
import { cn } from "../lib/cn";
import type { DefinitionId, MetricId } from "../lib/data";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSetDefinition: (id: DefinitionId) => void;
  onSetMetric: (id: MetricId) => void;
}

export function CommandPalette({ open, onClose, onSetDefinition, onSetMetric }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "weekly",
        label: "주간 코호트로 전환",
        hint: "매트릭스를 W0~W7 주 단위로 재구성",
        icon: CalendarDays,
        run: () => onSetDefinition("weekly"),
      },
      {
        id: "monthly",
        label: "월간 코호트로 전환",
        hint: "매트릭스를 M0~M7 월 단위로 재구성",
        icon: Calendar,
        run: () => onSetDefinition("monthly"),
      },
      {
        id: "retention",
        label: "사용자 리텐션 지표 보기",
        hint: "활성 사용자 % 기준 매트릭스",
        icon: Percent,
        run: () => onSetMetric("retention"),
      },
      {
        id: "revenue",
        label: "순매출 리텐션 지표 보기",
        hint: "확장매출 포함 매출 유지율 % 기준",
        icon: LineChart,
        run: () => onSetMetric("revenue"),
      },
    ],
    [onSetDefinition, onSetMetric],
  );

  const filtered = commands.filter(
    (c) => c.label.toLowerCase().includes(query.toLowerCase()) || query.trim() === "",
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button
        type="button"
        aria-label="커맨드 팔레트 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="커맨드 팔레트"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 dark:border-white/10">
          <Search className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="명령 검색 — 예: 월간, 매출 리텐션"
            className="h-12 w-full bg-transparent text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
          />
          <kbd className="shrink-0 rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[10.5px] font-medium text-zinc-500 dark:border-white/20 dark:bg-white/10 dark:text-zinc-400">
            ESC
          </kbd>
        </div>
        <ul role="listbox" aria-label="명령 목록" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
              일치하는 명령이 없습니다
            </li>
          ) : (
            filtered.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      c.run();
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-white/10",
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-50">
                        {c.label}
                      </span>
                      <span className="block truncate text-[11.5px] text-zinc-500 dark:text-zinc-400">
                        {c.hint}
                      </span>
                    </span>
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
