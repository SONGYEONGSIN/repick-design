"use client";

import { Search, User2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ACTORS, EVENTS, type AuditEvent, actorById } from "./data";
import { BORDER, FOCUS, HOVER_BG, PANEL_BG, SEVERITY_DOT, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

/**
 * Palette state is reset here in the handlers that open it (App.onOpenPalette / this component's own
 * mount), never inside a useEffect — an effect-driven setState-on-open trips
 * react-hooks/set-state-in-effect. Because the palette unmounts on close, a fresh useState("") below
 * already gives every open a clean slate with no effect involved.
 */
export default function CommandPalette({
  onClose,
  onOpenEvent,
  onFilterActor,
}: {
  onClose: () => void;
  onOpenEvent: (ev: AuditEvent) => void;
  onFilterActor: (actorId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const eventResults = useMemo(
    () =>
      EVENTS.filter((e) => q === "" || e.summary.toLowerCase().includes(q) || e.resource.toLowerCase().includes(q) || actorById(e.actorId).name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)).slice(0, 6),
    [q],
  );
  const actorResults = useMemo(() => ACTORS.filter((a) => q === "" || a.name.toLowerCase().includes(q) || a.title.toLowerCase().includes(q)).slice(0, 4), [q]);
  const noResults = eventResults.length === 0 && actorResults.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-black/50", BORDER, PANEL_BG)}>
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search events by summary, resource, or actor…"
            aria-label="Search events by summary, resource, or actor"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {noResults ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_AUX)}>Nothing matches that.</p> : null}

          {eventResults.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <Eyebrow>Events — opens the inspector</Eyebrow>
              </div>
              {eventResults.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onOpenEvent(e);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <span className={cx("h-2 w-2 shrink-0 rounded-full", SEVERITY_DOT[e.severity])} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">
                    <span>{e.summary}</span>
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{actorById(e.actorId).name}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {actorResults.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <Eyebrow>Actors — adds to the stream filter</Eyebrow>
              </div>
              {actorResults.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    onFilterActor(a.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <User2 size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                  <span className="min-w-0 flex-1 truncate">
                    <span>{a.name}</span>
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{a.title}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
