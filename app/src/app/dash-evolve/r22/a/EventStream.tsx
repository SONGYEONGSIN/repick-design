"use client";

import { ChevronRight, Database, Globe, KeyRound, Settings2, ShieldCheck, UserCog } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment } from "react";
import { actorById, dayKey, formatDayLabel, formatTime, type AuditEvent } from "./data";
import {
  BORDER,
  BORDER_SOFT,
  FOCUS,
  NUM,
  OUTCOME_BADGE,
  OUTCOME_LABEL,
  SEVERITY_BADGE,
  SEVERITY_DOT,
  SEVERITY_LABEL,
  TEXT_AUX,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TRANSITION,
  cx,
  type EventCategory,
} from "./tokens";

const CATEGORY_ICON: Record<EventCategory, LucideIcon> = {
  auth: KeyRound,
  access: ShieldCheck,
  data: Database,
  config: Settings2,
  network: Globe,
  admin: UserCog,
};

/**
 * The stream itself never reaches into anything beyond the `events` list it is handed — filtering
 * (severity/actor/category/search) is a parent-level partial recompute that produces a new `events`
 * array and nothing else changes. Clicking a row calls `onOpenEvent`, which is purely ephemeral in
 * the parent (opens RedoubtClient's inspector drawer state) and is never fed back into this
 * component or into the Actor Risk Index panel.
 */
export default function EventStream({
  events,
  totalCount,
  onOpenEvent,
  onClearFilters,
  filtered,
}: {
  events: AuditEvent[];
  totalCount: number;
  onOpenEvent: (ev: AuditEvent) => void;
  onClearFilters: () => void;
  filtered: boolean;
}) {
  let lastDay = "";

  return (
    <div>
      <p className={cx("mb-3 text-xs font-normal", TEXT_AUX)}>
        Showing <span className={cx("font-medium", TEXT_PRIMARY, NUM)}>{events.length}</span> of{" "}
        <span className={NUM}>{totalCount}</span> events
        {filtered ? (
          <>
            {" "}
            &middot;{" "}
            <button type="button" onClick={onClearFilters} className={cx("underline underline-offset-2 hover:text-zinc-200", TRANSITION, FOCUS, "rounded")}>
              clear filters
            </button>
          </>
        ) : null}
      </p>

      {events.length === 0 ? (
        <div className={cx("rounded-xl border border-dashed py-12 text-center", BORDER)}>
          <p className={cx("text-sm font-medium", TEXT_MUTED)}>No events match these filters.</p>
          <button type="button" onClick={onClearFilters} className={cx("mt-2 text-xs font-medium underline underline-offset-2", "text-rose-400", TRANSITION, FOCUS, "rounded")}>
            Clear filters
          </button>
        </div>
      ) : (
        <ol className="relative max-h-[720px] overflow-y-auto pr-1 [scrollbar-width:thin]">
          {events.map((ev, i) => {
            const actor = actorById(ev.actorId);
            const Icon = CATEGORY_ICON[ev.category];
            const dk = dayKey(ev.ts);
            const showDivider = dk !== lastDay;
            lastDay = dk;
            const isLast = i === events.length - 1;

            return (
              <Fragment key={ev.id}>
                {showDivider ? (
                  <li className="sticky top-0 z-10 -mx-1 flex items-center gap-2 bg-zinc-900 px-1 py-1.5">
                    <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{formatDayLabel(ev.ts)}</span>
                    <span aria-hidden="true" className={cx("h-px flex-1", BORDER_SOFT, "border-t")} />
                  </li>
                ) : null}
                <li className="relative flex gap-3">
                  <div className="relative flex w-5 shrink-0 flex-col items-center">
                    <span className={cx("mt-4 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-zinc-900", SEVERITY_DOT[ev.severity])} aria-hidden="true" />
                    {!isLast ? <span className={cx("w-px flex-1", "bg-white/10")} aria-hidden="true" /> : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenEvent(ev)}
                    aria-label={`${ev.summary}. ${SEVERITY_LABEL[ev.severity]} severity, ${OUTCOME_LABEL[ev.outcome]}. Actor ${actor.name}, at ${formatTime(ev.ts)}. Resource ${ev.resource}. From ${ev.ip}, ${ev.location}. Press Enter to open the event inspector.`}
                    className={cx(
                      "group relative mb-2 min-w-0 flex-1 rounded-xl border px-3.5 py-3 text-left",
                      BORDER_SOFT,
                      "bg-white/[0.015] hover:bg-white/[0.05]",
                      TRANSITION,
                      FOCUS,
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={cx("shrink-0 text-xs", TEXT_AUX, NUM)} style={{ fontFamily: "var(--font-display-mono)" }}>
                        {formatTime(ev.ts)}
                      </span>
                      <Icon size={13} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                      <span className={cx("min-w-[8ch] flex-1 truncate text-sm font-medium", TEXT_PRIMARY)}>{ev.summary}</span>
                      <span className={cx("ml-auto inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", SEVERITY_BADGE[ev.severity])}>
                        {SEVERITY_LABEL[ev.severity]}
                      </span>
                      <span className={cx("inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", OUTCOME_BADGE[ev.outcome])}>{OUTCOME_LABEL[ev.outcome]}</span>
                      <ChevronRight
                        size={14}
                        aria-hidden="true"
                        className="shrink-0 text-zinc-600 transition-transform duration-150 motion-reduce:transition-none group-hover:translate-x-0.5"
                      />
                    </div>

                    <div className={cx("mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-normal", TEXT_AUX)}>
                      <span className="inline-flex items-center gap-1">
                        <actor.Icon size={11} aria-hidden="true" />
                        {actor.name}
                      </span>
                      <span className="min-w-0 max-w-full truncate">{ev.resource}</span>
                    </div>

                    {/* Hover / keyboard-focus quick facts — purely additive, visual-only (the same
                        information is already in this button's aria-label above), so it never
                        changes accessible-name content and is safe to hide from assistive tech. */}
                    <div
                      aria-hidden="true"
                      className={cx(
                        "pointer-events-none absolute left-3.5 top-full z-20 mt-1 w-max max-w-xs rounded-lg border px-2.5 py-1.5 text-[11px] font-normal opacity-0 shadow-lg shadow-black/40 group-hover:opacity-100 group-focus-visible:opacity-100",
                        "transition-opacity duration-100 motion-reduce:transition-none",
                        BORDER,
                        "bg-zinc-800",
                        TEXT_MUTED,
                      )}
                    >
                      <span className={cx("block", NUM)} style={{ fontFamily: "var(--font-display-mono)" }}>
                        {ev.ip} &middot; {ev.location}
                      </span>
                      <span className={cx("mt-0.5 block", NUM)} style={{ fontFamily: "var(--font-display-mono)" }}>
                        req {ev.requestId}
                      </span>
                    </div>
                  </button>
                </li>
              </Fragment>
            );
          })}
        </ol>
      )}
    </div>
  );
}
