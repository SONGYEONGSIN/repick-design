"use client";

/**
 * Bonus interaction: a working command palette. Opens via the top bar
 * trigger button or the global Cmd/Ctrl+K shortcut, filters a short static
 * command list, and runs the selected command's callback. It does not touch
 * the funnel's pin state or the period toggle directly — commands call back
 * into dashboard-client's own setters, same as clicking the controls would.
 */

import { useEffect, useId, useRef, useState } from "react";
import { Command, Search, X } from "lucide-react";

export interface PaletteCommand {
  id: string;
  label: string;
  hint: string;
  onRun: () => void;
}

export function CommandPalette({ commands }: { commands: PaletteCommand[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()));

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Resets the palette's own query/highlight state and opens it. Called from
  // event handlers (the trigger click, the ⌘K keydown) rather than from a
  // `useEffect` on `open` — setting state synchronously inside an effect body
  // is a lint error, and there's no reason to defer it to an effect when both
  // call sites are already handlers reacting to a real user action.
  function openPalette() {
    setQuery("");
    setHighlighted(0);
    setOpen(true);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape" && open) {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus-management only: moving focus into the input is a real DOM effect
  // that has to happen after the dialog mounts, so it stays in an effect —
  // it just no longer also carries the two setState calls above.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  function runHighlighted() {
    const cmd = filtered[highlighted];
    if (cmd) {
      cmd.onRun();
      close();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPalette}
        className="flex h-11 items-center gap-2.5 rounded-lg border border-white/10 bg-zinc-900 px-3.5 text-sm text-zinc-400 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:w-64"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        {/* Visually hidden below `sm`, but kept in the accessible name at every
            width via `sr-only` (not `hidden`) — a `display:none` label would
            leave this button with only its aria-hidden icon as a name. */}
        <span className="sr-only sm:not-sr-only">Search or jump to&hellip;</span>
        <span aria-hidden="true" className="hidden sm:ml-auto sm:flex sm:items-center sm:gap-0.5 sm:text-xs sm:text-zinc-400">
          <Command className="h-3 w-3" aria-hidden />K
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[14vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={filtered[highlighted] ? `${listboxId}-option-${highlighted}` : undefined}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlighted(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlighted((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlighted((h) => Math.max(h - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    runHighlighted();
                  }
                }}
                placeholder="Type a command…"
                className="h-9 w-full rounded-md border-0 bg-transparent text-sm text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close command palette"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <ul id={listboxId} role="listbox" aria-label="Commands" className="max-h-72 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <li role="presentation" className="px-3 py-6 text-center text-sm text-zinc-400">
                  No matching commands.
                </li>
              ) : (
                filtered.map((cmd, i) => (
                  <li key={cmd.id}>
                    <button
                      id={`${listboxId}-option-${i}`}
                      type="button"
                      role="option"
                      aria-selected={i === highlighted}
                      tabIndex={-1}
                      onMouseEnter={() => setHighlighted(i)}
                      onClick={() => {
                        cmd.onRun();
                        close();
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                        i === highlighted ? "bg-violet-500/15 text-zinc-50" : "text-zinc-300"
                      }`}
                    >
                      <span className="font-medium">{cmd.label}</span>
                      <span className="text-xs text-zinc-400">{cmd.hint}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
