"use client";

import { useState } from "react";
import { ChevronDown, GitCompareArrows, Layers, Cpu, Package, Puzzle } from "lucide-react";
import { FOCUS, cx, type SpecGroup } from "./data";

const GROUP_ICONS: Record<string, typeof Layers> = {
  optical: Layers,
  electronics: Cpu,
  box: Package,
  compatibility: Puzzle,
};

/**
 * Two-column spec comparison, one accordion group at a time. Each group renders as *two*
 * sibling <dl> lists (Certified, New) rather than one <dl> with a nested icon wrapper — keeping
 * every list at exactly `dl > div > (dt, dd)` so axe's definition-list/dlitem audits pass (see
 * curation-criteria's dl-nesting finding from auto-product-detail-r1/c and auto-paywall-r1/c).
 * Any per-row "differs" marker lives inside the <dt> itself, never as a sibling wrapper.
 */
export default function SpecCompare({ groups }: { groups: SpecGroup[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set([groups[0]?.id]));
  const [diffOnly, setDiffOnly] = useState(false);

  function toggleGroup(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <GitCompareArrows className="h-4 w-4 flex-none text-slate-600" aria-hidden="true" />
          <span className="text-sm font-normal text-slate-700">
            {diffOnly ? "Showing rows that differ between the two units" : "Showing every specification row"}
          </span>
        </div>
        <span className="flex items-center gap-2.5">
          <span id="diff-only-label" className="text-sm font-medium text-slate-900">
            Show differences only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={diffOnly}
            aria-labelledby="diff-only-label"
            onClick={() => setDiffOnly((v) => !v)}
            className={cx(
              "relative inline-flex h-6 w-11 flex-none items-center rounded-full border transition-colors",
              diffOnly ? "border-sky-700 bg-sky-700" : "border-slate-300 bg-white",
              FOCUS,
            )}
          >
            <span
              aria-hidden="true"
              className={cx(
                "inline-block h-4.5 w-4.5 flex-none translate-x-1 rounded-full bg-white shadow transition-transform",
                diffOnly && "translate-x-5",
              )}
            />
          </button>
        </span>
      </div>

      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {groups.map((group) => {
          const isOpen = open.has(group.id);
          const Icon = GROUP_ICONS[group.id] ?? Layers;
          const rows = diffOnly ? group.rows.filter((r) => r.certified !== r.new) : group.rows;

          return (
            <div key={group.id}>
              <h3 className="m-0">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                  aria-controls={`spec-panel-${group.id}`}
                  id={`spec-header-${group.id}`}
                  className={cx("flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50", FOCUS)}
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-sky-50">
                    <Icon className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-base font-medium text-slate-900">{group.title}</span>
                  <span className="text-xs font-normal text-slate-600 tabular-nums">
                    {rows.length} of {group.rows.length}
                  </span>
                  <ChevronDown
                    className={cx("h-4.5 w-4.5 flex-none text-slate-600 transition-transform duration-200 motion-reduce:transition-none", isOpen && "rotate-180")}
                    aria-hidden="true"
                  />
                </button>
              </h3>

              <div
                id={`spec-panel-${group.id}`}
                role="region"
                aria-labelledby={`spec-header-${group.id}`}
                hidden={!isOpen}
                className="px-5 pb-5"
              >
                {rows.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 px-4 py-3 text-sm font-normal text-slate-600">
                    Every row in this group matches between the two units.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Certified Pre-Owned</p>
                      <dl className="mt-2 flex flex-col gap-3">
                        {rows.map((row) => {
                          const differs = row.certified !== row.new;
                          return (
                            <div key={row.label} className="border-b border-dashed border-slate-200 pb-2.5">
                              <dt className="flex items-center gap-1.5 text-sm font-normal text-slate-600">
                                {row.label}
                                {differs && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-1.5 py-0.5 text-[11px] font-medium text-sky-700">
                                    Differs
                                  </span>
                                )}
                              </dt>
                              <dd className="mt-0.5 text-sm font-medium text-slate-900">{row.certified}</dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">New, Sealed</p>
                      <dl className="mt-2 flex flex-col gap-3">
                        {rows.map((row) => {
                          const differs = row.certified !== row.new;
                          return (
                            <div key={row.label} className="border-b border-dashed border-slate-200 pb-2.5">
                              <dt className="flex items-center gap-1.5 text-sm font-normal text-slate-600">
                                {row.label}
                                {differs && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
                                    Differs
                                  </span>
                                )}
                              </dt>
                              <dd className="mt-0.5 text-sm font-medium text-slate-900">{row.new}</dd>
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
