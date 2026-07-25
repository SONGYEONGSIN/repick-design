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
  const dialogRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = useMemo(
    () => [
      ...PERIODS.map((p) => ({
        id: `period-${p}`,
        label: `View period: ${PERIOD_STATS[p].label}`,
        hint: "Period toggle",
        icon: Clock3,
        run: () => onSetPeriod(p),
      })),
      ...CHANNEL_FILTERS.map((c) => ({
        id: `channel-${c.value}`,
        label: `View channel: ${c.label}`,
        hint: "Channel filter",
        icon: Filter,
        run: () => onSetChannel(c.value),
      })),
      {
        id: "expand-queue",
        label: "Expand channel queue card",
        hint: "Bento card",
        icon: Inbox,
        run: () => onExpandCard("queue"),
      },
      {
        id: "expand-escalations",
        label: "Expand escalations card",
        hint: "Bento card",
        icon: TriangleAlert,
        run: () => onExpandCard("escalations"),
      },
      {
        id: "expand-agents",
        label: "Expand agent workload card",
        hint: "Bento card",
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
    } else if (e.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24" onKeyDown={handleKeyDown}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-zinc-950/70" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex h-12 items-center gap-2 rounded-t-xl border-b border-white/10 px-3.5 focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-inset">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands — period, channel, expand card..."
            aria-label="Search commands"
            aria-activedescendant={filtered[highlight] ? `cmd-${filtered[highlight].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
        <ul id="command-list" role="listbox" aria-label="Command list" className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 && <li className="px-3.5 py-6 text-center text-[13px] text-zinc-400">No matching commands.</li>}
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
                  <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                  <span className="shrink-0 text-[11px] text-zinc-400">{cmd.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
