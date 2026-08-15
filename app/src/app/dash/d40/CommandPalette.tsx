"use client";

import { CalendarDays, Search, Server, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_DEPLOYS_DESC, formatDate, SERVICE_BY_ID, SERVICES } from "./data";
import { ACCENT_SUBTLE, BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  onClose,
  onSelectService,
  onSelectDay,
}: {
  onClose: () => void;
  onSelectService: (serviceName: string) => void;
  onSelectDay: (dateMs: number) => void;
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

  const matchedServices = useMemo(() => (q === "" ? SERVICES : SERVICES.filter((s) => s.name.toLowerCase().includes(q))), [q]);

  const matchedDeploys = useMemo(() => {
    if (q === "") return [];
    return ALL_DEPLOYS_DESC.filter((d) => d.author.toLowerCase().includes(q) || SERVICE_BY_ID[d.serviceId].name.toLowerCase().includes(q)).slice(0, 6);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-white dark:bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a service or deploy…"
            aria-label="Search services or deploys"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400 dark:placeholder:text-zinc-500")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          {q !== "" ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <EyebrowLabel>Deploys</EyebrowLabel>
              </div>
              {matchedDeploys.length === 0 ? (
                <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching deploys.</p>
              ) : (
                matchedDeploys.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onSelectDay(d.dateMs)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                  >
                    <CalendarDays size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <span className="min-w-0 flex-1 truncate">
                      {SERVICE_BY_ID[d.serviceId].name} &middot; {d.author}
                    </span>
                    <span className={cx("shrink-0 text-xs", TEXT_CAPTION)}>{formatDate(d.dateMs)}</span>
                  </button>
                ))
              )}
            </div>
          ) : null}

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Services</EyebrowLabel>
            </div>
            {matchedServices.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectService(s.name)}
                className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
              >
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <Server size={14} aria-hidden="true" className={TEXT_CAPTION} />
                  <span className={cx("h-2 w-2 shrink-0 rounded-full", s.dot)} aria-hidden="true" />
                  {s.name}
                </span>
                <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", ACCENT_SUBTLE)}>Filter table</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
