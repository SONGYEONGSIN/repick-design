"use client";

import { Building2, Calendar, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { AXIS_WEIGHTS, type AxisDef, type VendorDef } from "./data";
import { compositeForView, formatComposite, formatScore, valueForView, type ViewMode } from "./format";
import Sparkline from "./sparkline";

interface ScorecardDrawerProps {
  vendor: VendorDef | null;
  axes: AxisDef[];
  view: ViewMode;
  onClose: () => void;
}

/**
 * On-demand, dismissible overlay — nullable (closed whenever `vendor` is
 * null), never a permanently-reserved third pane. Opened only when the
 * person explicitly asks for more detail on the pinned supplier.
 */
export default function ScorecardDrawer({ vendor, axes, view, onClose }: ScorecardDrawerProps) {
  const headingId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = vendor !== null;

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!vendor) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close supplier scorecard"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/30 motion-safe:transition-opacity"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-2xl motion-safe:transition-transform"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id={headingId} className="truncate text-lg font-semibold text-zinc-900 [font-family:var(--font-display-wide)]">
              {vendor.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-zinc-500">
              <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {vendor.category}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 motion-safe:transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="flex-1 space-y-6 px-5 py-5">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                Composite score
              </p>
              <p className="text-2xl font-semibold tabular-nums text-zinc-900">
                {formatComposite(compositeForView(vendor, view))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                6-quarter trend
              </p>
              <Sparkline
                data={vendor.trend}
                label={`${vendor.shortName} composite score trend over the last six quarters`}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Score breakdown</h3>
            <ul className="mt-3 space-y-3">
              {axes.map((axis) => {
                const value = valueForView(axis.id, vendor.scores[axis.id], view);
                return (
                  <li key={axis.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-normal text-zinc-700">
                        {axis.label}
                      </span>
                      <span className="shrink-0 text-xs font-normal text-zinc-500">
                        weight {Math.round(AXIS_WEIGHTS[axis.id] * 100)}%
                      </span>
                      <span className="shrink-0 tabular-nums text-sm font-semibold text-zinc-900">
                        {formatScore(value)}
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`${axis.label} score`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(value)}
                      className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
                    >
                      <div
                        className="h-full rounded-full bg-rose-600 motion-safe:transition-[width]"
                        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs font-normal text-zinc-500">{axis.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Relationship notes</h3>
            <p className="mt-1.5 flex items-start gap-1.5 text-sm font-normal text-zinc-700">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
              <span>
                {vendor.relationshipYears} year{vendor.relationshipYears === 1 ? "" : "s"} as an active
                supplier. {vendor.note}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
