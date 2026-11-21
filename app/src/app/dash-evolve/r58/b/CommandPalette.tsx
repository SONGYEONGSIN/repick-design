"use client";

import { useEffect, useState } from "react";
import { Search, X, Server, Filter, ArrowRight } from "lucide-react";
import { SERVICES } from "./data";
import { FOCUS } from "./ui";

interface PaletteAction {
  id: string;
  group: string;
  label: string;
  hint: string;
  icon: typeof Server;
  onSelect: () => void;
}

/**
 * Mount/unmount pattern: while `open` is false this renders nothing, so `<PaletteBody>` is fully
 * unmounted and every open is a fresh mount — no stale state to reset, so no reset-effect is
 * needed (the known-safe idiom documented in dash-evolve/r57/a/CommandPalette.tsx).
 */
export function CommandPalette({
  open,
  onClose,
  filterService,
  clearFilters,
  scrollToInspector,
}: {
  open: boolean;
  onClose: () => void;
  filterService: (service: string) => void;
  clearFilters: () => void;
  scrollToInspector: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const actions: PaletteAction[] = [
    ...SERVICES.map((s) => ({
      id: `service-${s}`,
      group: "Filter by service",
      label: s,
      hint: "Show only this service's incidents",
      icon: Server,
      onSelect: () => filterService(s),
    })),
    {
      id: "clear-filters",
      group: "Filter",
      label: "Clear all filters",
      hint: "Show every incident",
      icon: Filter,
      onSelect: clearFilters,
    },
    {
      id: "jump-inspector",
      group: "Jump to",
      label: "Incident inspector",
      hint: "Scroll to detail panel",
      icon: ArrowRight,
      onSelect: scrollToInspector,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24 sm:pt-32" onClick={onClose}>
      <PaletteBody key="palette-body" actions={actions} onClose={onClose} />
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
      className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl"
    >
      <h2 id="palette-heading" className="sr-only font-medium">
        Command palette
      </h2>
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2.5">
        <Search className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
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
          placeholder="Filter by service, or jump to a panel…"
          className={`w-full min-w-0 bg-transparent py-1 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS}`}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close command menu"
          className={`flex-shrink-0 rounded-md p-2 text-zinc-500 hover:text-zinc-900 ${FOCUS}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ul id="palette-listbox" role="listbox" aria-label="Command palette results" className="mt-1 max-h-80 space-y-1 overflow-y-auto p-1">
        {filtered.map((action, index) => {
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
              className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${
                isHighlighted ? "bg-emerald-50" : "hover:bg-zinc-50"
              }`}
            >
              <action.icon className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-900">{action.label}</span>
                <span className="block truncate text-xs font-normal text-zinc-500">
                  {action.group} · {action.hint}
                </span>
              </span>
            </li>
          );
        })}
        {filtered.length === 0 && <li className="px-3 py-2.5 text-sm font-normal text-zinc-500">No matches.</li>}
      </ul>
    </div>
  );
}
