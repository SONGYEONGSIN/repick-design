"use client";

import {
  Activity as ActivityIcon,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";

import {
  CATEGORY,
  METHOD,
  STATUS,
  UI,
  dateShort,
  formatPct,
  formatSigned,
  type Lang,
  type StatusKey,
  type Totals,
  type Txn,
} from "./data";
import { CARD, FOCUS, SHELL, STATUS_TONE } from "./shell";
import type { SortKey, SortState } from "./dashboard";

type Props = {
  lang: Lang;
  rows: readonly Txn[];
  totals: Totals;
  status: StatusKey | "all";
  onStatus: (next: StatusKey | "all") => void;
  sort: SortState;
  onSort: (key: SortKey) => void;
  compact: boolean;
};

const STATUS_KEYS: readonly StatusKey[] = ["settled", "pending", "review"];

export default function Activity({
  lang,
  rows,
  totals,
  status,
  onStatus,
  sort,
  onSort,
  compact,
}: Props) {
  const ariaSort = (key: SortKey): "none" | "ascending" | "descending" =>
    sort && sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none";

  const cell = compact ? "py-2" : "py-3.5";

  const header = (key: SortKey, label: string, alignRight: boolean) => {
    const active = sort !== null && sort.key === key;
    const Icon = active ? (sort.dir === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;
    return (
      <button
        type="button"
        onClick={() => onSort(key)}
        className={`flex h-11 w-full items-center gap-1 rounded-lg text-[11px] tracking-[0.12em] uppercase transition-colors motion-reduce:transition-none ${FOCUS} ${
          active ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
        } ${alignRight ? "justify-end" : ""}`}
      >
        <span className="sr-only">{SHELL.sortBy[lang]}: </span>
        {label}
        <Icon size={13} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      </button>
    );
  };

  return (
    <section id="activity" aria-labelledby="lg-activity-heading" className={`${CARD} min-w-0 px-4 py-5 md:px-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="lg-activity-heading"
            className="inline-flex items-center gap-2 text-base font-medium text-zinc-900"
          >
            <ActivityIcon size={18} strokeWidth={1.75} aria-hidden="true" className="text-emerald-600" />
            {SHELL.recentActivity[lang]}
          </h2>
          <p className="mt-0.5 text-xs text-zinc-600">
            <span style={{ fontFamily: "var(--font-display-grotesk)" }} className="tabular-nums">
              {rows.length}
            </span>{" "}
            {UI.count[lang]}
            {sort === null ? ` · ${UI.streamNote[lang]}` : ""}
          </p>
        </div>

        <div className="relative">
          <label htmlFor="lg-status" className="sr-only">
            {UI.status[lang]}
          </label>
          <select
            id="lg-status"
            value={status}
            onChange={(event) => onStatus(event.target.value as StatusKey | "all")}
            className={`h-11 appearance-none rounded-xl border border-zinc-200 bg-white pr-10 pl-3.5 text-sm text-zinc-900 ${FOCUS}`}
          >
            <option value="all">{SHELL.statusAll[lang]}</option>
            {STATUS_KEYS.map((key) => (
              <option key={key} value={key}>
                {STATUS[key][lang]}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-600"
          />
        </div>
      </div>

      <table className="mt-3 w-full border-collapse">
        <caption className="sr-only">{SHELL.tableCaption[lang]}</caption>
        <thead>
          <tr className="border-b border-zinc-200">
            <th scope="col" aria-sort={ariaSort("party")} className="py-0 text-left font-medium">
              {header("party", SHELL.colType[lang], false)}
            </th>
            <th scope="col" aria-sort={ariaSort("amount")} className="py-0 text-right font-medium">
              {header("amount", SHELL.colAmount[lang], true)}
            </th>
            <th
              scope="col"
              aria-sort={ariaSort("status")}
              className="hidden py-0 text-left font-medium md:table-cell"
            >
              {header("status", UI.status[lang], false)}
            </th>
            <th
              scope="col"
              aria-sort={ariaSort("method")}
              className="hidden py-0 text-left font-medium lg:table-cell"
            >
              {header("method", UI.method[lang], false)}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-10 text-center text-sm text-zinc-600">
                {UI.empty[lang]}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const pool = row.dir === "in" ? totals.inCents : totals.outCents;
              const share = pool > 0 ? (row.cents / pool) * 100 : 0;
              return (
                <tr key={row.id} className="border-b border-zinc-100 last:border-b-0">
                  <td className={`${cell} pr-3`}>
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                          row.dir === "in"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {row.dir === "in" ? (
                          <ArrowDownLeft size={16} strokeWidth={2} />
                        ) : (
                          <ArrowUpRight size={16} strokeWidth={2} />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-zinc-900">{row.party[lang]}</span>
                        <span className="block text-xs text-zinc-600">
                          {CATEGORY[row.cat][lang]} · {dateShort(row.day, lang)}
                        </span>
                      </span>
                    </div>
                  </td>

                  <td className={`${cell} text-right align-middle`}>
                    <span
                      style={{ fontFamily: "var(--font-display-grotesk)" }}
                      className={`block text-sm font-medium whitespace-nowrap tabular-nums ${
                        row.dir === "in" ? "text-emerald-700" : "text-zinc-900"
                      }`}
                    >
                      {formatSigned(row.cents, row.dir)}
                    </span>
                    <span className="block text-[11px] text-zinc-600 tabular-nums">
                      {formatPct(share)}{" "}
                      {row.dir === "in" ? SHELL.shareIn[lang] : SHELL.shareOut[lang]}
                    </span>
                  </td>

                  <td className={`${cell} hidden pr-3 md:table-cell`}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ${STATUS_TONE[row.status]}`}
                    >
                      {STATUS[row.status][lang]}
                    </span>
                  </td>

                  <td className={`${cell} hidden lg:table-cell`}>
                    <span className="block text-sm text-zinc-900">{METHOD[row.method][lang]}</span>
                    <span
                      style={{ fontFamily: "var(--font-display-grotesk)" }}
                      className="block text-xs text-zinc-600 tabular-nums"
                    >
                      ····{row.last4}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
