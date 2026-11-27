"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, Filter, LayoutDashboard, Search, Ticket as TicketIcon, Users, XCircle } from "lucide-react";
import { TEAMS, TeamId } from "./data";
import { FOCUS_RING, TEXT } from "./tokens";

type CommandItem = {
  id: string;
  label: string;
  hint: string;
  icon: typeof Command;
  run: () => void;
};

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  onSelectTeam,
  onClearFilters,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: "overview" | "tickets" | "teams" | "reports") => void;
  onSelectTeam: (id: TeamId) => void;
  onClearFilters: () => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(() => {
    const nav: CommandItem[] = [
      { id: "nav-overview", label: "Jump to Overview", hint: "Section", icon: LayoutDashboard, run: () => onNavigate("overview") },
      { id: "nav-tickets", label: "Jump to Ticket activity", hint: "Section", icon: TicketIcon, run: () => onNavigate("tickets") },
      { id: "nav-teams", label: "Jump to Team resolution times", hint: "Section", icon: Users, run: () => onNavigate("teams") },
      { id: "nav-reports", label: "Jump to SLA pulse", hint: "Section", icon: LayoutDashboard, run: () => onNavigate("reports") },
    ];
    const teamFilters: CommandItem[] = TEAMS.map((t) => ({
      id: `team-${t.id}`,
      label: `Filter to ${t.name}`,
      hint: "Team",
      icon: Filter,
      run: () => onSelectTeam(t.id),
    }));
    const clear: CommandItem = { id: "clear", label: "Clear all filters", hint: "Action", icon: XCircle, run: onClearFilters };
    return [...nav, ...teamFilters, clear];
  }, [onNavigate, onSelectTeam, onClearFilters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  // Clamp during render rather than in a reactive effect — `highlight` only ever needs to be
  // read through this derived value, so there is nothing to "synchronize" after the fact.
  const safeHighlight = Math.min(highlight, Math.max(0, filtered.length - 1));

  // React's own pattern for "reset state when a prop transitions" — compare against the
  // previous render's `open` value during render itself, not in an effect, so this isn't a
  // setState-in-effect cascade. The DOM focus call below still needs a real effect since it
  // touches an external system (the input element), not React state.
  const prevOpenRef = useRef(open);
  if (open !== prevOpenRef.current) {
    prevOpenRef.current = open;
    if (open) {
      setQuery("");
      setHighlight(0);
    }
  }

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[safeHighlight];
        if (item) {
          item.run();
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, safeHighlight, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
          <Search aria-hidden="true" className="h-4 w-4 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections, teams, actions…"
            aria-label="Search the command palette"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={filtered.length > 0}
            aria-controls="command-palette-list"
            aria-activedescendant={filtered[safeHighlight] ? `cmd-item-${filtered[safeHighlight].id}` : undefined}
            className={`flex-1 rounded bg-transparent text-sm ${TEXT.primary} placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400">Esc</kbd>
        </div>
        <ul id="command-palette-list" role="listbox" aria-label="Command results" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className={`px-3 py-6 text-center text-sm ${TEXT.muted}`}>No matching commands.</li>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              const active = i === safeHighlight;
              return (
                <li key={item.id} id={`cmd-item-${item.id}`} role="option" aria-selected={active}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => {
                      item.run();
                      onClose();
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                      active ? "bg-emerald-400/10 text-emerald-300" : `${TEXT.secondary} hover:bg-white/5`
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    <span className="text-[11px] text-zinc-400">{item.hint}</span>
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
