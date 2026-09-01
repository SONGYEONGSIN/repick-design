"use client";

import { Database, Globe, KeyRound, Settings2, ShieldCheck, UserCog, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { actorById, formatDayLabel, formatTime, type AuditEvent } from "./data";
import {
  BORDER,
  BORDER_SOFT,
  CATEGORY_LABEL,
  FOCUS,
  NUM,
  OUTCOME_BADGE,
  OUTCOME_LABEL,
  PANEL_BG,
  SEVERITY_BADGE,
  SEVERITY_DOT,
  SEVERITY_LABEL,
  SURFACE_INSET,
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

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className={cx("text-[10px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>{label}</dt>
      <dd className={cx("mt-0.5 truncate text-xs font-medium", TEXT_PRIMARY, mono && NUM)} style={mono ? { fontFamily: "var(--font-display-mono)" } : undefined}>
        {value}
      </dd>
    </div>
  );
}

/**
 * Ephemeral inspector. It renders whatever `event` it is handed and calls `onClose`/`onOpenRelated` —
 * it holds no state of its own beyond a focus ref, writes nothing back to RedoubtClient's filter
 * state, and never touches the stream's item list, the summary cards, or the Actor Risk Index. Opening
 * a related event just swaps which event this same drawer displays.
 */
export default function EventInspector({ event, onClose, onOpenRelated, related }: { event: AuditEvent; onClose: () => void; onOpenRelated: (id: string) => void; related: AuditEvent[] }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const actor = actorById(event.actorId);
  const Icon = CATEGORY_ICON[event.category];

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button type="button" aria-label="Close event inspector" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Event details: ${event.summary}`}
        className={cx("relative flex h-full w-full max-w-md flex-col border-l shadow-2xl shadow-black/50", BORDER, PANEL_BG)}
      >
        <div className={cx("flex shrink-0 items-center gap-2 border-b px-4 py-3", BORDER)}>
          <span className={cx("h-2.5 w-2.5 shrink-0 rounded-full", SEVERITY_DOT[event.severity])} aria-hidden="true" />
          <span className={cx("text-xs font-semibold uppercase tracking-[0.06em]", TEXT_AUX)}>Event inspector</span>
          <button ref={closeRef} type="button" onClick={onClose} className={cx("ml-auto grid h-8 w-8 place-items-center rounded-lg", "hover:bg-white/[0.08]", TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close event inspector</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", SEVERITY_BADGE[event.severity])}>
              {SEVERITY_LABEL[event.severity]}
            </span>
            <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", OUTCOME_BADGE[event.outcome])}>{OUTCOME_LABEL[event.outcome]}</span>
            <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", BORDER, SURFACE_INSET, TEXT_MUTED)}>
              <Icon size={11} aria-hidden="true" />
              {CATEGORY_LABEL[event.category]}
            </span>
          </div>

          <p className={cx("mt-3 text-base font-semibold leading-snug", TEXT_PRIMARY)}>{event.summary}</p>
          <p className={cx("mt-1 text-xs font-normal", TEXT_AUX, NUM)} style={{ fontFamily: "var(--font-display-mono)" }}>
            {formatDayLabel(event.ts)} &middot; {formatTime(event.ts)}
          </p>
          <p className={cx("mt-2 text-xs font-normal leading-relaxed", TEXT_MUTED)}>{event.detail}</p>

          <dl className={cx("mt-4 grid grid-cols-2 gap-x-3 gap-y-3 rounded-xl border p-3", BORDER_SOFT, SURFACE_INSET)}>
            <Field label="Actor" value={actor.name} />
            <Field label="Resource" value={event.resource} />
            <Field label="IP address" value={event.ip} mono />
            <Field label="Location" value={event.location} />
            <Field label="Request ID" value={event.requestId} mono />
            <Field label="Session ID" value={event.sessionId} mono />
            <div className="col-span-2 min-w-0">
              <dt className={cx("text-[10px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>User agent</dt>
              <dd className={cx("mt-0.5 break-words text-xs font-medium", TEXT_PRIMARY)}>{event.userAgent}</dd>
            </div>
          </dl>

          {related.length > 0 ? (
            <div className="mt-4">
              <p className={cx("mb-1.5 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Related events</p>
              <ul className="flex flex-col gap-1">
                {related.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => onOpenRelated(r.id)}
                      className={cx("flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left", BORDER_SOFT, "hover:bg-white/[0.06]", TRANSITION, FOCUS)}
                    >
                      <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", SEVERITY_DOT[r.severity])} aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className={cx("block truncate text-xs font-medium", TEXT_PRIMARY)}>{r.summary}</span>
                        <span className={cx("block text-[10px] font-normal", TEXT_AUX, NUM)} style={{ fontFamily: "var(--font-display-mono)" }}>
                          {formatTime(r.ts)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
