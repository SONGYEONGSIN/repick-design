"use client";

import { CalendarClock } from "lucide-react";

import {
  CATEGORY,
  UI,
  byCategory,
  dateShort,
  formatMoney,
  formatPct,
  round2,
  type AccountId,
  type Lang,
  type StreamFilter,
  type Txn,
} from "./data";
import { SHELL, scheduledFor, sumCents } from "./ui";

export function BreakdownPanel({
  rows,
  flow,
  lang,
  accountId,
}: {
  rows: readonly Txn[];
  flow: StreamFilter;
  lang: Lang;
  accountId: AccountId;
}) {
  const dir = flow === "in" ? "in" : "out";
  const groups = byCategory(rows, dir).slice(0, 6);
  const total = sumCents(groups);
  const upcoming = scheduledFor(accountId).slice(0, 4);

  return (
    <div className="flex min-w-0 flex-col gap-5">
      {groups.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-[13px] text-zinc-600">
          {UI.empty[lang]}
        </p>
      ) : (
        <ul className="flex min-w-0 flex-col gap-3.5">
          {groups.map((group) => {
            const share = total > 0 ? (group.cents / total) * 100 : 0;
            return (
              <li key={group.key} className="min-w-0">
                <div className="flex min-w-0 items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-[13px] text-zinc-800">
                    {group.label[lang]}
                  </span>
                  <span
                    className="shrink-0 text-[13px] font-medium text-zinc-900 tabular-nums"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    {formatMoney(group.cents)}
                  </span>
                </div>
                <div className="mt-1.5 flex min-w-0 items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 min-w-0 flex-1 rounded-full bg-zinc-100">
                    <span
                      className="block h-full rounded-full bg-rose-500"
                      style={{ width: `${round2(share)}%` }}
                    />
                  </span>
                  <span className="shrink-0 text-[11px] text-zinc-600 tabular-nums">
                    {formatPct(share)} {UI.share[lang]} · {group.count} {UI.count[lang]}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="min-w-0 border-t border-zinc-100 pt-4">
        <h3 className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-900">
          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />
          {UI.scheduled[lang]}
        </h3>
        <ul className="mt-2.5 flex min-w-0 flex-col gap-2">
          {upcoming.map((item) => (
            <li
              key={item.id}
              className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-zinc-50 px-2.5 py-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-[13px] text-zinc-900">{item.party[lang]}</span>
                <span className="block truncate text-[11px] text-zinc-600">
                  {CATEGORY[item.cat][lang]} · {dateShort(item.day, lang)}
                </span>
              </span>
              <span className="shrink-0 text-[13px] font-medium text-zinc-900 tabular-nums">
                -{formatMoney(item.cents)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-[11px] text-zinc-600">{SHELL.breakdownNote[lang]}</p>
      </div>
    </div>
  );
}
