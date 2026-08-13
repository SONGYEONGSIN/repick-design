"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, PanelLeft, Search } from "lucide-react";

import {
  ACCOUNTS,
  PERIODS,
  UI,
  type AccountId,
  type Lang,
  type PeriodId,
} from "./data";
import { NOTIFICATIONS, SHELL, Segmented, cn } from "./ui";

/* --------------------------------------------------------------- top bar */

export function Topbar({
  lang,
  onLang,
  period,
  onPeriod,
  accountLabel,
  onOpenMenu,
  onOpenSearch,
}: {
  lang: Lang;
  onLang: (next: Lang) => void;
  period: PeriodId;
  onPeriod: (next: PeriodId) => void;
  accountLabel: string;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setNotifOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const periodOptions = PERIODS.map((item) => ({ id: item.id, label: item.short[lang] }));

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-white/95 px-3 py-2 backdrop-blur sm:px-4 lg:h-16 lg:flex-nowrap lg:py-0">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label={SHELL.openMenu[lang]}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 lg:hidden"
      >
        <PanelLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-[13px] text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 lg:max-w-sm"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{SHELL.searchHint[lang]}</span>
        <kbd className="hidden shrink-0 items-center rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-600 sm:flex">
          Ctrl K
        </kbd>
      </button>

      <div className="order-last flex w-full min-w-0 items-center gap-2 lg:order-none lg:ml-auto lg:w-auto">
        <Segmented
          label={UI.period[lang]}
          value={period}
          options={periodOptions}
          onChange={onPeriod}
        />
        <div
          role="radiogroup"
          aria-label={UI.language[lang]}
          className="inline-flex h-11 shrink-0 items-center rounded-lg border border-zinc-200 bg-zinc-100 p-1"
        >
          <button
            type="button"
            role="radio"
            aria-checked={lang === "en"}
            aria-label={SHELL.langEnName[lang]}
            onClick={() => onLang("en")}
            className={cn(
              "h-9 rounded-md px-2.5 text-[13px] font-medium tracking-wide transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1",
              lang === "en" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            EN
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={lang === "ko"}
            aria-label={SHELL.langKoName[lang]}
            onClick={() => onLang("ko")}
            className={cn(
              "h-9 rounded-md px-2.5 text-[13px] font-medium tracking-wide transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1",
              lang === "ko" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            KO
          </button>
        </div>
      </div>

      <div className="relative ml-auto flex shrink-0 items-center gap-1 lg:ml-2">
        <button
          type="button"
          onClick={() => setNotifOpen(!notifOpen)}
          aria-haspopup="true"
          aria-expanded={notifOpen}
          aria-label={SHELL.notifications[lang]}
          className="relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white"
          />
        </button>

        {notifOpen ? (
          <div
            role="dialog"
            aria-label={SHELL.notifications[lang]}
            className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
          >
            <p className="border-b border-zinc-100 px-3.5 py-2.5 text-[13px] font-medium text-zinc-900">
              {SHELL.notifications[lang]}
            </p>
            <ul>
              {NOTIFICATIONS.map((item) => (
                <li key={item.id} className="border-b border-zinc-100 px-3.5 py-2.5 last:border-0">
                  <p className="text-[13px] leading-snug text-zinc-700">{item.title[lang]}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-600">{item.time[lang]}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <span className="hidden min-w-0 items-center gap-2 rounded-lg py-1 pl-1 pr-2 sm:flex">
          <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0" aria-hidden="true">
            <circle cx="20" cy="20" r="20" fill="#e11d48" />
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
          <span className="hidden min-w-0 xl:block">
            <span className="block truncate text-[13px] font-medium text-zinc-900">
              {SHELL.userName[lang]}
            </span>
            <span className="block truncate text-[11px] text-zinc-600">{accountLabel}</span>
          </span>
        </span>
      </div>
    </header>
  );
}

/* -------------------------------------------------------- command palette */

type Command = {
  id: string;
  group: string;
  label: string;
  hint: string;
  run: () => void;
};

export function CommandPalette({
  onClose,
  lang,
  onAccount,
  onPeriod,
  onLang,
}: {
  onClose: () => void;
  lang: Lang;
  onAccount: (id: AccountId) => void;
  onPeriod: (id: PeriodId) => void;
  onLang: (next: Lang) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const opener = document.activeElement;
    inputRef.current?.focus();
    return () => {
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  const commands = useMemo<Command[]>(() => {
    const accountCommands: Command[] = ACCOUNTS.map((item) => ({
      id: `account-${item.id}`,
      group: UI.accounts[lang],
      label: item.name[lang],
      hint: `${item.kind[lang]} ${item.last4}`,
      run: () => onAccount(item.id),
    }));
    const periodCommands: Command[] = PERIODS.map((item) => ({
      id: `period-${item.id}`,
      group: UI.period[lang],
      label: item.label[lang],
      hint: item.short[lang],
      run: () => onPeriod(item.id),
    }));
    const langCommands: Command[] = [
      {
        id: "lang-en",
        group: UI.language[lang],
        label: SHELL.langEnName[lang],
        hint: "EN",
        run: () => onLang("en"),
      },
      {
        id: "lang-ko",
        group: UI.language[lang],
        label: SHELL.langKoName[lang],
        hint: "KO",
        run: () => onLang("ko"),
      },
    ];
    return [...accountCommands, ...periodCommands, ...langCommands];
  }, [lang, onAccount, onPeriod, onLang]);

  const needle = query.trim().toLowerCase();
  const results = needle.length
    ? commands.filter(
        (item) =>
          item.label.toLowerCase().includes(needle) || item.hint.toLowerCase().includes(needle),
      )
    : commands;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12dvh]">
      <button
        type="button"
        aria-label={SHELL.closeSearch[lang]}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ledgerline-palette-title"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <h2 id="ledgerline-palette-title" className="sr-only font-medium">
          {SHELL.jumpTo[lang]}
        </h2>
        <div className="flex h-12 items-center gap-2 border-b border-zinc-100 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />
          <label htmlFor="ledgerline-palette-input" className="sr-only">
            {SHELL.searchLabel[lang]}
          </label>
          <input
            id="ledgerline-palette-input"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={SHELL.searchHint[lang]}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-600 focus-visible:outline-none"
          />
        </div>
        <ul className="max-h-[50dvh] overflow-y-auto py-1">
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  item.run();
                  onClose();
                }}
                className="flex min-h-11 w-full min-w-0 items-center gap-3 px-3.5 py-2 text-left transition-colors hover:bg-zinc-50 motion-reduce:transition-none focus-visible:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500"
              >
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-zinc-900">
                  {item.label}
                </span>
                <span className="shrink-0 text-[11px] text-zinc-600 tabular-nums">{item.hint}</span>
                <span className="hidden shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 sm:block">
                  {item.group}
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 ? (
            <li className="px-3.5 py-6 text-center text-[13px] text-zinc-600">
              {SHELL.jumpEmpty[lang]}
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
