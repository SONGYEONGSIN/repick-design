"use client";

import { CalendarDays, Search, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDay, JOBS, TECHNICIANS, type Job, type TechId } from "./data";
import { formatTimeRange } from "./format";
import { ACCENT_SUBTLE, BORDER, FOCUS_RING, FOCUS_WITHIN, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  onClose,
  onSelectTechnician,
  onSelectJob,
}: {
  onClose: () => void;
  onSelectTechnician: (id: TechId) => void;
  onSelectJob: (job: Job) => void;
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

  const matchedTechs = useMemo(() => (q === "" ? TECHNICIANS : TECHNICIANS.filter((t) => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q))), [q]);

  const matchedJobs = useMemo(() => {
    if (q === "") return [];
    return JOBS.filter((j) => j.customer.toLowerCase().includes(q) || j.jobLabel.toLowerCase().includes(q)).slice(0, 6);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-white")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER, FOCUS_WITHIN)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a technician or job…"
            aria-label="Search technicians or jobs"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          {q !== "" ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <EyebrowLabel>Jobs</EyebrowLabel>
              </div>
              {matchedJobs.length === 0 ? (
                <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching jobs.</p>
              ) : (
                matchedJobs.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => onSelectJob(j)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                  >
                    <CalendarDays size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                    <span className="min-w-0 flex-1 truncate">
                      {j.customer} &middot; {j.jobLabel}
                    </span>
                    <span className={cx("shrink-0 text-xs", TEXT_CAPTION)}>
                      {getDay(j.day).label} {formatTimeRange(j.startHour, j.durationHours)}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : null}

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Technicians</EyebrowLabel>
            </div>
            {matchedTechs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTechnician(t.id)}
                className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
              >
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <User size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  {t.name}
                  <span className={cx("shrink-0 text-xs", TEXT_CAPTION)}>&middot; {t.role}</span>
                </span>
                <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", ACCENT_SUBTLE)}>Highlight</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
