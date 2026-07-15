"use client";

import { ArrowRight, CalendarRange, Filter, LayoutGrid, RotateCcw, Search, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CHANNEL_ORDER, type ChannelId } from "../lib/data";
import { CHANNEL_META } from "./ui";
import type { CalendarView } from "./CadenceClient";

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
  onSetView: (v: CalendarView) => void;
  onGoToday: () => void;
  onOnlyChannel: (c: ChannelId) => void;
  onResetChannels: () => void;
}

export default function CommandPalette({ open, onClose, onSetView, onGoToday, onOnlyChannel, onResetChannels }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(() => {
    const close = (fn: () => void) => () => {
      fn();
      onClose();
    };
    const channelCommands: Command[] = CHANNEL_ORDER.map((c) => ({
      id: `only-${c}`,
      group: "채널",
      label: `${CHANNEL_META[c].label}만 보기`,
      Icon: CHANNEL_META[c].Icon,
      run: close(() => onOnlyChannel(c)),
    }));
    return [
      { id: "view-month", group: "보기", label: "월간 보기로 전환", Icon: LayoutGrid, run: close(() => onSetView("month")) },
      { id: "view-week", group: "보기", label: "주간 보기로 전환", Icon: CalendarRange, run: close(() => onSetView("week")) },
      { id: "today", group: "이동", label: "오늘로 이동 (주간 보기)", Icon: RotateCcw, run: close(onGoToday) },
      { id: "all-channels", group: "채널", label: "모든 채널 보기", Icon: Filter, run: close(onResetChannels) },
      ...channelCommands,
    ];
  }, [onClose, onSetView, onGoToday, onOnlyChannel, onResetChannels]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  // 열림 상태 전환 시 검색어/선택 인덱스 초기화 — 렌더 중 상태 조정(React 권장 패턴),
  // useEffect 내부에서의 setState(케스케이딩 렌더 유발)를 피한다.
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActive(0);
    }
  }

  // 포커스 이동은 DOM 부수효과이므로 여기서만 effect 사용(setState 없음).
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const clampedActive = Math.min(active, Math.max(0, filtered.length - 1));

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
      filtered[clampedActive]?.run();
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
            aria-controls="cadence-palette-list"
            aria-autocomplete="list"
            placeholder="명령 검색 — 보기, 채널, 이동…"
            className="h-12 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline">esc</kbd>
        </div>

        <ul id="cadence-palette-list" role="listbox" aria-label="명령 목록" className="max-h-72 overflow-y-auto p-1.5">
          {filtered.map((cmd, i) => {
            const isActive = i === clampedActive;
            const showGroup = i === 0 || filtered[i - 1].group !== cmd.group;
            return (
              <li key={cmd.id} role="presentation">
                {showGroup && <p className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">{cmd.group}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => setActive(i)}
                  onClick={() => cmd.run()}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors motion-reduce:transition-none ${
                    isActive ? "bg-indigo-50 text-indigo-900" : "text-zinc-700"
                  }`}
                >
                  <cmd.Icon className={`size-4 shrink-0 ${isActive ? "text-indigo-600" : "text-zinc-400"}`} aria-hidden="true" />
                  <span className="flex-1 truncate">{cmd.label}</span>
                  {isActive && <ArrowRight className="size-3.5 shrink-0 text-indigo-500" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-zinc-500">일치하는 명령이 없습니다.</li>}
        </ul>
      </div>
    </div>
  );
}
