"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Download, Search, Workflow } from "lucide-react";
import type { Period } from "./data";
import { CHANNELS_BY_PERIOD, PERIODS } from "./data";
import { FOCUS_RING } from "./ui";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: typeof Workflow;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  period,
  onSelectPeriod,
  onSelectChannel,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  period: Period;
  onSelectPeriod: (p: Period) => void;
  onSelectChannel: (id: string) => void;
  onExport: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  // Tracks the previous `open` value so a true->false->true transition can reset `query`/
  // `activeIndex` right here, during render — React's documented pattern for "adjusting state
  // when a prop changes" (react.dev/learn/you-might-not-need-an-effect). This is deliberately NOT
  // a `useEffect`: calling setState synchronously inside an effect to mirror a prop is exactly
  // what `react-hooks/set-state-in-effect` flags, and the DOM-focus effect below is the only
  // genuine side effect this component has.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(() => {
    const periodCommands: Command[] = PERIODS.filter((p) => p.value !== period).map((p) => ({
      id: `period-${p.value}`,
      label: `Switch to ${p.label.toLowerCase()}`,
      hint: "Period",
      icon: Calendar,
      run: () => onSelectPeriod(p.value),
    }));
    const channelCommands: Command[] = CHANNELS_BY_PERIOD[period].map((c) => ({
      id: `channel-${c.id}`,
      label: `Open channel: ${c.name}`,
      hint: "Channel",
      icon: Workflow,
      run: () => onSelectChannel(c.id),
    }));
    const exportCommand: Command = {
      id: "export",
      label: "Export lifecycle data to CSV",
      hint: "Action",
      icon: Download,
      run: onExport,
    };
    return [...periodCommands, ...channelCommands, exportCommand];
  }, [period, onSelectPeriod, onSelectChannel, onExport]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  // The one genuine side effect here: moving real DOM focus into the input on open. No `setState`
  // call lives in this effect — the state reset above happens during render instead.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  // `activeIndex` is clamped at use-time rather than reset via an effect keyed on `query`: if the
  // filtered list shrinks, the stale index is simply pulled back in range for this render, with
  // no extra `setState` call needed at all.
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, filtered.length - 1));

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(Math.min(i, filtered.length - 1) + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(Math.min(i, filtered.length - 1) - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[safeActiveIndex];
        if (cmd) {
          cmd.run();
          onClose();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, safeActiveIndex, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className={`absolute inset-0 bg-zinc-900/40 ${FOCUS_RING}`} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl motion-safe:animate-[rise_150ms_ease-out]"
      >
        <div className="flex h-12 items-center gap-2 border-b border-zinc-200 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={filtered[safeActiveIndex] ? `command-option-${filtered[safeActiveIndex].id}` : undefined}
            placeholder="Switch period, jump to a channel, export…"
            className={`h-full min-w-0 flex-1 rounded bg-transparent font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <kbd className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-normal text-[11px] text-zinc-500">Esc</kbd>
        </div>
        <ul id="command-palette-list" role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center font-normal text-sm text-zinc-500">No matching commands.</li>
          ) : (
            filtered.map((cmd, i) => (
              // DOM focus stays on the search input throughout (the combobox pattern) — this
              // `<li>` IS the option, with no nested interactive element, which is what the
              // `aria-activedescendant` + `role="option"` pairing requires to stay valid.
              <li
                key={cmd.id}
                id={`command-option-${cmd.id}`}
                role="option"
                aria-selected={i === safeActiveIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  cmd.run();
                  onClose();
                }}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 ${i === safeActiveIndex ? "bg-blue-50" : ""}`}
              >
                <cmd.icon className={`h-4 w-4 shrink-0 ${i === safeActiveIndex ? "text-blue-700" : "text-zinc-500"}`} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate font-normal text-sm text-zinc-900">{cmd.label}</span>
                <span className="shrink-0 font-normal text-[11px] uppercase tracking-wide text-zinc-500">{cmd.hint}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
