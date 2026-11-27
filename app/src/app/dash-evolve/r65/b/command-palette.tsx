"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, BarChart3, Users, Search } from "lucide-react";
import { FOCUS_RING } from "./ui";
import { SEVERITY_LABEL, SEVERITY_ORDER, type Severity } from "./data";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: typeof Filter;
  run: () => void;
}

interface CommandPaletteProps {
  onClose: () => void;
  onSetSeverityFilter: (severity: Severity | "all") => void;
  onJumpTo: (target: "health" | "reviewers") => void;
}

export function CommandPalette({ onClose, onSetSeverityFilter, onJumpTo }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastQuery, setLastQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the highlighted row whenever the query changes. Adjusted during render (not in an
  // effect) per React's guidance for resetting state in response to a prop/state change — this
  // avoids an extra commit-then-rerender cascade.
  if (query !== lastQuery) {
    setLastQuery(query);
    setActiveIndex(0);
  }

  const commands = useMemo<Command[]>(() => {
    const severityCommands: Command[] = SEVERITY_ORDER.map((s) => ({
      id: `filter-${s}`,
      label: `Filter queue: ${SEVERITY_LABEL[s]} severity`,
      hint: "Feed",
      icon: Filter,
      run: () => onSetSeverityFilter(s),
    }));
    return [
      { id: "filter-all", label: "Filter queue: All severities", hint: "Feed", icon: Filter, run: () => onSetSeverityFilter("all") },
      ...severityCommands,
      { id: "jump-health", label: "Jump to queue health", hint: "Panel", icon: BarChart3, run: () => onJumpTo("health") },
      { id: "jump-reviewers", label: "Jump to reviewer leaderboard", hint: "Panel", icon: Users, run: () => onJumpTo("reviewers") },
    ];
  }, [onSetSeverityFilter, onJumpTo]);

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) {
          cmd.run();
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtered, activeIndex, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" className="absolute inset-0 bg-zinc-900/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            aria-label="Search commands"
            className="h-12 w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={filtered[activeIndex]?.id}
          />
        </div>
        <ul id="command-list" role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-zinc-500">No matching commands.</li>}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <li key={cmd.id} role="option" aria-selected={i === activeIndex} id={cmd.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    cmd.run();
                    onClose();
                  }}
                  className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm ${FOCUS_RING} ${
                    i === activeIndex ? "bg-orange-50 text-orange-700" : "text-zinc-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1 truncate">{cmd.label}</span>
                  <span className="shrink-0 text-xs text-zinc-500">{cmd.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
