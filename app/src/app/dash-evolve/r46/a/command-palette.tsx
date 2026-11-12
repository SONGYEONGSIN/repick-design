"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Download, FileBarChart, Plug, Search, Trophy, Workflow, X, type LucideIcon } from "lucide-react";
import { FOCUS_RING } from "./ui";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  action?: "export";
}

const COMMANDS: Command[] = [
  { id: "c1", label: "Go to Leaderboard", hint: "Current view", icon: Trophy },
  { id: "c2", label: "Go to Workflows", hint: "Navigation", icon: Workflow },
  { id: "c3", label: "Go to Connections", hint: "Navigation", icon: Plug },
  { id: "c4", label: "Go to Usage Reports", hint: "Navigation", icon: FileBarChart },
  { id: "c5", label: "Go to Alerts", hint: "Navigation", icon: AlertCircle },
  { id: "c6", label: "Export leaderboard CSV", hint: "Action", icon: Download, action: "export" },
];

export function CommandPalette({ open, onClose, onExport }: { open: boolean; onClose: () => void; onExport: () => void }) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query by comparing to a stored previous `open` value during render, rather than in a
  // `useEffect` that reacts to `open` changing — avoids the derived-state-in-effect anti-pattern.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const results = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));

  function run(command: Command) {
    if (command.action === "export") onExport();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24">
      <div role="dialog" aria-modal="true" aria-label="Search integrations and actions" className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
        <div className="flex h-11 items-center gap-2 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
            aria-label="Search integrations and actions by name"
            placeholder="Search integrations, actions…"
            className={`w-full rounded-md bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center font-normal text-sm text-zinc-400">No matches for &quot;{query}&quot;.</p>
          ) : (
            <ul>
              {results.map((command) => (
                <li key={command.id}>
                  <button
                    type="button"
                    onClick={() => run(command)}
                    className={`flex w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
                  >
                    <command.icon className="h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{command.label}</span>
                    <span className="shrink-0 font-normal text-xs text-zinc-400">{command.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
