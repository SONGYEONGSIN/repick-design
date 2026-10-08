"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { VENDORS, PERIODS, getVendorStat, formatMs, type Period } from "./data";
import { CategoryTag } from "./ui";

type Props = {
  open: boolean;
  onClose: () => void;
  period: Period;
  onChangePeriod: (p: Period) => void;
  onSelectVendor: (id: string) => void;
};

export function CommandPalette({ open, onClose, period, onChangePeriod, onSelectVendor }: Props) {
  const [query, setQuery] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<Element | null>(null);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    inputRef.current?.focus();
    return () => {
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const node = dialogRef.current;
      if (!node) return;
      const focusables = node.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VENDORS;
    return VENDORS.filter((v) => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) || v.code.toLowerCase().includes(q));
  }, [query]);

  function pickVendor(id: string) {
    onSelectVendor(id);
    onClose();
    const el = document.getElementById(`vendor-box-${id}`);
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <div aria-hidden="true" className="fixed inset-0 bg-zinc-900/40" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg min-w-0 rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a vendor…"
            aria-label="Search vendors"
            className="min-w-0 flex-1 rounded bg-transparent text-sm font-normal text-zinc-900 outline-offset-2 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex gap-1 border-b border-zinc-200 px-4 py-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Window</span>
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={p === period}
              onClick={() => onChangePeriod(p)}
              className={`rounded-md px-2 py-0.5 text-xs font-medium outline-offset-2 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                p === period ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <ul role="listbox" aria-label="Vendors" className="max-h-80 overflow-y-auto p-2">
          {results.map((v) => {
            const stat = getVendorStat(v, period);
            return (
              <li key={v.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => pickVendor(v.id)}
                  className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-normal text-zinc-900">{v.name}</span>
                    <CategoryTag category={v.category} />
                  </span>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-zinc-500">{formatMs(stat.median)}</span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && <li className="px-3 py-2 text-sm font-normal text-zinc-500">No vendors match &ldquo;{query}&rdquo;.</li>}
        </ul>
      </div>
    </div>
  );
}
