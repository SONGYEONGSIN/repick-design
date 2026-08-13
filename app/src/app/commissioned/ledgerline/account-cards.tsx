"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Minus,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  BASELINE,
  formatMoney,
  formatNet,
  periodOf,
  totalsOf,
  txnsFor,
  type Account,
  type AccountId,
  type Lang,
  type PeriodId,
} from "./data";
import { CARD, FOCUS, SHELL, TREND_TEXT, trendOf } from "./shell";

const ICON: Record<AccountId, LucideIcon> = {
  operating: Landmark,
  payroll: Wallet,
  reserve: PiggyBank,
};

type Props = {
  lang: Lang;
  accounts: readonly Account[];
  selected: AccountId;
  onSelect: (next: AccountId) => void;
  period: PeriodId;
  compact: boolean;
};

export default function AccountCards({
  lang,
  accounts,
  selected,
  onSelect,
  period,
  compact,
}: Props) {
  const windowLabel = periodOf(period).label[lang];

  return (
    <section aria-labelledby="lg-accounts-heading">
      <h2 id="lg-accounts-heading" className="sr-only font-medium">
        {SHELL.accountsHeading[lang]}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => {
          const rows = txnsFor(account.id, period);
          const totals = totalsOf(rows);
          const baseline = BASELINE[account.id][period];
          const baselineNet = baseline.in - baseline.out;
          const trend = trendOf(totals.netCents, 0);
          const TrendIcon =
            trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
          const Icon = ICON[account.id];
          const on = account.id === selected;

          return (
            <li key={account.id} className="min-w-0">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onSelect(account.id)}
                className={`${CARD} block w-full text-left transition-colors motion-reduce:transition-none ${FOCUS} ${
                  compact ? "p-4" : "p-5"
                } ${on ? "border-teal-900 ring-1 ring-teal-900" : "hover:border-zinc-300"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-900">
                    <span
                      aria-hidden="true"
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                        on ? "bg-teal-900 text-white" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <Icon size={15} strokeWidth={2} />
                    </span>
                    <span className="truncate">{account.name[lang]}</span>
                  </h3>
                  <span className="shrink-0 text-xs whitespace-nowrap text-zinc-600">
                    {windowLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                    className="text-2xl font-medium tracking-tight text-zinc-900 tabular-nums md:text-[28px]"
                  >
                    {formatMoney(account.balance)}
                  </p>
                  <p className={`inline-flex items-center gap-1 text-xs ${TREND_TEXT[trend]}`}>
                    <span
                      style={{ fontFamily: "var(--font-display-grotesk)" }}
                      className="font-medium tabular-nums"
                    >
                      {formatNet(totals.netCents)}
                    </span>
                    <TrendIcon size={14} strokeWidth={2} aria-hidden="true" />
                    <span className="text-zinc-600">{SHELL.netThis[lang]}</span>
                  </p>
                </div>

                <p className="mt-3 text-xs text-zinc-600">
                  {SHELL.vsPrefix[lang]}{" "}
                  <span
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                    className="tabular-nums"
                  >
                    {formatNet(baselineNet)}
                  </span>{" "}
                  {SHELL.vsSuffix[lang]}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
