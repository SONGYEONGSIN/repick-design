"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import type { Category, CompositionSlice, Ticket } from "./data";
import { formatAvgAge } from "./data";
import TicketTable from "./ticket-table";
import { cx } from "./ui";

// On-demand overlay drilldown — deliberately not an always-visible master-detail pane.
// It only exists while `open`, sits on top of the page, and gives focus back to whatever
// triggered it when it closes.
export default function SlideOver({
  open,
  onClose,
  category,
  slice,
  tickets,
  windowLabel,
}: {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  slice: CompositionSlice | null;
  tickets: Ticket[];
  windowLabel: string;
}) {
  const headingId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open, category?.id]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!category || !slice) return null;
  const Icon = category.icon;
  const avg = formatAvgAge(tickets);

  return (
    <div
      className={cx("fixed inset-0 z-40", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        onClick={onClose}
        className={cx(
          "absolute inset-0 bg-zinc-900/30 transition-opacity duration-200 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={cx(
          "absolute inset-y-0 right-0 flex h-full w-full flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-2xl transition-transform duration-200 motion-reduce:transition-none sm:w-[460px]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: category.color }}
            >
              <Icon className={cx("h-4 w-4", category.iconInk === "dark" ? "text-zinc-900/80" : "text-white/95")} />
            </span>
            <div className="min-w-0">
              <h2 id={headingId} className="truncate text-[15px] font-semibold text-zinc-900">
                {category.name}
              </h2>
              <p className="truncate text-[12px] text-zinc-500">{category.description}</p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close ticket panel"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 py-4">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Summary · {windowLabel}</h3>
            <dl className="mt-2 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Tickets</dt>
                <dd className="text-[17px] font-semibold tabular-nums text-zinc-900">{slice.count}</dd>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Share</dt>
                <dd className="text-[17px] font-semibold tabular-nums text-zinc-900">{slice.pct}%</dd>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <dt className="text-[10px] uppercase tracking-wide text-zinc-500">Avg age</dt>
                <dd className="text-[17px] font-semibold tabular-nums text-zinc-900">{avg}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Open tickets</h3>
            <TicketTable tickets={tickets} categoryName={category.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
