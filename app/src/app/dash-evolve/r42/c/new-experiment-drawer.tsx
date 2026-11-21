"use client";

import { useEffect, useRef } from "react";
import { FlaskConical, X } from "lucide-react";
import { FOCUS_RING } from "./ui";

const METRIC_PRESETS = ["Checkout completion", "Trial-to-paid conversion", "Activation within 7 days", "Search-to-click rate"];

/** Opened by the top bar's primary action button. A real, functioning drawer (focus goes to the
 *  first field on open, Escape and the backdrop both close it) rather than a dead button. */
export default function NewExperimentDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) nameRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-950/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create a new experiment"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-900 p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-semibold text-sm text-zinc-50">
            <FlaskConical className="h-4 w-4 text-lime-400" aria-hidden="true" />
            New experiment
          </p>
          <button type="button" onClick={onClose} aria-label="Close new experiment panel" className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form
          className="mt-5 flex-1 space-y-4 overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <div>
            <label htmlFor="exp-name" className="block font-medium text-xs text-zinc-400">
              Experiment name
            </label>
            <input
              ref={nameRef}
              id="exp-name"
              type="text"
              placeholder="e.g. Trial reminder email subject line"
              className={`mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
          </div>

          <div>
            <label htmlFor="exp-hypothesis" className="block font-medium text-xs text-zinc-400">
              Hypothesis
            </label>
            <textarea
              id="exp-hypothesis"
              rows={3}
              placeholder="If we change X, then Y will improve because..."
              className={`mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
          </div>

          <fieldset>
            <legend className="font-medium text-xs text-zinc-400">Primary metric</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {METRIC_PRESETS.map((metric, i) => (
                <label
                  key={metric}
                  className="flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-normal text-xs text-zinc-50 hover:bg-white/5"
                >
                  <input
                    type="radio"
                    name="primary-metric"
                    defaultChecked={i === 0}
                    className={`h-6 w-6 shrink-0 accent-lime-400 ${FOCUS_RING}`}
                  />
                  {metric}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-2 pt-2">
            <button type="submit" className={`flex h-10 flex-1 items-center justify-center rounded-lg bg-lime-400 font-medium text-sm text-zinc-950 hover:bg-lime-300 ${FOCUS_RING}`}>
              Create draft
            </button>
            <button type="button" onClick={onClose} className={`flex h-10 items-center justify-center rounded-lg border border-white/10 px-4 font-medium text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
