"use client";

import { X } from "lucide-react";
import { FOCUS_RING } from "./ui";
import { TERMS } from "./data";

export default function NewTicketDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/30" />
      <div role="dialog" aria-modal="true" aria-labelledby="new-ticket-heading" className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <h2 id="new-ticket-heading" className="font-semibold text-sm text-zinc-900">
            Log a feedback ticket
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <label className="block" htmlFor="nt-subject">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Subject</span>
            <input
              id="nt-subject"
              type="text"
              placeholder="e.g. Checkout fails on retry"
              className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 px-3 font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
          </label>

          <label className="mt-4 block" htmlFor="nt-customer">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Customer</span>
            <input
              id="nt-customer"
              type="text"
              placeholder="Customer name"
              className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 px-3 font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
          </label>

          <label className="mt-4 block" htmlFor="nt-theme">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Theme</span>
            <select
              id="nt-theme"
              defaultValue={TERMS[0].id}
              className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 font-normal text-sm text-zinc-900 ${FOCUS_RING}`}
            >
              {TERMS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block" htmlFor="nt-notes">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Notes</span>
            <textarea
              id="nt-notes"
              rows={4}
              placeholder="What did the customer say?"
              className={`mt-1.5 flex w-full resize-none rounded-md border border-zinc-200 px-3 py-2 font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className={`flex h-10 items-center rounded-md border border-zinc-200 px-3 font-medium text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-10 items-center rounded-md bg-rose-700 px-3 font-medium text-sm text-white hover:bg-rose-800 ${FOCUS_RING}`}
          >
            Create ticket
          </button>
        </div>
      </div>
    </div>
  );
}
