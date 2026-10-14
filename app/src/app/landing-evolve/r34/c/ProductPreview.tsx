"use client";

import { Fragment, useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import Reveal from "./Reveal";
import StackedBar from "./StackedBar";
import Stepper from "./Stepper";
import { SectionIntro } from "./ui";
import { FOCUS } from "./theme";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  DEFAULT_COUNTS,
  computeBreakdown,
  formatUsd,
  type CategoryCounts,
  type CategoryId,
} from "./payout-math";

interface ProductPreviewProps {
  counts: CategoryCounts;
  onChange: (id: CategoryId, next: number) => void;
  onReset: () => void;
}

/**
 * The device section. Three direct stepper counters feed a live itemized
 * table and a stacked-bar mix chart on this same screen — no steps, no
 * "next" button. Every number below is recomputed on every render from
 * `counts` via `computeBreakdown`; there is no intermediate state to fall
 * out of sync.
 */
export default function ProductPreview({ counts, onChange, onReset }: ProductPreviewProps) {
  const [expanded, setExpanded] = useState<Partial<Record<CategoryId, boolean>>>({});
  const breakdown = computeBreakdown(counts);
  const visibleRows = breakdown.rows.filter((row) => row.count > 0);
  const isDefault = CATEGORY_ORDER.every((id) => counts[id] === DEFAULT_COUNTS[id]);

  function toggleRow(id: CategoryId) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="calculator" className="border-b border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <SectionIntro
            eyebrow="HOW MUCH ARE YOU LISTING"
            heading="Set your counts. The breakdown below is live."
            body="Dial in roughly how many items you're planning to list in each category — the table and the mix chart below update immediately, with no page reload and no step to click through."
          />

          <button
            type="button"
            onClick={onReset}
            disabled={isDefault}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors enabled:hover:border-white/30 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset to a typical first listing
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-8">
          <Reveal>
            <div className="flex flex-col gap-3">
              {CATEGORY_ORDER.map((id) => {
                const def = CATEGORIES[id];
                return (
                  <Stepper
                    key={id}
                    label={def.label}
                    noun={def.noun}
                    caption={`Avg ${formatUsd(def.avgPrice)} per item · ${Math.round(def.feeRate * 100)}% repick fee`}
                    value={counts[id]}
                    onChange={(next) => onChange(id, next)}
                  />
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-bold text-white">Itemized payout breakdown</h3>
                <p aria-live="polite" className="shrink-0 text-right text-xl font-extrabold tabular-nums text-white">
                  {formatUsd(breakdown.totalPayout)}
                </p>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left">
                  <caption className="sr-only">
                    Live itemized seller payout breakdown, recalculated as you adjust the counters.
                  </caption>
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-[0.08em] text-zinc-400">
                      <th scope="col" className="py-2 pr-3 font-semibold">
                        Category
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Items
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Subtotal
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Fee
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Payout
                      </th>
                      <th scope="col" className="py-2 text-right font-semibold">
                        <span className="sr-only">Math</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-sm text-zinc-400">
                          Move a counter above to 1 or more to see your breakdown.
                        </td>
                      </tr>
                    ) : (
                      visibleRows.map((row) => {
                        const isOpen = Boolean(expanded[row.id]);
                        const panelId = `math-${row.id}`;
                        return (
                          <Fragment key={row.id}>
                            <tr className="border-b border-white/5 text-sm">
                              <th scope="row" className="py-3 pr-3 font-semibold text-white">
                                {row.label}
                              </th>
                              <td className="py-3 pr-3 text-right tabular-nums text-zinc-300">{row.count}</td>
                              <td className="py-3 pr-3 text-right tabular-nums text-zinc-300">
                                {formatUsd(row.subtotal)}
                              </td>
                              <td className="py-3 pr-3 text-right tabular-nums text-zinc-400">
                                &minus;{formatUsd(row.fee)}
                              </td>
                              <td className="py-3 pr-3 text-right font-bold tabular-nums text-white">
                                {formatUsd(row.payout)}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  type="button"
                                  aria-expanded={isOpen}
                                  aria-controls={panelId}
                                  onClick={() => toggleRow(row.id)}
                                  className={`inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-sky-300 ${FOCUS}`}
                                >
                                  Math
                                  <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    aria-hidden="true"
                                  />
                                </button>
                              </td>
                            </tr>
                            {isOpen ? (
                              <tr id={panelId}>
                                <td colSpan={6} className="bg-white/[0.02] px-0 py-3 text-xs leading-[1.6] text-zinc-400">
                                  {row.count} &times; {formatUsd(CATEGORIES[row.id].avgPrice)} ={" "}
                                  {formatUsd(row.subtotal)} subtotal, minus {row.feePct}% fee (
                                  {formatUsd(row.fee)}) = {formatUsd(row.payout)} payout &mdash; {row.sharePct}% of
                                  your current total.
                                </td>
                              </tr>
                            ) : null}
                          </Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Category mix of your estimated payout
                </p>
                <div className="mt-3">
                  <StackedBar rows={breakdown.rows} totalPayout={breakdown.totalPayout} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
