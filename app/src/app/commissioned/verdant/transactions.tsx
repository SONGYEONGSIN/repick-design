"use client";

import { Fragment } from "react";
import { ArrowDownLeft, ArrowUpDown, ArrowUpRight, ChevronDown, X } from "lucide-react";

import {
  CATEGORY,
  KIND,
  UI,
  cardOf,
  dateFull,
  dateShort,
  formatDirected,
  formatSigned,
  sumOf,
  type CategoryKey,
  type Lang,
  type SortDir,
  type SortKey,
  type Txn,
} from "./data";
import { Avatar, PANEL, RING, cx } from "./ui";

const PREVIEW = 8;

export function Transactions({
  lang,
  rows,
  sortKey,
  sortDir,
  onSort,
  selected,
  onToggleRow,
  onToggleAll,
  expanded,
  onExpand,
  compact,
  showAll,
  onShowAll,
  catFilter,
  onClearCat,
}: {
  lang: Lang;
  rows: readonly Txn[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  selected: readonly string[];
  onToggleRow: (id: string) => void;
  onToggleAll: (ids: readonly string[], next: boolean) => void;
  expanded: string | null;
  onExpand: (id: string | null) => void;
  compact: boolean;
  showAll: boolean;
  onShowAll: (next: boolean) => void;
  catFilter: CategoryKey | null;
  onClearCat: () => void;
}) {
  const visible = showAll ? rows : rows.slice(0, PREVIEW);
  const visibleIds = visible.map((row) => row.id);
  const allOn = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const picked = selected.filter((id) => visibleIds.includes(id));
  const pickedSum = sumOf(visible, picked);
  const pad = compact ? "py-1.5" : "py-3";

  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <section
      id="verdant-transactions"
      aria-labelledby="verdant-transactions-h"
      className={cx(PANEL, "scroll-mt-24 p-4 sm:p-5")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="verdant-transactions-h"
          className="text-sm font-semibold tracking-wide text-zinc-100"
        >
          {UI.transactions[lang]}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {catFilter !== null ? (
            <button
              type="button"
              onClick={onClearCat}
              className={cx(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-lime-300/60 bg-lime-300/10 px-3 text-xs text-lime-300 motion-safe:transition-colors hover:bg-lime-300/20",
                RING,
              )}
            >
              <span>{`${UI.filteredBy[lang]}: ${CATEGORY[catFilter][lang]}`}</span>
              <X className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{UI.clearFilter[lang]}</span>
            </button>
          ) : null}
          <span className="text-xs text-zinc-400 tabular-nums">
            {`${UI.showing[lang]} ${visible.length} ${UI.of[lang]} ${rows.length} ${UI.rows[lang]}`}
          </span>
        </div>
      </div>

      <div className="relative mt-3">
        <table className="w-full table-fixed border-collapse text-left [&_th]:text-left [&_th]:font-medium">
          <caption className="sr-only">{UI.txnCaption[lang]}</caption>
          <thead>
            <tr className="border-b border-zinc-800">
              <th scope="col" className="w-11 px-0 py-2">
                <label className="flex size-11 cursor-pointer items-center justify-center">
                  <input
                    type="checkbox"
                    checked={allOn}
                    onChange={() => onToggleAll(visibleIds, !allOn)}
                    aria-label={UI.selectAll[lang]}
                    className={cx("size-4 accent-lime-300", RING)}
                  />
                </label>
              </th>
              <th scope="col" aria-sort={ariaSort("party")} className="px-2 py-2">
                <SortButton
                  label={UI.colName[lang]}
                  on={sortKey === "party"}
                  onClick={() => onSort("party")}
                />
              </th>
              <th
                scope="col"
                className="hidden w-28 px-2 py-2 text-xs font-medium text-zinc-400 md:table-cell"
              >
                {UI.colType[lang]}
              </th>
              <th scope="col" aria-sort={ariaSort("amount")} className="w-28 px-2 py-2 text-right">
                <SortButton
                  label={UI.colAmount[lang]}
                  on={sortKey === "amount"}
                  onClick={() => onSort("amount")}
                  align="right"
                />
              </th>
              <th
                scope="col"
                aria-sort={ariaSort("date")}
                className="hidden w-28 px-2 py-2 sm:table-cell"
              >
                <SortButton
                  label={UI.colDate[lang]}
                  on={sortKey === "date"}
                  onClick={() => onSort("date")}
                />
              </th>
              <th scope="col" className="w-11 px-0 py-2">
                <span className="sr-only">{UI.colDetail[lang]}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-2 py-8 text-center text-sm text-zinc-400">
                  {UI.noRows[lang]}
                </td>
              </tr>
            ) : null}
            {visible.map((row, index) => {
              const open = expanded === row.id;
              const card = cardOf(row.card);
              return (
                <Fragment key={row.id}>
                  <tr className={cx("border-b border-zinc-800/70", open && "bg-zinc-800/30")}>
                    <td className={cx("px-0", pad)}>
                      <label className="flex size-11 cursor-pointer items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(row.id)}
                          onChange={() => onToggleRow(row.id)}
                          aria-label={`${UI.selectRow[lang]}: ${row.party[lang]}`}
                          className={cx("size-4 accent-lime-300", RING)}
                        />
                      </label>
                    </td>
                    <td className={cx("px-2", pad)}>
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Avatar seed={index + row.id.length} />
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm text-zinc-100">{row.party[lang]}</span>
                          <span className="truncate text-[11px] text-zinc-400 tabular-nums sm:hidden">
                            {dateShort(row.day, lang)}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className={cx("hidden px-2 text-sm text-zinc-400 md:table-cell", pad)}>
                      <span className="block truncate">{KIND[row.kind][lang]}</span>
                    </td>
                    <td className={cx("px-2 text-right", pad)}>
                      <span
                        className={cx(
                          "inline-flex items-center justify-end gap-1 text-sm whitespace-nowrap tabular-nums",
                          row.dir === "in" ? "text-lime-300" : "text-zinc-100",
                        )}
                      >
                        {row.dir === "in" ? (
                          <ArrowDownLeft className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        )}
                        {formatDirected(row.cents, row.dir)}
                      </span>
                    </td>
                    <td
                      className={cx(
                        "hidden px-2 text-sm text-zinc-400 tabular-nums sm:table-cell",
                        pad,
                      )}
                    >
                      {dateShort(row.day, lang)}
                    </td>
                    <td className={cx("px-0", pad)}>
                      <button
                        type="button"
                        onClick={() => onExpand(open ? null : row.id)}
                        aria-expanded={open}
                        aria-label={`${UI.detailOf[lang]}: ${row.party[lang]}`}
                        className={cx(
                          "inline-flex size-11 items-center justify-center rounded-lg text-zinc-400 motion-safe:transition-colors hover:text-zinc-100",
                          RING,
                        )}
                      >
                        <ChevronDown
                          className={cx("size-4 motion-safe:transition-transform", open && "rotate-180")}
                        />
                      </button>
                    </td>
                  </tr>
                  {open ? (
                    <tr className="border-b border-zinc-800/70 bg-zinc-800/30">
                      <td colSpan={6} className="px-2 pt-1 pb-4">
                        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="min-w-0">
                            <dt className="text-[11px] text-zinc-400">{UI.note[lang]}</dt>
                            <dd className="mt-0.5 text-sm text-zinc-100">{row.note[lang]}</dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-[11px] text-zinc-400">{UI.colDate[lang]}</dt>
                            <dd className="mt-0.5 text-sm text-zinc-100 tabular-nums">
                              {dateFull(row.day, lang)}
                            </dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-[11px] text-zinc-400">{UI.paidWith[lang]}</dt>
                            <dd className="mt-0.5 text-sm text-zinc-100 tabular-nums">
                              {`${card.label[lang]} ···· ${card.last4}`}
                            </dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-[11px] text-zinc-400">{UI.reference[lang]}</dt>
                            <dd
                              className="mt-0.5 text-sm text-zinc-100"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {`${row.ref} · ${row.cat === null ? KIND[row.kind][lang] : CATEGORY[row.cat][lang]}`}
                            </dd>
                          </div>
                        </dl>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-zinc-400 tabular-nums" aria-live="polite">
          {picked.length > 0
            ? `${picked.length} ${UI.selected[lang]} · ${formatSigned(pickedSum)}`
            : UI.spendingNote[lang]}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {picked.length > 0 ? (
            <button
              type="button"
              onClick={() => onToggleAll(visibleIds, false)}
              className={cx(
                "inline-flex min-h-11 items-center rounded-full border border-zinc-700 px-3 text-xs text-zinc-300 motion-safe:transition-colors hover:text-zinc-100",
                RING,
              )}
            >
              {UI.clearSelection[lang]}
            </button>
          ) : null}
          {rows.length > PREVIEW ? (
            <button
              type="button"
              onClick={() => onShowAll(!showAll)}
              className={cx(
                "inline-flex min-h-11 items-center rounded-full border border-zinc-700 px-3 text-xs text-zinc-100 motion-safe:transition-colors hover:bg-zinc-800",
                RING,
              )}
            >
              {showAll ? UI.showLess[lang] : UI.showAll[lang]}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SortButton({
  label,
  on,
  onClick,
  align = "left",
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex min-h-11 w-full items-center gap-1 rounded-lg text-xs font-medium motion-safe:transition-colors",
        align === "right" ? "justify-end" : "justify-start",
        on ? "text-lime-300" : "text-zinc-400 hover:text-zinc-100",
        RING,
      )}
    >
      <span className="truncate">{label}</span>
      <ArrowUpDown className="size-3 shrink-0" aria-hidden="true" />
    </button>
  );
}
