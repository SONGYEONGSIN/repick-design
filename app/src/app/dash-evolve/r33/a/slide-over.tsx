"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Category } from "./categories";
import type { Period, Ticket } from "./data";
import { PERIOD_LABEL } from "./data";
import { TicketTable } from "./ticket-table";

const PERIOD_WINDOW: Record<Period, string> = {
  today: "opened today",
  "7d": "opened in the last 7 days",
  "30d": "opened in the last 30 days",
};

/**
 * The on-demand drawer. It is NOT a persistent pane — it is always mounted
 * (so the slide transition can run) but sits translated off-screen and
 * `inert` while closed, which also removes every focusable element inside it
 * from the tab order until a category is actually selected.
 *
 * Width fix for the dropped build: this build gives the inner table NO
 * `min-width` at all — `table-fixed` with percentage `<colgroup>` columns —
 * so there is nothing that can exceed the drawer's usable width in the first
 * place, at any viewport. The drawer itself is also widened to `sm:w-[560px]`
 * (vs. the dropped build's 460px) purely for breathing room; the overflow fix
 * is the fluid table, not the wider drawer.
 */
export function SlideOver({
  open,
  category,
  tickets,
  period,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  category: Category | null;
  tickets: Ticket[];
  period: Period;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      returnFocusRef.current?.focus();
      wasOpen.current = false;
    }
    // returnFocusRef is a ref object; its identity is stable and intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-zinc-900/30 transition-opacity duration-200 motion-reduce:transition-none ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={category ? `${category.label} tickets` : "Ticket list"}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col bg-white shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none sm:w-[560px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {category && (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-zinc-200 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: category.tint, color: category.hex }}
                >
                  <category.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-zinc-900">{category.label}</h2>
                  <p className="truncate text-xs text-zinc-500">
                    {tickets.length} tickets {PERIOD_WINDOW[period]}
                  </p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close ticket list"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 outline-offset-2 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-amber-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <TicketTable tickets={tickets} categoryLabel={category.label} />
            </div>

            <div className="border-t border-zinc-100 px-5 py-3">
              <p className="text-xs text-zinc-500">
                Showing the {PERIOD_LABEL[period].toLowerCase()} backlog window. Switch windows from the
                card behind this panel.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
