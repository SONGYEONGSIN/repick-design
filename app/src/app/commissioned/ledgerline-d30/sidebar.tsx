"use client";

import {
  ArrowLeftRight,
  CalendarClock,
  Check,
  CreditCard,
  Landmark,
  Layers,
  Receipt,
  Settings,
  Wallet,
  X,
} from "lucide-react";

import {
  ACCOUNTS,
  UI,
  formatMoney,
  type AccountId,
  type Lang,
} from "./data";
import { SHELL, cn } from "./ui";

type NavItem = {
  id: string;
  label: string;
  icon: typeof Wallet;
  active?: boolean;
};

function navSections(lang: Lang): { id: string; label: string; items: NavItem[] }[] {
  return [
    {
      id: "banking",
      label: SHELL.navBanking[lang],
      items: [
        { id: "overview", label: SHELL.navOverview[lang], icon: Wallet, active: true },
        { id: "movements", label: SHELL.navMovements[lang], icon: ArrowLeftRight },
        { id: "scheduled", label: SHELL.navScheduled[lang], icon: CalendarClock },
      ],
    },
    {
      id: "manage",
      label: SHELL.navManage[lang],
      items: [
        { id: "cards", label: SHELL.navCards[lang], icon: CreditCard },
        { id: "invoices", label: SHELL.navInvoices[lang], icon: Receipt },
        { id: "reports", label: SHELL.navReports[lang], icon: Layers },
      ],
    },
  ];
}

function Avatar({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" role="img" aria-label={label}>
      <circle cx="20" cy="20" r="20" fill="#e11d48" />
      <circle cx="20" cy="20" r="15" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fontSize="14"
        fill="#ffffff"
        fontFamily="var(--font-display-mono)"
      >
        MO
      </text>
    </svg>
  );
}

function AccountSwitcher({
  lang,
  account,
  onAccount,
}: {
  lang: Lang;
  account: AccountId;
  onAccount: (id: AccountId) => void;
}) {
  return (
    <div className="px-3">
      <p className="px-1 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
        {UI.accounts[lang]}
      </p>
      <div role="radiogroup" aria-label={SHELL.switchAccount[lang]} className="flex flex-col gap-1">
        {ACCOUNTS.map((item) => {
          const active = item.id === account;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onAccount(item.id)}
              className={cn(
                "flex min-h-11 w-full min-w-0 items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-left transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1",
                active
                  ? "border-rose-200 bg-rose-50"
                  : "border-zinc-200 bg-white hover:bg-zinc-50",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  active ? "bg-rose-600 text-white" : "bg-zinc-100 text-zinc-600",
                )}
              >
                {active ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-zinc-900">
                  {item.name[lang]}
                </span>
                <span className="block truncate text-[11px] text-zinc-600 tabular-nums">
                  {item.kind[lang]} {item.last4}
                </span>
              </span>
              <span
                className="shrink-0 text-[11px] font-medium text-zinc-700 tabular-nums"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {formatMoney(item.balance)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SidebarContent({
  lang,
  account,
  onAccount,
}: {
  lang: Lang;
  account: AccountId;
  onAccount: (id: AccountId) => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-zinc-100 px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-600">
          <Landmark className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span
            className="block truncate text-[15px] font-semibold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Ledgerline
          </span>
          <span className="block truncate text-[11px] text-zinc-600">
            {UI.wordmarkTag[lang]}
          </span>
        </span>
      </div>

      <div className="shrink-0 py-3">
        <AccountSwitcher lang={lang} account={account} onAccount={onAccount} />
      </div>

      <nav
        aria-label={SHELL.mainMenu[lang]}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-4"
      >
        {navSections(lang).map((section) => (
          <div key={section.id}>
            <p className="px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
              {section.label}
            </p>
            <ul className="mt-1.5 flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!item.active}
                      aria-current={item.active ? "page" : undefined}
                      title={item.active ? undefined : SHELL.navDemoNote[lang]}
                      className={cn(
                        "flex h-10 w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1",
                        item.active
                          ? "bg-rose-50 text-rose-700"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-60",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-zinc-100 p-3">
        <div className="flex min-w-0 items-center gap-2.5 rounded-lg px-1 py-1">
          <Avatar label={SHELL.userAvatar[lang]} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-zinc-900">
              {SHELL.userName[lang]}
            </span>
            <span className="block truncate text-[11px] text-zinc-600">
              {SHELL.userRole[lang]}
            </span>
          </span>
          <button
            type="button"
            disabled
            title={SHELL.navDemoNote[lang]}
            aria-label={SHELL.navSettings[lang]}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 disabled:pointer-events-none disabled:opacity-60"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  lang,
  account,
  onAccount,
  mobileOpen,
  onCloseMobile,
}: {
  lang: Lang;
  account: AccountId;
  onAccount: (id: AccountId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start">
        <SidebarContent lang={lang} account={account} onAccount={onAccount} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label={SHELL.closeMenu[lang]}
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-900/40"
          />
          <div className="relative flex h-dvh w-72 max-w-[85%] flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label={SHELL.closeMenu[lang]}
              className="absolute right-2 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <SidebarContent
              lang={lang}
              account={account}
              onAccount={(id) => {
                onAccount(id);
                onCloseMobile();
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
