"use client";

import { useEffect, useState, type RefObject } from "react";
import { Search, X, Flag as FlagIcon, Filter, ArrowRight } from "lucide-react";
import { FLAGS, STATUS_LABEL, type FlagStatus } from "./data";
import { FOCUS_RING } from "./ui";

interface PaletteAction {
  id: string;
  group: string;
  label: string;
  hint: string;
  icon: typeof FlagIcon;
  onSelect: () => void;
}

/**
 * Mounts only while `open` — a ref + effect pair that re-focuses the trigger on close, rather than
 * toggling visibility with CSS, so a screen reader never meets a hidden dialog and the mobile
 * sidebar's own mount/unmount pattern stays the only other place this route needs the distinction.
 */
export function CommandPalette({
  open,
  onClose,
  onSelectFlag,
  onSetStatusFilter,
  onJumpToTable,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  onSelectFlag: (id: string) => void;
  onSetStatusFilter: (status: FlagStatus | "all") => void;
  onJumpToTable: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open, triggerRef]);

  if (!open) return null;

  const actions: PaletteAction[] = [
    ...FLAGS.map((f) => ({
      id: `flag-${f.id}`,
      group: "Open a flag",
      label: f.name,
      hint: `${STATUS_LABEL[f.status]} · ${f.rolloutPct}% rolled out`,
      icon: FlagIcon,
      onSelect: () => onSelectFlag(f.id),
    })),
    {
      id: "filter-all",
      group: "Filter by status",
      label: "Show all flags",
      hint: "Clear the status filter",
      icon: Filter,
      onSelect: () => onSetStatusFilter("all"),
    },
    {
      id: "filter-active",
      group: "Filter by status",
      label: "Show active flags",
      hint: "Status filter",
      icon: Filter,
      onSelect: () => onSetStatusFilter("active"),
    },
    {
      id: "filter-paused",
      group: "Filter by status",
      label: "Show paused flags",
      hint: "Status filter",
      icon: Filter,
      onSelect: () => onSetStatusFilter("paused"),
    },
    {
      id: "filter-archived",
      group: "Filter by status",
      label: "Show archived flags",
      hint: "Status filter",
      icon: Filter,
      onSelect: () => onSetStatusFilter("archived"),
    },
    {
      id: "jump-table",
      group: "Jump to",
      label: "Flag table",
      hint: "Scroll to the full flag list",
      icon: ArrowRight,
      onSelect: onJumpToTable,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24 sm:pt-32" onClick={onClose}>
      <PaletteBody actions={actions} onClose={onClose} />
    </div>
  );
}

function PaletteBody({ actions, onClose }: { actions: PaletteAction[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const filtered = actions.filter((a) => `${a.group} ${a.label}`.toLowerCase().includes(query.toLowerCase()));
  const safeHighlighted = filtered.length === 0 ? -1 : Math.min(highlighted, filtered.length - 1);

  function runAction(action: PaletteAction) {
    action.onSelect();
    onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (filtered.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const action = filtered[safeHighlighted];
      if (action) runAction(action);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="palette-heading"
      onClick={(event) => event.stopPropagation()}
      className="relative z-10 w-full min-w-0 max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
    >
      <h2 id="palette-heading" className="sr-only">
        Command palette
      </h2>
      <div className="flex h-12 min-w-0 items-center gap-2 border-b border-zinc-200 px-3">
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
          placeholder="Open a flag, filter by status, or jump to the table…"
          className={`h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close command menu"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ul id="palette-listbox" role="listbox" aria-label="Command palette results" className="max-h-80 min-w-0 space-y-0.5 overflow-y-auto p-1.5">
        {filtered.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-zinc-500">No matches.</li>
        ) : (
          filtered.map((action, index) => {
            const isHighlighted = index === safeHighlighted;
            return (
              <li
                key={action.id}
                id={`palette-option-${index}`}
                role="option"
                aria-selected={isHighlighted}
                tabIndex={-1}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => runAction(action)}
                className={`flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 ${
                  isHighlighted ? "bg-lime-50" : "hover:bg-zinc-50"
                }`}
              >
                <action.icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-900">{action.label}</span>
                  <span className="block truncate text-xs text-zinc-500">
                    {action.group} · {action.hint}
                  </span>
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
