"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Route, Search, SquarePlus, X } from "lucide-react";
import { DEPARTMENTS, PERIODS, type Period } from "./data";
import { FOCUS_RING } from "./ui";

type Command = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

export default function CommandPalette({
  open,
  onClose,
  onSetPeriod,
  onOpenNewRule,
}: {
  open: boolean;
  onClose: () => void;
  onSetPeriod: (period: Period) => void;
  onOpenNewRule: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query when the palette opens, adjusted during render against the previous `open`
  // value rather than in a useEffect body, to avoid the cascading-render setState-in-effect
  // pattern. Focusing the input is a genuine DOM side effect and stays in its own effect.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onWindowKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onWindowKeyDown);
    return () => window.removeEventListener("keydown", onWindowKeyDown);
  }, [open, onClose]);

  const commands: Command[] = useMemo(() => {
    const jumps: Command[] = DEPARTMENTS.map((dept) => ({
      id: `jump-${dept.id}`,
      label: `Jump to ${dept.name}`,
      hint: "Routing map",
      run: () => {
        const el = document.getElementById(`chord-node-${dept.id}`);
        el?.focus();
      },
    }));
    const periodCommands: Command[] = PERIODS.map((p) => ({
      id: `period-${p.value}`,
      label: `Switch to ${p.label}`,
      hint: "View",
      run: () => onSetPeriod(p.value),
    }));
    const actionCommands: Command[] = [
      {
        id: "new-rule",
        label: "New routing rule",
        hint: "Action",
        run: onOpenNewRule,
      },
    ];
    return [...actionCommands, ...jumps, ...periodCommands];
  }, [onSetPeriod, onOpenNewRule]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  function execute(command: Command) {
    command.run();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/30" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative mx-auto mt-24 w-[calc(100%-2rem)] max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div className="flex h-11 items-center gap-2 border-b border-zinc-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search departments or run a command…"
            aria-label="Search departments or commands"
            className="h-full flex-1 bg-transparent font-normal text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center font-normal text-sm text-zinc-500">No matches for &ldquo;{query}&rdquo;.</li>
          ) : (
            filtered.map((command) => {
              const Icon = command.hint === "Action" ? SquarePlus : Route;
              return (
                <li key={command.id}>
                  <button
                    type="button"
                    onClick={() => execute(command)}
                    className={`flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left motion-safe:transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate font-normal text-sm text-zinc-900">{command.label}</span>
                    <span className="shrink-0 font-normal text-[11px] uppercase tracking-[0.06em] text-zinc-500">{command.hint}</span>
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
