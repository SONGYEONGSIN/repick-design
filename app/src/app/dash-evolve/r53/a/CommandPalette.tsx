"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Activity, Inbox, ShieldAlert, BarChart3, Settings, ShieldX, X } from "lucide-react";
import { FOCUS_RING } from "./ui";
import type { Section } from "./Sidebar";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: typeof Activity;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  onFilterHighOnly,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (s: Section) => void;
  onFilterHighOnly: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query when the palette transitions from closed to open. Derived during
  // render (not inside an effect) so opening the palette never leaves stale text behind.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const commands: Command[] = useMemo(
    () => [
      { id: "go-feed", label: "Go to Feed", hint: "Navigation", icon: Activity, run: () => onNavigate("feed") },
      { id: "go-queues", label: "Go to Queues", hint: "Navigation", icon: Inbox, run: () => onNavigate("queues") },
      { id: "go-rules", label: "Go to Rules", hint: "Navigation", icon: ShieldAlert, run: () => onNavigate("rules") },
      { id: "go-reports", label: "Go to Reports", hint: "Navigation", icon: BarChart3, run: () => onNavigate("reports") },
      { id: "go-settings", label: "Go to Settings", hint: "Navigation", icon: Settings, run: () => onNavigate("settings") },
      {
        id: "filter-high",
        label: "Filter feed to high risk only",
        hint: "Action",
        icon: ShieldX,
        run: () => {
          onFilterHighOnly();
          onNavigate("feed");
        },
      },
    ],
    [onNavigate, onFilterHighOnly]
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-black/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex h-11 items-center gap-2 border-b border-white/10 px-4">
          <Search size={16} className="text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={"Type a command or search…"}
            aria-label="Command palette search"
            className="h-full flex-1 rounded-md bg-transparent px-1 text-sm text-zinc-50 placeholder:text-zinc-400 outline-none focus-visible:bg-zinc-800"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 ${FOCUS_RING}`}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-xs text-zinc-400">No matching commands</li>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onClick={() => {
                      cmd.run();
                      onClose();
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800 ${FOCUS_RING}`}
                  >
                    <Icon size={15} className="text-zinc-400" aria-hidden="true" />
                    <span className="flex-1">{cmd.label}</span>
                    <span className="text-[11px] text-zinc-400">{cmd.hint}</span>
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
