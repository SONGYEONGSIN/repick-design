"use client";

import { Calendar, ChevronDown, Download, Search, X } from "lucide-react";

import { UI, type AccountId, type Lang, type Period, type PeriodId } from "./data";
import { FOCUS, SHELL, periodOption } from "./shell";

type Props = {
  lang: Lang;
  period: PeriodId;
  onPeriod: (next: PeriodId) => void;
  query: string;
  onQuery: (next: string) => void;
  csv: string;
  account: AccountId;
  rangeStart: string;
  rangeEnd: string;
  periods: readonly Period[];
};

export default function Topbar({
  lang,
  period,
  onPeriod,
  query,
  onQuery,
  csv,
  account,
  rangeStart,
  rangeEnd,
  periods,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      <div className="relative min-w-0 flex-1 basis-full sm:basis-64">
        <label htmlFor="lg-search" className="sr-only">
          {SHELL.searchLabel[lang]}
        </label>
        <Search
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-600"
        />
        <input
          id="lg-search"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={SHELL.searchPlaceholder[lang]}
          className={`h-11 w-full rounded-xl border border-zinc-200 bg-white pr-11 pl-10 text-sm text-zinc-900 placeholder:text-zinc-600 ${FOCUS}`}
        />
        {query !== "" ? (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label={SHELL.clear[lang]}
            className={`absolute top-1/2 right-1 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl text-zinc-600 hover:text-zinc-900 ${FOCUS}`}
          >
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <p className="hidden h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-600 lg:ml-auto lg:inline-flex">
        <Calendar size={16} strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">{SHELL.range[lang]}: </span>
        <span style={{ fontFamily: "var(--font-display-grotesk)" }} className="tabular-nums">
          {rangeStart} – {rangeEnd}
        </span>
      </p>

      <div className="relative ml-auto lg:ml-0">
        <label htmlFor="lg-period" className="sr-only">
          {UI.period[lang]}
        </label>
        <select
          id="lg-period"
          value={period}
          onChange={(event) => onPeriod(event.target.value as PeriodId)}
          className={`h-11 appearance-none rounded-xl border border-zinc-200 bg-white pr-10 pl-3.5 text-sm text-zinc-900 ${FOCUS}`}
        >
          {periods.map((item) => (
            <option key={item.id} value={item.id}>
              {periodOption(item, lang)}
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

      <a
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
        download={`ledgerline-${account}-${period}.csv`}
        title={SHELL.exportHint[lang]}
        className={`inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 motion-reduce:transition-none ${FOCUS}`}
      >
        <Download size={16} strokeWidth={1.75} aria-hidden="true" />
        {SHELL.exportLabel[lang]}
      </a>
    </div>
  );
}
