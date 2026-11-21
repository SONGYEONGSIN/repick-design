"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Period, TeamId } from "./data";
import { RESOURCES, TEAM_META, TEAM_ORDER, resourceCost } from "./data";
import { formatCurrency } from "./format";
import { FOCUS_RING } from "./ui";

export function CommandPalette({
  open,
  onClose,
  period,
  onSelectTeam,
  onSelectResource,
}: {
  open: boolean;
  onClose: () => void;
  period: Period;
  onSelectTeam: (teamId: TeamId) => void;
  onSelectResource: (resourceId: string) => void;
}) {
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
  const teamResults = TEAM_ORDER.filter((id) => TEAM_META[id].name.toLowerCase().includes(q));
  const resourceResults = RESOURCES.filter((r) => r.name.toLowerCase().includes(q) || TEAM_META[r.teamId].name.toLowerCase().includes(q)).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24">
      <div role="dialog" aria-modal="true" aria-label="Search teams and resources" className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
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
            aria-label="Search teams and resources by name"
            placeholder="Search teams and resources…"
            className={`w-full rounded-md bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {teamResults.length === 0 && resourceResults.length === 0 ? (
            <p className="px-3 py-6 text-center font-normal text-sm text-zinc-400">No matches for &quot;{query}&quot;.</p>
          ) : (
            <>
              {teamResults.length > 0 ? (
                <div className="mb-1">
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">Teams</p>
                  <ul>
                    {teamResults.map((id) => {
                      const team = TEAM_META[id];
                      const Icon = team.icon;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectTeam(id);
                              onClose();
                            }}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                            <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{team.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {resourceResults.length > 0 ? (
                <div>
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">Resources</p>
                  <ul>
                    {resourceResults.map((resource) => (
                      <li key={resource.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTeam(resource.teamId);
                            onSelectResource(resource.id);
                            onClose();
                          }}
                          className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
                        >
                          <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{resource.name}</span>
                          <span className="shrink-0 font-medium text-xs tabular-nums text-zinc-400">{formatCurrency(resourceCost(resource, period))}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
