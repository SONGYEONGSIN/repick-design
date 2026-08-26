"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PaletteEntry, PeriodDays, QueueId } from "./data";
import { PALETTE_PERIODS, PALETTE_QUEUES, PALETTE_TICKETS } from "./data";
import { BORDER, FOCUS, HOVER_BG, SURFACE_INSET, TEXT_AUX, TEXT_AUX_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

export default function CommandPalette({
  onClose,
  onQueue,
  onPeriod,
  onTicket,
}: {
  onClose: () => void;
  onQueue: (id: QueueId) => void;
  onPeriod: (id: PeriodDays) => void;
  onTicket: (queue: Exclude<QueueId, "all">, daysAgo: number) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Mounted only while the palette is open (see ThresholdClient), so this effect runs once on
  // mount rather than reacting to an `open` prop toggling inside an always-mounted component —
  // that is what keeps this a plain "focus on mount" effect instead of a state-in-effect sync.
  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const queues = useMemo(
    () => PALETTE_QUEUES.filter((e) => q === "" || e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q)),
    [q],
  );
  const periods = useMemo(
    () => PALETTE_PERIODS.filter((e) => q === "" || e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q)),
    [q],
  );
  const tickets = useMemo(
    () => PALETTE_TICKETS.filter((e) => q === "" || e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q)).slice(0, 8),
    [q],
  );

  const empty = queues.length === 0 && periods.length === 0 && tickets.length === 0;

  function run(entry: PaletteEntry) {
    if (entry.kind === "queue") onQueue(entry.id);
    else if (entry.kind === "period") onPeriod(entry.id);
    else onTicket(entry.queue, entry.daysAgo);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/50 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-zinc-900/20", BORDER, "bg-white")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search queues, windows or a ticket…"
            aria-label="Search queues, windows or a ticket"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {empty ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_AUX)}>Nothing matches that.</p> : null}

          {queues.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <Eyebrow>Queues</Eyebrow>
              </div>
              {queues.map((e) => (
                <button
                  key={`q-${e.id}`}
                  type="button"
                  onClick={() => run(e)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX_MUTED)} />
                  <span className="min-w-0 flex-1 truncate">
                    {e.title}
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{e.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {periods.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <Eyebrow>Window</Eyebrow>
              </div>
              {periods.map((e) => (
                <button
                  key={`p-${e.id}`}
                  type="button"
                  onClick={() => run(e)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX_MUTED)} />
                  <span className="min-w-0 flex-1 truncate">
                    {e.title}
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{e.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {tickets.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <Eyebrow>Tickets</Eyebrow>
              </div>
              {tickets.map((e) => (
                <button
                  key={`t-${e.id}`}
                  type="button"
                  onClick={() => run(e)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX_MUTED)} />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-mono text-[13px]">{e.id}</span>
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{e.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className={cx("flex items-center justify-between border-t px-3 py-2", BORDER, SURFACE_INSET)}>
          <span className={cx("text-[11px] font-normal", TEXT_AUX_MUTED)}>Selecting a queue or window recomputes every widget on the page.</span>
        </div>
      </div>
    </div>
  );
}
