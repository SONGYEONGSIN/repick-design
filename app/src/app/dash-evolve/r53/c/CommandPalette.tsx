"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Search, X, CornerDownLeft, AlertCircle, Calendar } from "lucide-react";
import { INCIDENTS, type Period } from "./data";
import { FOCUS_RING } from "./ui";

interface Command {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onSwitchPeriod,
  onPreviewIncident,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  onSwitchPeriod: (period: Period) => void;
  onPreviewIncident: (id: string) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Reset query + selection whenever the palette transitions from closed to open, and reset the
  // selection whenever the query changes — both adjusted during render (React's documented pattern
  // for resetting state on a change: https://react.dev/learn/you-might-not-need-an-effect) rather
  // than inside an effect body, since a synchronous setState call inside an effect is disallowed by
  // this repo's lint config (react-hooks/set-state-in-effect).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const commands: Command[] = useMemo(
    () => [
      { id: "period-this", group: "Switch period", label: "This month", hint: "Hero + stats", run: () => onSwitchPeriod("this-month") },
      { id: "period-last", group: "Switch period", label: "Last month", hint: "Hero + stats", run: () => onSwitchPeriod("last-month") },
      ...INCIDENTS.map((incident) => ({
        id: `incident-${incident.id}`,
        group: "Jump to incident",
        label: `${incident.id} — ${incident.title}`,
        hint: incident.service,
        run: () => onPreviewIncident(incident.id),
      })),
    ],
    [onSwitchPeriod, onPreviewIncident],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    triggerRef.current?.focus();
  }, [open, triggerRef]);

  if (!open) return null;

  const activeId = filtered.length ? `${listboxId}-option-${activeIndex}` : undefined;

  function runActive() {
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    cmd.run();
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    } else if (e.key === "Tab") {
      // Minimal focus trap: this dialog has exactly one focusable control (the input), so Tab
      // simply keeps focus there instead of escaping to the page behind the overlay.
      e.preventDefault();
    }
  }

  let groupCursor = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
      >
        <div className="flex h-11 items-center gap-2 border-b border-zinc-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            placeholder="Search incidents or switch period…"
            className="h-full flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
          />
          <button
            type="button"
            aria-label="Close command palette"
            onClick={onClose}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul id={listboxId} role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No matches.</li>
          ) : (
            filtered.map((cmd, index) => {
              const showGroupHeader = cmd.group !== groupCursor;
              groupCursor = cmd.group;
              const isActive = index === activeIndex;
              return (
                <li key={cmd.id}>
                  {showGroupHeader ? (
                    <div className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                      {cmd.group}
                    </div>
                  ) : null}
                  <div
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      cmd.run();
                      onClose();
                    }}
                    className={`flex h-9 cursor-pointer items-center gap-2 rounded-md px-2.5 text-sm ${
                      isActive ? "bg-orange-50 text-orange-700" : "text-zinc-700"
                    }`}
                  >
                    {cmd.group === "Switch period" ? (
                      <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                    <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                    {cmd.hint ? <span className="shrink-0 text-xs text-zinc-500">{cmd.hint}</span> : null}
                    {isActive ? <CornerDownLeft className="h-3 w-3 shrink-0 text-zinc-500" aria-hidden="true" /> : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
