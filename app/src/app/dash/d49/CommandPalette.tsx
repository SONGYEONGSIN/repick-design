"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BasisId, DriverId } from "./data";
import { BASES, SEARCH_ENTRIES } from "./data";
import { BORDER, FOCUS, HOVER_BG, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

export default function CommandPalette({
  onClose,
  onPick,
  onBasis,
}: {
  onClose: () => void;
  onPick: (basis: BasisId, driver: DriverId, target: "bridge" | "drill") => void;
  onBasis: (basis: BasisId) => void;
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

  const drivers = useMemo(
    () => SEARCH_ENTRIES.filter((e) => e.kind === "driver" && (q === "" || e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q))).slice(0, 8),
    [q],
  );
  const lines = useMemo(
    () => SEARCH_ENTRIES.filter((e) => e.kind === "line" && (q === "" || e.title.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q))).slice(0, 8),
    [q],
  );
  const bases = useMemo(() => BASES.filter((b) => q === "" || b.full.toLowerCase().includes(q) || b.label.toLowerCase().includes(q)), [q]);

  const empty = drivers.length === 0 && lines.length === 0 && bases.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-black/80", BORDER, "bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search drivers, line items or a comparison basis…"
            aria-label="Search drivers, line items or a comparison basis"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {empty ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_AUX)}>No drivers or line items match that.</p> : null}

          {bases.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <Eyebrow>Comparison basis</Eyebrow>
              </div>
              {bases.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onBasis(b.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <span className={cx("grid h-6 w-11 shrink-0 place-items-center rounded-md border text-[11px] font-semibold", BORDER, SURFACE_INSET, TEXT_AUX)}>{b.label}</span>
                  <span className="min-w-0 flex-1 truncate">{`Switch bridge to ${b.full.toLowerCase()}`}</span>
                </button>
              ))}
            </div>
          ) : null}

          {drivers.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <Eyebrow>Drivers</Eyebrow>
              </div>
              {drivers.map((e) => (
                <button
                  key={`${e.basis}-${e.driverId}`}
                  type="button"
                  onClick={() => {
                    onPick(e.basis, e.driverId, "bridge");
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                  <span className="min-w-0 flex-1 truncate">
                    {e.title}
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{e.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {lines.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <Eyebrow>Line items</Eyebrow>
              </div>
              {lines.map((e) => (
                <button
                  key={`${e.basis}-${e.title}`}
                  type="button"
                  onClick={() => {
                    onPick(e.basis, e.driverId, "drill");
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}
                >
                  <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-mono text-[13px]">{e.title}</span>
                    <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{e.meta}</span>
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
