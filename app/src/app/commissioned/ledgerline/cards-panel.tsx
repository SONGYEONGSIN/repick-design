"use client";

import { CreditCard } from "lucide-react";

import { UI, accountOf, formatMoney, type Account, type AccountId, type Lang } from "./data";
import { CARD, FOCUS, SHELL } from "./shell";

type Props = {
  lang: Lang;
  accounts: readonly Account[];
  selected: AccountId;
  onSelect: (next: AccountId) => void;
};

export default function CardsPanel({ lang, accounts, selected, onSelect }: Props) {
  const account = accountOf(selected);
  const others = accounts.filter((item) => item.id !== selected);

  return (
    <section id="cards" aria-labelledby="lg-cards-heading" className={`${CARD} min-w-0 px-4 py-5 md:px-5`}>
      <h2
        id="lg-cards-heading"
        className="inline-flex items-center gap-2 text-base font-medium text-zinc-900"
      >
        <CreditCard size={18} strokeWidth={1.75} aria-hidden="true" className="text-emerald-600" />
        {SHELL.myCards[lang]}
      </h2>

      <div className="relative mt-6">
        <div
          aria-hidden="true"
          className="absolute inset-x-6 -top-3 h-8 rounded-t-2xl bg-emerald-500"
        />
        <div className="relative isolate overflow-hidden rounded-2xl bg-teal-900 p-5 text-white">
          <svg
            aria-hidden="true"
            viewBox="0 0 320 200"
            preserveAspectRatio="xMaxYMax slice"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          >
            <g className="stroke-white/10" fill="none" strokeWidth="26">
              <circle cx="300" cy="190" r="70" />
              <circle cx="300" cy="190" r="130" />
            </g>
          </svg>

          <div className="flex items-start justify-between gap-3">
            <h3
              style={{ fontFamily: "var(--font-display-grotesk)" }}
              className="text-xs font-medium tracking-[0.22em] text-teal-100 uppercase"
            >
              Ledgerline
            </h3>
            <span aria-hidden="true" className="flex shrink-0 items-center">
              <span className="block h-6 w-6 rounded-full bg-white/70" />
              <span className="-ml-2.5 block h-6 w-6 rounded-full bg-emerald-400" />
            </span>
          </div>

          <p
            style={{ fontFamily: "var(--font-display-grotesk)" }}
            className="mt-8 text-lg tracking-[0.18em] text-white tabular-nums"
          >
            <span aria-hidden="true">•••• •••• •••• </span>
            <span className="sr-only">{UI.holder[lang]} </span>
            {account.last4}
          </p>

          <div className="mt-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-teal-200">{account.kind[lang]}</p>
              <p
                style={{ fontFamily: "var(--font-display-grotesk)" }}
                className="text-2xl font-medium tracking-tight text-white tabular-nums"
              >
                {formatMoney(account.balance)}
              </p>
            </div>
            <p className="shrink-0 text-xs text-teal-200">{SHELL.holderName[lang]}</p>
          </div>
        </div>
      </div>

      <p id="lg-others" className="mt-5 text-xs tracking-[0.12em] text-zinc-600 uppercase">
        {SHELL.otherAccounts[lang]}
      </p>
      <ul aria-labelledby="lg-others" className="mt-2 flex flex-col gap-1">
        {others.map((item) => (
          <li key={item.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-zinc-50 motion-reduce:transition-none ${FOCUS}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-zinc-900">
                  <span className="sr-only">{SHELL.switchTo[lang]}: </span>
                  {item.name[lang]}
                </span>
                <span
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                  className="block text-xs text-zinc-600 tabular-nums"
                >
                  ····{item.last4}
                </span>
              </span>
              <span
                style={{ fontFamily: "var(--font-display-grotesk)" }}
                className="shrink-0 text-sm text-zinc-900 tabular-nums"
              >
                {formatMoney(item.balance)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
