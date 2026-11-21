"use client";

import { useEffect, useState } from "react";
import { Search, X, Users, Calendar, ArrowRight } from "lucide-react";
import { TEAMS, type Period, type TeamName } from "./data";

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400";

interface PaletteAction {
  id: string;
  group: string;
  label: string;
  hint: string;
  icon: typeof Users;
  onSelect: () => void;
}

/**
 * The previous attempt at this exact component reset `query`/`highlighted` with a
 * `useEffect(() => { ... }, [open])` — a hard-fail (react-hooks/set-state-in-effect) — and the
 * attempted fix read/wrote `ref.current` during render, which is its own hard-fail.
 *
 * Fix used here: this outer shell holds no text/selection state of its own. While `open` is
 * false it renders nothing, so `<PaletteBody>` below is fully unmounted. The next time `open`
 * flips to true, React mounts a brand-new `<PaletteBody>` instance whose `useState("")` and
 * `useState(0)` run their initializers fresh — there is no stale value to reset, so no effect
 * (and no ref-during-render trick) is needed at all.
 */
export function CommandPalette({
  open,
  onClose,
  pinTeam,
  setPeriod,
  scrollToId,
}: {
  open: boolean;
  onClose: () => void;
  pinTeam: (team: TeamName) => void;
  setPeriod: (period: Period) => void;
  scrollToId: (id: string) => void;
}) {
  // Legitimate external-system sync: a DOM keydown listener, not a state reset derived from
  // `open` changing. It is called on every render but only *attaches* while open.
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
    ...TEAMS.map((team) => ({
      id: `team-${team}`,
      group: "Pin a team",
      label: team,
      hint: "Pin in Resolution time chart",
      icon: Users,
      onSelect: () => pinTeam(team),
    })),
    {
      id: "period-7d",
      group: "Change view",
      label: "Show last 7 days",
      hint: "Resolution time & KPIs",
      icon: Calendar,
      onSelect: () => setPeriod("7d"),
    },
    {
      id: "period-30d",
      group: "Change view",
      label: "Show last 30 days",
      hint: "Resolution time & KPIs",
      icon: Calendar,
      onSelect: () => setPeriod("30d"),
    },
    {
      id: "jump-table",
      group: "Jump to",
      label: "Open ticket queue",
      hint: "Scroll to table",
      icon: ArrowRight,
      onSelect: () => scrollToId("open-ticket-queue"),
    },
    {
      id: "jump-feed",
      group: "Jump to",
      label: "Activity feed",
      hint: "Scroll to feed",
      icon: ArrowRight,
      onSelect: () => scrollToId("activity-feed"),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 pt-24 sm:pt-32" onClick={onClose}>
      <PaletteBody key="palette-body" actions={actions} onClose={onClose} />
    </div>
  );
}

function PaletteBody({ actions, onClose }: { actions: PaletteAction[]; onClose: () => void }) {
  // Fresh on every mount — i.e. fresh every time the palette opens. No reset effect required.
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const filtered = actions.filter((a) => `${a.group} ${a.label}`.toLowerCase().includes(query.toLowerCase()));
  // Clamp inline, right where it's used, instead of via an effect watching `filtered`.
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
            // The same handler that changes the query also resets the selection — together,
            // in one event handler — instead of a separate effect watching the filtered list.
            setQuery(event.target.value);
            setHighlighted(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Pin a team, change the view, or jump to a section…"
          className={`w-full min-w-0 bg-transparent py-1 text-sm font-normal text-slate-100 placeholder:text-slate-400 ${FOCUS}`}
        />
        <button type="button" onClick={onClose} aria-label="Close command menu" className={`flex-shrink-0 rounded-md p-2 text-slate-400 hover:text-slate-200 ${FOCUS}`}>
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
                isHighlighted ? "bg-green-500/15" : "hover:bg-white/5"
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
