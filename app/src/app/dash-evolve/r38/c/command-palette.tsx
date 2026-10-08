"use client";

import { Activity, LayoutGrid, Map as MapIcon, Search, TableProperties } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { REGIONS } from "./data";
import { BORDER, FOCUS, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

const SECTIONS = [
  { href: "#top", label: "Overview", Icon: LayoutGrid },
  { href: "#feed", label: "Activity feed", Icon: Activity },
  { href: "#map", label: "Region map", Icon: MapIcon },
  { href: "#region-table", label: "Region stats table", Icon: TableProperties },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const matchedSections = useMemo(() => SECTIONS.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())), [query]);
  const matchedRegions = useMemo(() => REGIONS.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.code.toLowerCase().includes(query.toLowerCase())), [query]);

  function go(href: string) {
    onOpenChange(false);
    requestAnimationFrame(() => document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button type="button" aria-label="Close search" onClick={() => onOpenChange(false)} className="absolute inset-0 bg-black/60" />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border bg-zinc-900 shadow-2xl shadow-black/50", BORDER)}>
        <div className={cx("flex items-center gap-2 border-b px-3.5", BORDER)}>
          <Search size={15} aria-hidden="true" className={TEXT_AUX} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section or region…"
            aria-label="Search sections and regions"
            className={cx("h-11 flex-1 bg-transparent text-sm placeholder:text-zinc-400", TEXT_PRIMARY, FOCUS)}
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {matchedSections.length > 0 ? (
            <div className="mb-1">
              <p className={cx("px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Sections</p>
              {matchedSections.map((s) => {
                const Icon = s.Icon;
                return (
                  <button
                    key={s.href}
                    type="button"
                    onClick={() => go(s.href)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/5 hover:text-zinc-50")}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          {matchedRegions.length > 0 ? (
            <div>
              <p className={cx("px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Regions</p>
              {matchedRegions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => go("#region-table")}
                  className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/5 hover:text-zinc-50")}
                >
                  <span>{r.name}</span>
                  <span className="text-[11px] tabular-nums">{r.code}</span>
                </button>
              ))}
            </div>
          ) : null}
          {matchedSections.length === 0 && matchedRegions.length === 0 ? <p className={cx("px-2.5 py-6 text-center text-sm", TEXT_AUX)}>No matches.</p> : null}
        </div>
      </div>
    </div>
  );
}
