"use client";

import { CalendarDays, Search, Wrench, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BayId, MetricId } from "./data";
import { BAYS, BAY_GROUP_LABEL, DAYS, METRIC_BY_ID, QUICK_VIEWS, WEEKDAYS_LONG, fmt } from "./data";
import { BORDER, FOCUS, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  metric,
  onClose,
  onSelectDay,
  onFocusBay,
}: {
  metric: MetricId;
  onClose: () => void;
  onSelectDay: (index: number) => void;
  onFocusBay: (id: BayId) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = METRIC_BY_ID[metric];

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedDays = useMemo(() => {
    const pool = q === "" ? DAYS.filter((d) => d.values.orders > 0) : DAYS.filter((d) => `${WEEKDAYS_LONG[d.weekdayIndex]} ${d.short} ${d.long}`.toLowerCase().includes(q));
    return pool.slice(0, 6);
  }, [q]);

  const matchedBays = useMemo(() => {
    const pool = q === "" ? BAYS : BAYS.filter((b) => `${b.code} ${b.name} ${b.lead} ${BAY_GROUP_LABEL[b.group]}`.toLowerCase().includes(q));
    return pool.slice(0, 6);
  }, [q]);

  const matchedViews = useMemo(() => (q === "" ? QUICK_VIEWS : QUICK_VIEWS.filter((v) => v.label.toLowerCase().includes(q))), [q]);

  function jumpTo(targetId: string) {
    onClose();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const rowClass = cx("flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-normal", TEXT_PRIMARY, "hover:bg-zinc-100 active:bg-zinc-200", TRANSITION, FOCUS);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/40 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl shadow-zinc-950/20", BORDER, "bg-white")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-3", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a day, a bay, or a crew lead…"
            aria-label="Search days, bays and crew leads"
            className={cx("h-12 min-w-0 flex-1 rounded-md bg-transparent text-[13px] font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-zinc-100 active:bg-zinc-200", TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Days — loads the agenda</EyebrowLabel>
            </div>
            {matchedDays.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-[13px] font-normal", TEXT_CAPTION_MUTED)}>No matching day in this horizon.</p>
            ) : (
              matchedDays.map((d) => (
                <button
                  key={d.index}
                  type="button"
                  onClick={() => {
                    onSelectDay(d.index);
                    onClose();
                  }}
                  className={rowClass}
                >
                  <CalendarDays size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1 truncate">{d.long}</span>
                  <span className={cx("shrink-0 whitespace-nowrap text-[11px] font-medium", NUM, TEXT_CAPTION_MUTED)}>
                    {`${fmt(d.values[metric])} ${meta.short}`}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Bays &amp; crew leads</EyebrowLabel>
            </div>
            {matchedBays.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-[13px] font-normal", TEXT_CAPTION_MUTED)}>No matching bay.</p>
            ) : (
              matchedBays.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onFocusBay(b.id);
                    onClose();
                    document.getElementById("bays-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={rowClass}
                >
                  <Wrench size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1 truncate">
                    {`Bay ${b.code} — ${b.name}`}
                    <span className={cx("ml-1.5 text-[11px] font-normal", TEXT_CAPTION_MUTED)}>{b.lead}</span>
                  </span>
                </button>
              ))
            )}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Views</EyebrowLabel>
            </div>
            {matchedViews.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-[13px] font-normal", TEXT_CAPTION_MUTED)}>No matching view.</p>
            ) : (
              matchedViews.map((v) => (
                <button key={v.id} type="button" onClick={() => jumpTo(v.targetId)} className={rowClass}>
                  <v.Icon size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1 truncate">{v.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
