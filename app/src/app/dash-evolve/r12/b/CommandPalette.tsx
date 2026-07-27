"use client";

import { FileSignature, Filter, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CONTRACTS, STATUS_META, type Contract } from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  onClose,
  onSelectContract,
  onFilterCounterparty,
}: {
  onClose: () => void;
  onSelectContract: (id: string) => void;
  onFilterCounterparty: (counterparty: string) => void;
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

  const matchedContracts: Contract[] = useMemo(() => {
    const pool = q === "" ? CONTRACTS : CONTRACTS.filter((c) => c.counterparty.toLowerCase().includes(q) || c.contractType.toLowerCase().includes(q));
    return pool.slice(0, 7);
  }, [q]);

  const counterparties = useMemo(() => {
    const names = Array.from(new Set(CONTRACTS.map((c) => c.counterparty)));
    const pool = q === "" ? names : names.filter((n) => n.toLowerCase().includes(q));
    return pool.slice(0, 5);
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
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a contract or counterparty…"
            aria-label="Search contracts or counterparties"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400 dark:placeholder:text-zinc-500")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Contracts</EyebrowLabel>
            </div>
            {matchedContracts.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching contracts.</p>
            ) : (
              matchedContracts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectContract(c.id)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                >
                  <FileSignature size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{c.counterparty}</span>
                    <span className={cx("block truncate text-xs", TEXT_CAPTION)}>
                      {c.contractType} &middot; {STATUS_META[c.status].label}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Counterparties</EyebrowLabel>
            </div>
            {counterparties.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching counterparties.</p>
            ) : (
              counterparties.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => onFilterCounterparty(name)}
                  className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                >
                  <span className="min-w-0 flex-1 truncate">{name}</span>
                  <span className={cx("inline-flex shrink-0 items-center gap-1 text-xs", TEXT_CAPTION)}>
                    <Filter size={11} aria-hidden="true" />
                    Filter list
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
