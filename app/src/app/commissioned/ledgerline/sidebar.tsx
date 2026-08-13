"use client";

import {
  ArrowUpDown,
  CreditCard,
  Info,
  Landmark,
  LayoutDashboard,
  Languages,
  PiggyBank,
  Receipt,
  Settings,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { UI, type Account, type AccountId, type Lang } from "./data";
import { FOCUS, SHELL } from "./shell";

const ACCOUNT_ICON: Record<AccountId, LucideIcon> = {
  operating: Landmark,
  payroll: Wallet,
  reserve: PiggyBank,
};

type NavItem = { href: string; label: string; icon: LucideIcon; current: boolean };

type Props = {
  lang: Lang;
  onLang: (next: Lang) => void;
  account: AccountId;
  onAccount: (next: AccountId) => void;
  compact: boolean;
  onCompact: (next: boolean) => void;
  helpOpen: boolean;
  onHelp: (next: boolean) => void;
  accounts: readonly Account[];
};

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="10" className="fill-teal-900" />
      <path d="M9.5 7.5h3.6v13.4h9.4v3.6H9.5z" className="fill-white" />
      <rect x="16" y="7.5" width="6.5" height="3.6" rx="1.8" className="fill-emerald-400" />
    </svg>
  );
}

export default function Sidebar({
  lang,
  onLang,
  account,
  onAccount,
  compact,
  onCompact,
  helpOpen,
  onHelp,
  accounts,
}: Props) {
  const nav: NavItem[] = [
    { href: "#overview", label: SHELL.navOverview[lang], icon: LayoutDashboard, current: true },
    { href: "#cash-flow", label: SHELL.navCashflow[lang], icon: ArrowUpDown, current: false },
    { href: "#activity", label: SHELL.navActivity[lang], icon: Receipt, current: false },
    { href: "#cards", label: SHELL.navCards[lang], icon: CreditCard, current: false },
  ];

  return (
    <aside className="w-full shrink-0 border-b border-zinc-200 bg-white lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-6 px-4 py-4">
        <div className="flex items-center gap-3">
          <BrandMark className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p
              style={{ fontFamily: "var(--font-display-grotesk)" }}
              className="text-lg leading-tight font-semibold tracking-tight"
            >
              Ledgerline
            </p>
            <p className="truncate text-xs text-zinc-600">{UI.wordmarkTag[lang]}</p>
          </div>
        </div>

        <nav aria-labelledby="lg-nav-general" className="hidden lg:block">
          <p
            id="lg-nav-general"
            className="px-3 pb-2 text-[11px] tracking-[0.14em] text-zinc-600 uppercase"
          >
            {SHELL.navGeneral[lang]}
          </p>
          <ul className="flex flex-col gap-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors motion-reduce:transition-none ${FOCUS} ${
                    item.current
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {item.current ? (
                    <span className="grid h-5 w-5 shrink-0 place-items-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                  ) : (
                    <item.icon size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
                  )}
                  <span className="min-w-0 truncate">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div aria-labelledby="lg-nav-accounts" role="group">
          <p
            id="lg-nav-accounts"
            className="px-3 pb-2 text-[11px] tracking-[0.14em] text-zinc-600 uppercase"
          >
            {SHELL.accountsHeading[lang]}
          </p>
          <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-3 lg:grid-cols-1">
            {accounts.map((item) => {
              const Icon = ACCOUNT_ICON[item.id];
              const on = item.id === account;
              return (
                <li key={item.id} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => onAccount(item.id)}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors motion-reduce:transition-none ${FOCUS} ${
                      on
                        ? "bg-teal-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-left">{item.name[lang]}</span>
                    <span
                      style={{ fontFamily: "var(--font-display-grotesk)" }}
                      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${
                        on ? "bg-white/15 text-emerald-200" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {item.last4}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-1 lg:mt-auto">
          <button
            type="button"
            aria-expanded={helpOpen}
            onClick={() => onHelp(!helpOpen)}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 motion-reduce:transition-none ${FOCUS}`}
          >
            <Info size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
            <span>{SHELL.help[lang]}</span>
          </button>
          {helpOpen ? (
            <p className="rounded-xl bg-zinc-100 px-3 py-2 text-xs leading-5 text-zinc-600">
              {SHELL.helpNote[lang]}
            </p>
          ) : null}

          <div className="flex min-h-11 items-center gap-3 rounded-xl px-3">
            <Settings size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-zinc-600" />
            <span id="lg-compact-label" className="min-w-0 flex-1 truncate text-sm text-zinc-600">
              {SHELL.compactRows[lang]}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={compact}
              aria-labelledby="lg-compact-label"
              onClick={() => onCompact(!compact)}
              className={`grid h-11 w-12 shrink-0 place-items-center rounded-xl ${FOCUS}`}
            >
              <span
                className={`relative block h-6 w-11 rounded-full transition-colors motion-reduce:transition-none ${
                  compact ? "bg-emerald-500" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 block h-5 w-5 rounded-full bg-white transition-transform motion-reduce:transition-none ${
                    compact ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          </div>

          <div className="relative flex min-h-11 items-center gap-3 rounded-xl px-3">
            <Languages size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-zinc-600" />
            <span id="lg-lang-label" className="sr-only">
              {UI.language[lang]}
            </span>
            <div role="group" aria-labelledby="lg-lang-label" className="ml-auto flex shrink-0 gap-1 rounded-xl bg-zinc-100 p-1">
              <button
                type="button"
                aria-pressed={lang === "en"}
                aria-label={SHELL.langEn[lang]}
                onClick={() => onLang("en")}
                className={`h-11 w-12 rounded-lg text-xs transition-colors motion-reduce:transition-none ${FOCUS} ${
                  lang === "en" ? "bg-teal-900 text-white" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                aria-pressed={lang === "ko"}
                aria-label={SHELL.langKo[lang]}
                onClick={() => onLang("ko")}
                className={`h-11 w-12 rounded-lg text-xs transition-colors motion-reduce:transition-none ${FOCUS} ${
                  lang === "ko" ? "bg-teal-900 text-white" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                KO
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-zinc-200 p-2.5">
            <svg viewBox="0 0 40 40" role="img" aria-label={SHELL.holderName[lang]} className="h-10 w-10 shrink-0">
              <circle cx="20" cy="20" r="20" className="fill-teal-900" />
              <path d="M20 0a20 20 0 0 1 20 20H20z" className="fill-emerald-500" opacity="0.35" />
              <text
                x="20"
                y="25.5"
                textAnchor="middle"
                fontSize="14"
                fontWeight="500"
                className="fill-white"
              >
                DW
              </text>
            </svg>
            <div className="min-w-0">
              <p className="truncate text-sm text-zinc-900">{SHELL.holderName[lang]}</p>
              <p className="truncate text-xs text-zinc-600">{SHELL.cardHolderRole[lang]}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
