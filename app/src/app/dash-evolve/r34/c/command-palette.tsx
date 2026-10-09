"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { SECTION_IDS } from "./data";

interface Command {
  id: string;
  label: string;
  description: string;
  targetId: string;
}

const COMMANDS: Command[] = [
  {
    id: "overview",
    label: "Jump to Overview",
    description: "Mentions, sentiment split and 12-week trend",
    targetId: SECTION_IDS.overview,
  },
  {
    id: "wordcloud",
    label: "Jump to Word Cloud",
    description: "Sentiment-colored tiles, sized by frequency",
    targetId: SECTION_IDS.wordCloud,
  },
  {
    id: "table",
    label: "Jump to Frequency List",
    description: "Sortable word, count and sentiment table",
    targetId: SECTION_IDS.frequencyTable,
  },
];

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the search state synchronously during render when the palette
  // transitions from closed to open, rather than reactively in an effect
  // (which would cost an extra render pass after the state change).
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      // Autofocus on open; harmless no-op if the element isn't mounted yet.
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  const run = (cmd: Command) => {
    const el = document.getElementById(cmd.targetId);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON") {
      // Enter from the search input runs the highlighted result. A focused
      // button's own native activation already runs itself on Enter/Space.
      e.preventDefault();
      const cmd = results[activeIndex];
      if (cmd) run(cmd);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
      {/* Click-to-dismiss convenience only; Escape already closes for keyboard
          users, so this stays out of the tab order rather than needing its
          own full-screen focus indicator. */}
      <div aria-hidden="true" onClick={onClose} className="fixed inset-0 bg-zinc-950/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/50"
        onKeyDown={handleKeyDown}
      >
        <div className="flex h-11 items-center gap-2 border-b border-white/10 px-3">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Jump to a section..."
            aria-label="Command palette search"
            className="h-full flex-1 rounded bg-transparent text-sm font-normal text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
            Esc
          </kbd>
        </div>
        <ul aria-label="Commands" className="max-h-72 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm font-normal text-zinc-400">No matching commands.</li>
          ) : (
            results.map((cmd, i) => (
              <li key={cmd.id}>
                <button
                  type="button"
                  onClick={() => run(cmd)}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                    i === activeIndex ? "bg-emerald-500/10" : "hover:bg-white/5"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium text-zinc-50">{cmd.label}</span>
                    <span className="block text-xs font-normal text-zinc-400">{cmd.description}</span>
                  </span>
                  <CornerDownLeft aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
