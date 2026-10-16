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
 *
 * ## Reassignment fix — page-overflow at 390px (reassign-queue #12)
 *
 * The prior attempt (`auto-landing-r34/c`) put the breakdown table in a
 * `overflow-x-auto` wrapper with a `min-w-[480px]` table inside a CSS grid
 * item. That wrapper's own local scroll worked correctly (`clientWidth`
 * stayed narrow, `scrollWidth` genuinely wider, locally scrollable) but a
 * verified Chromium quirk still let the wide table inflate
 * `document.documentElement.scrollWidth` at 390px — confirmed by the
 * reassign-queue entry's direct instrumentation (hiding the table dropped
 * scrollWidth 517→390; `contain:layout` on the wrapper dropped it the same
 * way without touching the table's own scroll).
 *
 * This version removes the problem at the root instead of containing it:
 * the table below is `table-fixed` with a `<colgroup>` of fixed
 * percentage widths (no `min-w-[...]`, no `overflow-x-auto`, no local
 * horizontal scroll at all). `table-fixed` layout never lets a table's
 * rendered width exceed its container regardless of cell content — cells
 * wrap or truncate instead of forcing the table wider — so there is no
 * wide descendant for the Chromium document-scrollWidth quirk to act on
 * in the first place. Every data cell also carries `truncate`
 * (`overflow:hidden; text-overflow:ellipsis; white-space:nowrap`) as a
 * second, independent guarantee that no cell's own content can paint past
 * its fixed-width box.
 *
 * `[contain:layout]` is additionally set on this whole `<section>` (which
 * wraps both the grid item and the table) as a belt-and-suspenders
 * measure — the queue's verified fix, kept even though the table-fixed
 * change above already removes the condition it was needed for.
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
    <section id="calculator" className="border-b border-zinc-200 py-20 [contain:layout] sm:py-28">
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
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-700 transition-colors enabled:hover:border-zinc-950 enabled:hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset to a typical first listing
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-8">
          <Reveal className="min-w-0">
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

          <Reveal delay={0.08} className="min-w-0">
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-bold text-zinc-950">Itemized payout breakdown</h3>
                <p aria-live="polite" className="shrink-0 text-right text-xl font-extrabold tabular-nums text-zinc-950">
                  {formatUsd(breakdown.totalPayout)}
                </p>
              </div>

              <div className="mt-4 min-w-0">
                <table className="w-full table-fixed border-collapse text-left">
                  <caption className="sr-only">
                    Live itemized seller payout breakdown, recalculated as you adjust the counters.
                  </caption>
                  <colgroup>
                    <col style={{ width: "27%" }} />
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "19%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "19%" }} />
                    <col style={{ width: "10%" }} />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs uppercase tracking-[0.08em] text-zinc-600">
                      <th scope="col" className="truncate py-2 pr-2 font-bold">
                        Category
                      </th>
                      <th scope="col" className="truncate py-2 pr-2 text-right font-bold">
                        Items
                      </th>
                      <th scope="col" className="truncate py-2 pr-2 text-right font-bold">
                        Subtotal
                      </th>
                      <th scope="col" className="truncate py-2 pr-2 text-right font-bold">
                        Fee
                      </th>
                      <th scope="col" className="truncate py-2 pr-2 text-right font-bold">
                        Payout
                      </th>
                      <th scope="col" className="truncate py-2 text-right font-bold">
                        <span className="sr-only">Math</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-sm text-zinc-600">
                          Set a counter above to 1 or more to see your breakdown.
                        </td>
                      </tr>
                    ) : (
                      visibleRows.map((row) => {
                        const isOpen = Boolean(expanded[row.id]);
                        const panelId = `math-${row.id}`;
                        return (
                          <Fragment key={row.id}>
                            <tr className="border-b border-zinc-100 text-sm">
                              <th scope="row" className="truncate py-3 pr-2 font-bold text-zinc-950">
                                {row.label}
                              </th>
                              <td className="truncate py-3 pr-2 text-right tabular-nums text-zinc-700">
                                {row.count}
                              </td>
                              <td className="truncate py-3 pr-2 text-right tabular-nums text-zinc-700">
                                {formatUsd(row.subtotal)}
                              </td>
                              <td className="truncate py-3 pr-2 text-right tabular-nums text-zinc-600">
                                &minus;{formatUsd(row.fee)}
                              </td>
                              <td className="truncate py-3 pr-2 text-right font-bold tabular-nums text-zinc-950">
                                {formatUsd(row.payout)}
                              </td>
                              <td className="py-3 pl-1 text-right">
                                <button
                                  type="button"
                                  aria-expanded={isOpen}
                                  aria-controls={panelId}
                                  aria-label={`${isOpen ? "Hide" : "Show"} the math for ${row.label}`}
                                  onClick={() => toggleRow(row.id)}
                                  className={`ml-auto flex h-7 w-7 items-center justify-center rounded-sm text-sky-700 ${FOCUS}`}
                                >
                                  <ChevronDown
                                    className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    aria-hidden="true"
                                  />
                                </button>
                              </td>
                            </tr>
                            {isOpen ? (
                              <tr id={panelId}>
                                <td colSpan={6} className="bg-zinc-50 px-0 py-3 text-xs leading-[1.6] text-zinc-600">
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

              <div className="mt-6 border-t border-zinc-200 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600">
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
