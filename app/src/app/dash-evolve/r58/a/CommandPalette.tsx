"use client";

import { useEffect, useState } from "react";
import { Search, X, Building2, CalendarDays, ArrowRight } from "lucide-react";
import { RESOURCES, DAYS, type Day } from "./data";
import { FOCUS } from "./ui";

interface PaletteAction {
  id: string;
  group: string;
  label: string;
  hint: string;
  icon: typeof Building2;
  onSelect: () => void;
}

/**
 * Mount/unmount pattern (not a reset-effect): while `open` is false this component renders
 * nothing, so `<PaletteBody>` is fully unmounted and every render while open is a fresh mount —
 * no stale `query`/`highlighted` state to clear, so no effect is needed to clear it.
 */
export function CommandPalette({
  open,
  onClose,
  selectResource,
  selectDay,
  scrollToBookings,
}: {
  open: boolean;
  onClose: () => void;
  selectResource: (id: string) => void;
  selectDay: (d: Day) => void;
  scrollToBookings: () => void;
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
    ...RESOURCES.map((r) => ({
      id: `resource-${r.id}`,
      group: "Jump to resource",
      label: r.name,
      hint: `$${r.hourlyRate}/hr`,
      icon: Building2,
      onSelect: () => selectResource(r.id),
    })),
    ...DAYS.map((d) => ({
      id: `day-${d}`,
      group: "Change day",
      label: `Show ${d}`,
      hint: "9:00–16:00 availability",
      icon: CalendarDays,
      onSelect: () => selectDay(d),
    })),
    {
      id: "jump-bookings",
      group: "Jump to",
      label: "Upcoming bookings table",
      hint: "Scroll to table",
      icon: ArrowRight,
      onSelect: scrollToBookings,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 pt-24 sm:pt-32" onClick={onClose}>
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
      className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl"
    >
      <h2 id="palette-heading" className="sr-only font-medium">
        Command palette
      </h2>
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <Search className="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
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
          placeholder="Jump to a resource, or change the view…"
          className={`w-full min-w-0 bg-transparent py-1 text-sm font-normal text-slate-100 placeholder:text-slate-400 ${FOCUS}`}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close command menu"
          className={`flex-shrink-0 rounded-md p-2 text-slate-400 hover:text-slate-200 ${FOCUS}`}
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
                isHighlighted ? "bg-indigo-500/15" : "hover:bg-white/5"
              }`}
            >
              <action.icon className="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-100">{action.label}</span>
                <span className="block truncate text-xs font-normal text-slate-400">
                  {action.group} · {action.hint}
                </span>
              </span>
            </li>
          );
        })}
        {filtered.length === 0 && <li className="px-3 py-2.5 text-sm font-normal text-slate-400">No matches.</li>}
      </ul>
    </div>
  );
}
