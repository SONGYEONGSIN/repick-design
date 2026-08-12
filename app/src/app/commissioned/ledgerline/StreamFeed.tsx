"use client";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useState } from "react";

import {
  CATEGORY,
  METHOD,
  STATUS,
  UI,
  dateFull,
  dateShort,
  formatMoney,
  formatSigned,
  type DayGroup,
  type Lang,
  type StatusKey,
  type StreamFilter,
  type Txn,
} from "./data";

type StreamFeedProps = {
  lang: Lang;
  filter: StreamFilter;
  onFilter: (next: StreamFilter) => void;
  groups: DayGroup[];
  total: number;
};

const FILTERS: { id: StreamFilter; label: { en: string; ko: string } }[] = [
  { id: "all", label: UI.filterAll },
  { id: "in", label: UI.filterIn },
  { id: "out", label: UI.filterOut },
];

function statusStyle(status: StatusKey): string {
  if (status === "pending") return "border-amber-300 bg-amber-50 text-amber-800";
  if (status === "review") return "border-rose-300 bg-rose-50 text-rose-700";
  return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

function StatusBadge({ status, lang }: { status: StatusKey; lang: Lang }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyle(status)}`}
    >
      {status === "settled" ? <Check aria-hidden="true" className="h-3 w-3" /> : null}
      {status === "pending" ? <Clock aria-hidden="true" className="h-3 w-3" /> : null}
      {status === "review" ? <AlertTriangle aria-hidden="true" className="h-3 w-3" /> : null}
      {STATUS[status][lang]}
    </span>
  );
}

function Detail({ txn, lang }: { txn: Txn; lang: Lang }) {
  const items: { label: string; value: string; mono: boolean }[] = [
    { label: UI.method[lang], value: `${METHOD[txn.method][lang]} ···· ${txn.last4}`, mono: false },
    { label: UI.category[lang], value: CATEGORY[txn.cat][lang], mono: false },
    { label: UI.reference[lang], value: txn.ref, mono: true },
    { label: UI.posted[lang], value: dateFull(txn.day, lang), mono: true },
    { label: UI.after[lang], value: formatMoney(txn.balanceAfter), mono: true },
  ];
  return (
    <div className="border-t border-dashed border-zinc-200 bg-zinc-50 px-3 py-3 sm:px-12">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline justify-between gap-3 sm:block">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
              {item.label}
            </dt>
            <dd
              className="truncate text-sm font-normal text-zinc-900 sm:mt-0.5"
              style={item.mono ? { fontFamily: "var(--font-display-mono)" } : undefined}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function StreamFeed({ lang, filter, onFilter, groups, total }: StreamFeedProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      aria-labelledby="ledgerline-stream"
      className="rounded-2xl border border-zinc-200 bg-white"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
        <div className="min-w-0">
          <h2 id="ledgerline-stream" className="text-base font-semibold text-zinc-900">
            {UI.streamTitle[lang]}
          </h2>
          <p className="mt-0.5 text-xs font-normal text-zinc-600">
            <span style={{ fontFamily: "var(--font-display-mono)" }}>{total}</span>{" "}
            {UI.count[lang]} · {UI.streamNote[lang]}
          </p>
        </div>
        <div
          role="group"
          aria-label={UI.filterGroup[lang]}
          className="ml-auto flex items-center gap-1 rounded-full bg-zinc-100 p-1"
        >
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => onFilter(item.id)}
                className={`inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 ${
                  active ? "bg-rose-600 text-white" : "text-zinc-700 hover:bg-white"
                }`}
              >
                {item.id === "in" ? <ArrowDownLeft aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                {item.id === "out" ? <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                {item.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm font-normal text-zinc-600">{UI.empty[lang]}</p>
      ) : (
        <ol>
          {groups.map((group) => (
            <li key={group.day} className="border-b border-zinc-100 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3 bg-zinc-50 px-4 py-2">
                <h3
                  className="text-xs font-medium text-zinc-700"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  {dateShort(group.day, lang)}
                </h3>
                <p className="flex items-baseline gap-3 text-xs font-normal text-zinc-600">
                  <span>
                    {UI.filterIn[lang]}{" "}
                    <span
                      className="tabular-nums text-zinc-900"
                      style={{ fontFamily: "var(--font-display-mono)" }}
                    >
                      {formatMoney(group.inCents)}
                    </span>
                  </span>
                  <span>
                    {UI.filterOut[lang]}{" "}
                    <span
                      className="tabular-nums text-rose-700"
                      style={{ fontFamily: "var(--font-display-mono)" }}
                    >
                      {formatMoney(group.outCents)}
                    </span>
                  </span>
                </p>
              </div>
              <ul>
                {group.rows.map((txn) => {
                  const open = openId === txn.id;
                  return (
                    <li key={txn.id} className="border-t border-zinc-100 first:border-t-0">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`detail-${txn.id}`}
                        onClick={() => setOpenId(open ? null : txn.id)}
                        className="relative grid w-full grid-cols-[2rem_minmax(0,1fr)_auto_1rem] items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-zinc-50 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-600 md:grid-cols-[2rem_minmax(0,1fr)_7rem_6rem_8.5rem_1rem]"
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                            txn.dir === "in"
                              ? "border-zinc-300 bg-white text-zinc-800"
                              : "border-rose-200 bg-rose-50 text-rose-700"
                          }`}
                        >
                          {txn.dir === "in" ? (
                            <ArrowDownLeft aria-hidden="true" className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                          )}
                        </span>

                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-zinc-900">
                            {txn.party[lang]}
                          </span>
                          <span className="block truncate text-xs font-normal text-zinc-600">
                            {txn.memo[lang]}
                          </span>
                          <span className="mt-1 flex md:hidden">
                            <StatusBadge status={txn.status} lang={lang} />
                          </span>
                        </span>

                        <span
                          className="hidden truncate text-xs font-normal text-zinc-600 md:block"
                          style={{ fontFamily: "var(--font-display-mono)" }}
                        >
                          {METHOD[txn.method][lang]} ···· {txn.last4}
                        </span>

                        <span className="hidden md:block">
                          <StatusBadge status={txn.status} lang={lang} />
                        </span>

                        <span
                          className={`justify-self-end whitespace-nowrap text-right text-sm font-medium tabular-nums ${
                            txn.dir === "in" ? "text-zinc-900" : "text-rose-700"
                          }`}
                          style={{ fontFamily: "var(--font-display-mono)" }}
                        >
                          {formatSigned(txn.cents, txn.dir)}
                        </span>

                        <ChevronDown
                          aria-hidden="true"
                          className={`h-4 w-4 justify-self-end text-zinc-600 transition-transform duration-150 motion-reduce:transition-none ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                        <span className="sr-only">
                          {open ? UI.detailClose[lang] : UI.detailOpen[lang]}
                        </span>
                      </button>
                      {open ? (
                        <div id={`detail-${txn.id}`}>
                          <Detail txn={txn} lang={lang} />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
