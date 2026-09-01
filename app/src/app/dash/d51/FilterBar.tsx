"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";
import { ACTORS, actorById } from "./data";
import { BORDER, CATEGORY_LABEL, FOCUS, HOVER_BG, PANEL_BG, SEVERITY_LABEL, SEVERITY_ORDER, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx, type EventCategory, type Severity } from "./tokens";
import { Chip, useOutsideClose } from "./ui";

const CATEGORY_ORDER: EventCategory[] = ["auth", "access", "data", "config", "network", "admin"];

function ActorMultiSelect({ active, onToggle }: { active: string[]; onToggle: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const label = active.length === 0 ? "All actors" : active.length === 1 ? actorById(active[0]).name : `${active.length} actors`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium",
          TRANSITION,
          FOCUS,
          active.length > 0 ? "border-zinc-200/80 bg-white text-zinc-900" : cx(BORDER, SURFACE_INSET, TEXT_MUTED, "hover:bg-white/[0.08] hover:text-zinc-50"),
        )}
      >
        {active.length > 0 ? <Check size={12} aria-hidden="true" /> : null}
        {label}
        <ChevronDown size={13} aria-hidden="true" className={active.length > 0 ? "text-zinc-500" : TEXT_AUX} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label="Filter by actor"
          className={cx("absolute left-0 top-full z-40 mt-1.5 w-64 max-w-[calc(100vw-2rem)] rounded-xl border p-1", BORDER, PANEL_BG, "shadow-xl shadow-black/40")}
        >
          {ACTORS.map((a) => {
            const selected = active.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => onToggle(a.id)}
                className={cx("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left", TRANSITION, FOCUS, selected ? "bg-rose-950/40" : HOVER_BG)}
              >
                <span className={cx("grid h-4 w-4 shrink-0 place-items-center rounded border", selected ? "border-rose-500 bg-rose-600" : cx(BORDER, "bg-transparent"))}>
                  {selected ? <Check size={11} aria-hidden="true" className="text-white" /> : null}
                </span>
                <a.Icon size={13} aria-hidden="true" className={TEXT_AUX} />
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate text-xs font-medium", selected ? "text-rose-200" : TEXT_PRIMARY)}>{a.name}</span>
                  <span className={cx("block truncate text-[10px] font-normal", TEXT_AUX)}>{a.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Every control here writes to the same handful of filter arrays owned by RedoubtClient. That state
 * feeds exactly two consumers — the event stream list and the four summary count cards above it
 * (`filteredEvents.length`, its severity/outcome breakdown) — a partial recompute. The Actor Risk
 * Index table on the right, and its own 24h/7d/30d toggle, read none of this state.
 */
export default function FilterBar({
  query,
  onQueryChange,
  activeSeverities,
  onToggleSeverity,
  activeCategories,
  onToggleCategory,
  activeActors,
  onToggleActor,
  onClearAll,
  hasFilters,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  activeSeverities: Severity[];
  onToggleSeverity: (s: Severity) => void;
  activeCategories: EventCategory[];
  onToggleCategory: (c: EventCategory) => void;
  activeActors: string[];
  onToggleActor: (id: string) => void;
  onClearAll: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className={cx("flex h-8 min-w-[180px] flex-1 items-center gap-1.5 rounded-full border px-3 sm:max-w-xs", BORDER, SURFACE_INSET)}>
          <Search size={13} aria-hidden="true" className={TEXT_AUX} />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Filter by summary, resource…"
            aria-label="Filter events by summary or resource"
            className={cx("h-full min-w-0 flex-1 rounded bg-transparent text-xs font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
          {query ? (
            <button type="button" onClick={() => onQueryChange("")} aria-label="Clear text filter" className={cx("shrink-0 rounded", FOCUS)}>
              <X size={12} aria-hidden="true" className={TEXT_AUX} />
            </button>
          ) : null}
        </div>

        <ActorMultiSelect active={activeActors} onToggle={onToggleActor} />

        {hasFilters ? (
          <button type="button" onClick={onClearAll} className={cx("ml-auto text-xs font-medium underline underline-offset-2", TEXT_AUX, "hover:text-zinc-200", TRANSITION, FOCUS, "rounded")}>
            Clear all filters
          </button>
        ) : null}
      </div>

      <div role="group" aria-label="Filter by severity" className="flex flex-wrap items-center gap-1.5">
        <span aria-hidden="true" className={cx("mr-1 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
          Severity
        </span>
        {SEVERITY_ORDER.map((s) => (
          <Chip key={s} active={activeSeverities.includes(s)} onClick={() => onToggleSeverity(s)} tone="rose">
            {SEVERITY_LABEL[s]}
          </Chip>
        ))}
      </div>

      <div role="group" aria-label="Filter by event type" className="flex flex-wrap items-center gap-1.5">
        <span aria-hidden="true" className={cx("mr-1 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
          Type
        </span>
        {CATEGORY_ORDER.map((c) => (
          <Chip key={c} active={activeCategories.includes(c)} onClick={() => onToggleCategory(c)}>
            {CATEGORY_LABEL[c]}
          </Chip>
        ))}
      </div>
    </div>
  );
}
