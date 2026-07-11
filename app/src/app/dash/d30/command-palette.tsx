"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarCheck2, House, Layers, Link2, Search, UserCheck } from "lucide-react";
import type { EventTypeId } from "./data";
import { EVENT_TYPES } from "./data";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  icon: typeof House;
  disabled?: boolean;
  onSelect?: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelectEventType: (id: EventTypeId) => void;
}

export function CommandPalette({ open, onClose, onSelectEventType }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const items: CommandItem[] = useMemo(
    () => [
      { id: "overview", label: "개요로 이동", hint: "페이지", icon: House, disabled: true },
      {
        id: "bookings",
        label: "예약 현황으로 이동",
        hint: "현재 페이지",
        icon: CalendarCheck2,
        disabled: true,
      },
      {
        id: "availability",
        label: "팀 가용성으로 이동",
        hint: "페이지",
        icon: UserCheck,
        disabled: true,
      },
      { id: "integrations", label: "캘린더 연동", hint: "페이지", icon: Link2, disabled: true },
      ...EVENT_TYPES.map((t) => ({
        id: `filter-${t.id}`,
        label: `이벤트 타입 필터 · ${t.name}`,
        hint: `${t.durationMin}분`,
        icon: Layers,
        onSelect: () => {
          onSelectEventType(t.id);
          onClose();
        },
      })),
    ],
    [onClose, onSelectEventType],
  );

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-zinc-900/40 px-4 pt-24">
      <button
        type="button"
        aria-label="빠른 검색 닫기"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="빠른 검색"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex h-12 items-center gap-2 border-b border-zinc-100 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="페이지, 이벤트 타입 검색…"
            aria-label="빠른 검색 입력"
            className="h-full flex-1 border-0 bg-transparent text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <kbd className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
            Esc
          </kbd>
        </div>
        <ul role="listbox" aria-label="검색 결과" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-[13px] text-zinc-400">
              검색 결과가 없습니다
            </li>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    disabled={item.disabled}
                    onClick={item.onSelect}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="shrink-0 text-[11px] text-zinc-400">{item.hint}</span>
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
