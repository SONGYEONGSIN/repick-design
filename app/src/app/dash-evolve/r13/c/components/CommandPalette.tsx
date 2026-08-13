"use client";

import { CalendarDays, CalendarHeart, Search, Share2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CHANNELS, type ChannelId, ITEMS, MONTHS, monthLabel } from "../data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  onClose,
  onGoToMonth,
  onGoToToday,
  onFilterChannelOnly,
  onClearFilters,
}: {
  onClose: () => void;
  onGoToMonth: (index: number) => void;
  onGoToToday: () => void;
  onFilterChannelOnly: (id: ChannelId) => void;
  onClearFilters: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedTitles = useMemo(() => {
    if (q === "") return [];
    return ITEMS.filter((i) => i.title.toLowerCase().includes(q)).slice(0, 5);
  }, [q]);

  const monthCommands = MONTHS.filter((m) => q === "" || monthLabel(m.year, m.month).toLowerCase().includes(q));
  const channelCommands = CHANNELS.filter((c) => q === "" || c.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a month, channel, or post…"
            aria-label="Search the content calendar"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 [scrollbar-width:thin]">
          {q !== "" && matchedTitles.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <EyebrowLabel>Posts</EyebrowLabel>
              </div>
              {matchedTitles.map((item) => {
                const monthIdx = MONTHS.findIndex((m) => m.year === item.year && m.month === item.month);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (monthIdx >= 0) onGoToMonth(monthIdx);
                      onClose();
                    }}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                  >
                    <CalendarDays size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Navigate</EyebrowLabel>
            </div>
            <button
              type="button"
              onClick={() => {
                onGoToToday();
                onClose();
              }}
              className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
            >
              <CalendarHeart size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
              Jump to today
            </button>
            {monthCommands.map((m) => {
              const idx = MONTHS.findIndex((mm) => mm.year === m.year && mm.month === m.month);
              return (
                <button
                  key={`${m.year}-${m.month}`}
                  type="button"
                  onClick={() => {
                    onGoToMonth(idx);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                >
                  <CalendarDays size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  Go to {monthLabel(m.year, m.month)}
                </button>
              );
            })}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Filter</EyebrowLabel>
            </div>
            <button
              type="button"
              onClick={() => {
                onClearFilters();
                onClose();
              }}
              className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
            >
              <Share2 size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
              Show every channel
            </button>
            {channelCommands.map((c) => {
              const Icon = c.Icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onFilterChannelOnly(c.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                >
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    <Icon size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                    {c.label} only
                  </span>
                  <span className="shrink-0 rounded-full bg-orange-500/12 px-1.5 py-0.5 text-[10px] font-medium text-orange-300">Filter</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
