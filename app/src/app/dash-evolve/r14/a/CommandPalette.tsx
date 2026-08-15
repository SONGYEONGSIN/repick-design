"use client";

import { LifeBuoy, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ACCOUNTS, formatDate, TICKETS, ticketOpenedMs } from "./data";
import { ACCENT_SUBTLE, BORDER, FOCUS_VISIBLE, FOCUS_WITHIN, HOVER_ACTIVE_BG, PRIORITY_LABEL, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  onClose,
  onSelectTicket,
  onFilterAccount,
}: {
  onClose: () => void;
  onSelectTicket: (ticketId: string) => void;
  onFilterAccount: (accountName: string) => void;
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

  const matchedTickets = useMemo(() => {
    if (q === "") return TICKETS.slice(0, 6);
    return TICKETS.filter((t) => t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)).slice(0, 6);
  }, [q]);

  const matchedAccounts = useMemo(() => (q === "" ? ACCOUNTS : ACCOUNTS.filter((a) => a.name.toLowerCase().includes(q))), [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-white")}>
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER, FOCUS_WITHIN)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a ticket or customer…"
            aria-label="Search tickets or customers"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Tickets</EyebrowLabel>
            </div>
            {matchedTickets.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching tickets.</p>
            ) : (
              matchedTickets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTicket(t.id)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
                >
                  <LifeBuoy size={14} aria-hidden="true" className={TEXT_CAPTION} />
                  <span className="min-w-0 flex-1 truncate">
                    <span className={cx("mr-1.5", TEXT_CAPTION)}>{t.id}</span>
                    {t.subject}
                  </span>
                  <span className={cx("shrink-0 text-xs", TEXT_CAPTION)}>{PRIORITY_LABEL[t.priority]} &middot; {formatDate(ticketOpenedMs(t))}</span>
                </button>
              ))
            )}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Customers</EyebrowLabel>
            </div>
            {matchedAccounts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onFilterAccount(a.name)}
                className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
              >
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <Users size={14} aria-hidden="true" className={TEXT_CAPTION} />
                  {a.name}
                </span>
                <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", ACCENT_SUBTLE)}>Filter queue</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
