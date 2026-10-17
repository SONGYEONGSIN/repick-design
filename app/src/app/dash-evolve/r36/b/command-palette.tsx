"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NODES } from "./data";
import { BORDER, FOCUS, HOVER_ROW, PANEL_BG, STATUS_DOT, STATUS_LABEL, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * Mounted by the parent only while open (see meshwire-client.tsx), instead of
 * staying mounted and toggling on an `open` prop — so "reset the query on
 * open" falls out of the normal mount lifecycle (useState's initial value)
 * rather than a setState call inside an effect reacting to a prop change.
 */
export default function CommandPalette({ onClose, onSelectNode }: { onClose: () => void; onSelectNode: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = q.length === 0 ? NODES : NODES.filter((n) => n.name.toLowerCase().includes(q) || n.hostname.toLowerCase().includes(q) || n.team.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 sm:pt-28">
      {/* Pointer-only backdrop — intentionally excluded from the tab order (the
          visible X button below is the keyboard path to close this dialog). */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Search services" className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl shadow-black/50", BORDER, PANEL_BG)}>
        <div className={cx("flex h-12 items-center gap-2 border-b px-4", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_AUX} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, hosts, teams…"
            className={cx("h-full flex-1 rounded-md bg-transparent text-sm font-normal", TEXT_PRIMARY, FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md", TEXT_AUX, HOVER_ROW, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" />
            <span className="sr-only">Close search</span>
          </button>
        </div>
        <ul role="listbox" aria-label="Services" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? <li className={cx("px-3 py-6 text-center text-sm font-normal", TEXT_AUX)}>No services match &ldquo;{query}&rdquo;.</li> : null}
          {results.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => onSelectNode(n.id)}
                className={cx("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left", HOVER_ROW, TRANSITION, FOCUS)}
              >
                <span className={cx("h-2 w-2 shrink-0 rounded-full", STATUS_DOT[n.status])} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{n.name}</span>
                  <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>
                    {n.team} · {STATUS_LABEL[n.status]}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
