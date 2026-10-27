"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MessageSquareWarning, GitBranch, ArrowLeft } from "lucide-react";
import { BubbleChart } from "./BubbleChart";
import { ServiceTable } from "./ServiceTable";
import {
  type Category,
  type Release,
  TIER_META,
  releaseBlastRadius,
  releaseRiskScore,
  releaseTier,
} from "./data";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

const FILTERS: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "api", label: "API" },
  { id: "database", label: "Database" },
  { id: "frontend", label: "Frontend" },
  { id: "infra", label: "Infra" },
];

export function DetailPane({
  release,
  onApprove,
  onRequestChanges,
  onBack,
}: {
  release: Release;
  onApprove: (id: string) => void;
  onRequestChanges: (id: string, note: string) => void;
  /** Present only on the mobile single-pane layout, where the rail and the detail pane can't sit
   *  side by side at 440px + flex-1 — shown as a `sm:hidden` back control instead. */
  onBack?: () => void;
}) {
  const [filter, setFilter] = useState<"all" | Category>("all");
  // Ephemeral, non-persistent — scoped only to this chart+table pair. Clicking a queue item (in
  // the parent) is the axis that PERSISTS the selection and drives this whole pane; hovering a
  // bubble or row here never writes to that axis.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const filteredServices = useMemo(
    () => (filter === "all" ? release.services : release.services.filter((s) => s.category === filter)),
    [release, filter]
  );

  const tier = releaseTier(release);
  const risk = releaseRiskScore(release);
  const blast = releaseBlastRadius(release);
  const tierMeta = TIER_META[tier];

  function submitNote() {
    onRequestChanges(release.id, note.trim() || "Reviewer requested changes.");
    setNote("");
    setNoteOpen(false);
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={`mb-4 flex items-center gap-1.5 rounded-lg text-sm font-medium text-blue-700 sm:hidden ${FOCUS_RING}`}
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Back to queue
        </button>
      )}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-zinc-600">
                {release.env === "production" ? "Production" : "Staging"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${tierMeta.bg} ${tierMeta.text} ${tierMeta.border}`}
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: tierMeta.dot }} aria-hidden="true" />
                {tier} risk
              </span>
            </div>
            <h1 className="mt-2 truncate text-xl font-semibold text-zinc-900">
              {release.version} &mdash; {release.title}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-normal text-zinc-600">
              <GitBranch className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              Requested by {release.requestedBy.name} &middot; {release.requestedAt}
            </p>
          </div>

          {release.status === "pending" ? (
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setNoteOpen((v) => !v)}
                aria-expanded={noteOpen}
                className={`flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors duration-150 ease-out hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <MessageSquareWarning className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                Request changes
              </button>
              <button
                type="button"
                onClick={() => onApprove(release.id)}
                className={`flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors duration-150 ease-out hover:bg-blue-700 ${FOCUS_RING}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                Approve release
              </button>
            </div>
          ) : (
            <p className="flex flex-shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-600">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
              Approved by {release.approvedBy} &middot; {release.approvedAt}
            </p>
          )}
        </div>

        {noteOpen && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <label htmlFor="change-note" className="text-xs font-medium text-amber-900">
              What needs to change before this can ship?
            </label>
            <textarea
              id="change-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. add a rollback plan for payments-gateway"
              className={`mt-1.5 w-full rounded-md border border-amber-300 bg-white px-2.5 py-1.5 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNoteOpen(false)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-amber-100 ${FOCUS_RING}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitNote}
                className={`rounded-md bg-amber-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-700 ${FOCUS_RING}`}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {release.changeNote && (
          <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-xs font-normal text-amber-900">
            <MessageSquareWarning className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            {release.changeNote}
          </p>
        )}

        {/* Derived from the same service rows the chart/table read — never a separately hand-typed number. */}
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">Blast radius</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900">{blast}%</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">Rollback risk</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900">{risk}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">Services touched</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900">{release.services.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-zinc-900">Service impact map</h2>
            <p className="mt-0.5 text-xs font-normal text-zinc-600">
              Each bubble is one changed service &middot; shape = category &middot; color = risk tier &middot; size = dependents touched.
            </p>
          </div>
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-0.5 text-xs font-medium">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-md px-2.5 py-1 transition-colors duration-150 ease-out ${FOCUS_RING} ${
                  filter === f.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <BubbleChart services={filteredServices} hoveredId={hoveredId} onHover={setHoveredId} />
        </div>
      </div>

      <div className="mt-6">
        <ServiceTable services={filteredServices} hoveredId={hoveredId} onHover={setHoveredId} />
      </div>
    </div>
  );
}
