"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Filter, Inbox, Search, TriangleAlert, Users } from "lucide-react";
import type { ChannelFilter, Period } from "./types";
import { CHANNEL_FILTERS, PERIOD_STATS, PERIODS } from "./data";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onSetPeriod,
  onSetChannel,
  onExpandCard,
}: {
  open: boolean;
  onClose: () => void;
  onSetPeriod: (p: Period) => void;
  onSetChannel: (c: ChannelFilter) => void;
  onExpandCard: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(
    () => [
      ...PERIODS.map((p) => ({
        id: `period-${p}`,
        label: `기간: ${PERIOD_STATS[p].label} 보기`,
        hint: "기간 토글",
        icon: Clock3,
        run: () => onSetPeriod(p),
      })),
      ...CHANNEL_FILTERS.map((c) => ({
        id: `channel-${c.value}`,
        label: `채널: ${c.label} 보기`,
        hint: "채널 필터",
        icon: Filter,
        run: () => onSetChannel(c.value),
      })),
      {
        id: "expand-queue",
        label: "채널별 대기열 카드 펼치기",
        hint: "벤토 카드",
        icon: Inbox,
        run: () => onExpandCard("queue"),
      },
      {
        id: "expand-escalations",
        label: "에스컬레이션 카드 펼치기",
        hint: "벤토 카드",
        icon: TriangleAlert,
        run: () => onExpandCard("escalations"),
      },
      {
        id: "expand-agents",
        label: "에이전트 워크로드 카드 펼치기",
        hint: "벤토 카드",
        icon: Users,
        run: () => onExpandCard("agents"),
      },
    ],
    [onSetPeriod, onSetChannel, onExpandCard]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  if (!open) return null;

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[highlight];
      if (cmd) {
        cmd.run();
        onClose();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24" onKeyDown={handleKeyDown}>
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-zinc-950/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="명령 팔레트"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex h-12 items-center gap-2 border-b border-white/10 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="명령 검색 — 기간, 채널, 카드 펼치기..."
            aria-label="명령 검색"
            aria-activedescendant={filtered[highlight] ? `cmd-${filtered[highlight].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
        <ul id="command-list" role="listbox" aria-label="명령 목록" className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 && <li className="px-3.5 py-6 text-center text-[13px] text-zinc-500">일치하는 명령이 없습니다.</li>}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            const active = i === highlight;
            return (
              <li key={cmd.id} id={`cmd-${cmd.id}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => {
                    cmd.run();
                    onClose();
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition-colors ${
                    active ? "bg-sky-500/15 text-sky-200" : "text-zinc-300"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                  <span className="shrink-0 text-[11px] text-zinc-500">{cmd.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
