"use client";

import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Search, X } from "lucide-react";
import { FOCUS } from "./ui";

export interface PaletteCommand {
  id: string;
  group: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  run: () => void;
}

/** Mount/unmount: while closed this renders nothing, so every open is a fresh `<PaletteBody>` mount
 *  with no stale query/highlight to reset (no extra effect needed). */
export function CommandPalette({ open, onClose, commands }: { open: boolean; onClose: () => void; commands: PaletteCommand[] }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="fixed inset-0 bg-zinc-900/40" />
      <PaletteBody key="palette-body" commands={commands} onClose={onClose} />
    </div>
  );
}

function PaletteBody({ commands, onClose }: { commands: PaletteCommand[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const filtered = commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(query.toLowerCase()));
  const safeHighlighted = filtered.length === 0 ? -1 : Math.min(highlighted, filtered.length - 1);

  function run(cmd: PaletteCommand) {
    cmd.run();
    onClose();
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (filtered.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const cmd = filtered[safeHighlighted];
      if (cmd) run(cmd);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="palette-heading"
      onClick={(event) => event.stopPropagation()}
      className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl"
    >
      <h2 id="palette-heading" className="sr-only">
        Command palette
      </h2>
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-listbox"
          aria-activedescendant={safeHighlighted >= 0 ? `palette-option-${safeHighlighted}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlighted(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Pin a plan, switch the period&hellip;"
          className={`${FOCUS} w-full min-w-0 rounded-md bg-transparent py-1 text-sm font-normal text-zinc-900 placeholder:text-zinc-500`}
        />
        <button type="button" onClick={onClose} aria-label="Close command palette" className={`${FOCUS} shrink-0 rounded-md p-2 text-zinc-500 hover:text-zinc-900`}>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ul id="palette-listbox" role="listbox" aria-label="Command palette results" className="mt-1 max-h-80 space-y-0.5 overflow-y-auto p-1">
        {filtered.map((cmd, index) => {
          const isHighlighted = index === safeHighlighted;
          const Icon = cmd.icon;
          return (
            <li
              key={cmd.id}
              id={`palette-option-${index}`}
              role="option"
              aria-selected={isHighlighted}
              tabIndex={-1}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => run(cmd)}
              className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${isHighlighted ? "bg-emerald-50" : "hover:bg-zinc-50"}`}
            >
              <Icon className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-900">{cmd.label}</span>
                <span className="block truncate text-xs font-normal text-zinc-600">
                  {cmd.group} &middot; {cmd.hint}
                </span>
              </span>
            </li>
          );
        })}
        {filtered.length === 0 && <li className="px-3 py-2.5 text-sm font-normal text-zinc-600">No matches.</li>}
      </ul>
    </div>
  );
}
