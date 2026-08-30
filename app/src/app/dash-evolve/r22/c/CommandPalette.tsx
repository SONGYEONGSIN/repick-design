"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Command, CornerDownLeft, Search, X } from "lucide-react";
import { FOCUS_RING } from "./ui";

export interface PaletteCommand {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export interface CommandPaletteHandle {
  open: () => void;
}

/**
 * ⌘K palette. State (query/highlight/open) resets synchronously inside the
 * imperative `open()` method — the same "handler" a caller invokes to open
 * it — never inside a `useEffect` keyed on the open flag, which is the
 * pattern that trips `react-hooks/set-state-in-effect`.
 */
export const CommandPalette = forwardRef<CommandPaletteHandle, { commands: PaletteCommand[] }>(
  function CommandPalette({ commands }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlight, setHighlight] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setQuery("");
          setHighlight(0);
          setIsOpen(true);
        },
      }),
      [],
    );

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return commands;
      return commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q));
    }, [commands, query]);

    useEffect(() => {
      if (!isOpen) return;
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsOpen(false);
        }
      }
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    function runHighlighted() {
      const cmd = filtered[highlight];
      if (!cmd) return;
      cmd.run();
      setIsOpen(false);
    }

    function onInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, Math.max(0, filtered.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        runHighlighted();
      } else if (e.key === "Tab") {
        // Two focusable stops in this dialog — input, then close button —
        // cycle between them rather than letting Tab escape to the dimmed
        // page behind.
        e.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    function onCloseButtonKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
      if (e.key === "Tab") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    if (!isOpen) return null;

    let flatIndex = -1;
    const groups = new Map<string, { cmd: PaletteCommand; idx: number }[]>();
    for (const cmd of filtered) {
      flatIndex++;
      const list = groups.get(cmd.group) ?? [];
      list.push({ cmd, idx: flatIndex });
      groups.set(cmd.group, list);
    }

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh]" onMouseDown={() => setIsOpen(false)}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/60"
        >
          <div className="flex items-center gap-2.5 border-b border-white/10 px-4">
            <Search size={16} className="shrink-0 text-zinc-400" aria-hidden="true" />
            <input
              ref={inputRef}
              autoFocus
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-activedescendant={filtered[highlight] ? `palette-opt-${highlight}` : undefined}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Set a metric, group-by, period, or saved question…"
              className={`h-12 w-full rounded bg-transparent text-sm font-normal text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close command palette"
              onClick={() => setIsOpen(false)}
              onKeyDown={onCloseButtonKeyDown}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-zinc-50 ${FOCUS_RING}`}
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <div id="palette-list" role="listbox" aria-label="Commands" className="max-h-80 overflow-auto p-1.5">
            {filtered.length === 0 && <p className="px-3 py-6 text-center text-sm font-normal text-zinc-400">No matches.</p>}
            {[...groups.entries()].map(([group, entries]) => {
              const groupId = `palette-group-${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              return (
              // A plain `role="group"` div (not `<ul>/<li>`) directly containing
              // `role="option"` children — a listbox's required-children check
              // wants option (or group-of-option) descendants with no other
              // implicit list semantics in between.
              <div key={group} role="group" aria-labelledby={groupId}>
                <p id={groupId} role="presentation" className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                  {group}
                </p>
                {entries.map(({ cmd, idx }) => (
                  <div
                    key={cmd.id}
                    id={`palette-opt-${idx}`}
                    role="option"
                    aria-selected={idx === highlight}
                    tabIndex={-1}
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => {
                      cmd.run();
                      setIsOpen(false);
                    }}
                    className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-[13px] ${
                      idx === highlight ? "bg-white/10 text-zinc-50" : "text-zinc-300"
                    }`}
                  >
                    <span className="truncate font-medium">{cmd.label}</span>
                    {idx === highlight && <CornerDownLeft size={13} className="shrink-0 text-[#5b9bec]" aria-hidden="true" />}
                  </div>
                ))}
              </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5 border-t border-white/10 px-4 py-2 text-[11px] font-normal text-zinc-400">
            <Command size={12} aria-hidden="true" />
            <span>K to reopen · Enter to run · Esc to close</span>
          </div>
        </div>
      </div>
    );
  },
);
