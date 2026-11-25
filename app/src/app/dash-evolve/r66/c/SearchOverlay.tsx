"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Brain,
  CreditCard,
  Cpu,
  Database,
  HardDrive,
  Megaphone,
  MoreHorizontal,
  Network,
  Server,
  Smartphone,
  Terminal,
} from "lucide-react";
import { CATEGORY_LABEL, teamName, usd, type ServiceCategory, type TeamCost, type TeamId } from "./data";
import { FOCUS, lockBodyScroll, trapTabKey } from "./ui";

const TEAM_ICON: Record<TeamId, LucideIcon> = {
  platform: Server,
  payments: CreditCard,
  growth: Megaphone,
  "data-ml": Brain,
  mobile: Smartphone,
  "core-api": Terminal,
};

const CATEGORY_ICON: Record<ServiceCategory, LucideIcon> = {
  compute: Cpu,
  database: Database,
  storage: HardDrive,
  network: Network,
  observability: Activity,
  other: MoreHorizontal,
};

/**
 * ⌘K jump-to search. Mount/unmount pattern: `<Body>` only exists while `open` is true, so every
 * open is a fresh mount with no stale query/highlight to reset.
 */
export function SearchOverlay({
  open,
  onClose,
  teams,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  teams: TeamCost[];
  onSelect: (teamId: TeamId, category: ServiceCategory) => void;
}) {
  return <AnimatePresence>{open && <Body onClose={onClose} teams={teams} onSelect={onSelect} />}</AnimatePresence>;
}

function Body({
  onClose,
  teams,
  onSelect,
}: {
  onClose: () => void;
  teams: TeamCost[];
  onSelect: (teamId: TeamId, category: ServiceCategory) => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const unlock = lockBodyScroll();
    return () => {
      unlock();
      previouslyFocused?.focus?.();
    };
  }, []);

  const entries = useMemo(() => {
    const list: { teamId: TeamId; category: ServiceCategory; cost: number }[] = [];
    for (const team of teams) {
      for (const svc of team.services) list.push({ teamId: team.id, category: svc.category, cost: svc.cost });
    }
    return list;
  }, [teams]);

  const filtered = entries.filter((e) => `${teamName(e.teamId)} ${CATEGORY_LABEL[e.category]}`.toLowerCase().includes(query.toLowerCase()));
  const safeHighlighted = filtered.length === 0 ? -1 : Math.min(highlighted, filtered.length - 1);

  function choose(entry: { teamId: TeamId; category: ServiceCategory }) {
    onSelect(entry.teamId, entry.category);
    onClose();
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length > 0) setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length > 0) setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = filtered[safeHighlighted];
      if (entry) choose(entry);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24 sm:pt-32">
      <motion.button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.15 }}
        className="fixed inset-0 bg-black/60"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-heading"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            return;
          }
          trapTabKey(e, panelRef.current);
        }}
        initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl shadow-black/60"
      >
        <h2 id="search-heading" className="sr-only">
          Jump to a team or service
        </h2>
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-listbox"
            aria-activedescendant={safeHighlighted >= 0 ? `search-option-${safeHighlighted}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search teams and services&hellip;"
            className={`${FOCUS} w-full min-w-0 rounded-md bg-transparent py-1 text-sm font-normal text-zinc-50 placeholder:text-zinc-400`}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`${FOCUS} shrink-0 rounded-md p-2 text-zinc-400 hover:text-zinc-50`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul id="search-listbox" role="listbox" aria-label="Search results" className="mt-1 max-h-80 space-y-0.5 overflow-y-auto p-1">
          {filtered.map((entry, index) => {
            const isHighlighted = index === safeHighlighted;
            const TeamIcon = TEAM_ICON[entry.teamId];
            const CategoryIcon = CATEGORY_ICON[entry.category];
            return (
              <li
                key={`${entry.teamId}-${entry.category}`}
                id={`search-option-${index}`}
                role="option"
                aria-selected={isHighlighted}
                tabIndex={-1}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => choose(entry)}
                className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${isHighlighted ? "bg-violet-600/15" : "hover:bg-white/5"}`}
              >
                <TeamIcon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-sm font-medium text-zinc-50">
                    <CategoryIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                    {CATEGORY_LABEL[entry.category]} &middot; {teamName(entry.teamId)}
                  </span>
                  <span className="block truncate text-xs font-normal text-zinc-400">{usd(entry.cost)}</span>
                </span>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="px-3 py-2.5 text-sm font-normal text-zinc-400">No matches.</li>}
        </ul>
      </motion.div>
    </div>
  );
}
