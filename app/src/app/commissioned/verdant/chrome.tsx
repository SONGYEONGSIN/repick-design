"use client";

import type { ComponentType } from "react";
import {
  ArrowLeftRight,
  Bell,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Info,
  LayoutGrid,
  Menu,
  PieChart,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

import { ALERTS, UI, dateShort, type Bi, type Lang } from "./data";
import { Avatar, BrandMark, RING, cx } from "./ui";

export type PrefKey = "settings" | "help";

type IconType = ComponentType<{ className?: string }>;
type NavItem = { id: string; label: Bi; Icon: IconType };

const NAV: readonly NavItem[] = [
  { id: "verdant-overview", label: UI.navOverview, Icon: LayoutGrid },
  { id: "verdant-insights", label: UI.navInsights, Icon: Sparkles },
  { id: "verdant-cashflow", label: UI.navCashflow, Icon: TrendingUp },
  { id: "verdant-transactions", label: UI.navTransactions, Icon: ArrowLeftRight },
  { id: "verdant-cards", label: UI.navCards, Icon: CreditCard },
  { id: "verdant-goals", label: UI.navGoals, Icon: Target },
  { id: "verdant-spending", label: UI.navSpending, Icon: PieChart },
  { id: "verdant-upcoming", label: UI.navUpcoming, Icon: CalendarClock },
];

export function Sidebar({
  lang,
  open,
  collapsed,
  onCollapse,
  active,
  onNavigate,
  pref,
  onPref,
  compact,
  onCompact,
}: {
  lang: Lang;
  open: boolean;
  collapsed: boolean;
  onCollapse: () => void;
  active: string;
  onNavigate: (id: string) => void;
  pref: PrefKey | null;
  onPref: (key: PrefKey) => void;
  compact: boolean;
  onCompact: (next: boolean) => void;
}) {
  return (
    <aside
      id="verdant-sidebar"
      className={cx(
        "shrink-0 border-b border-zinc-800 bg-zinc-950 lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r",
        open ? "block" : "hidden",
        collapsed ? "lg:w-20" : "lg:w-64",
      )}
    >
      <div
        className={cx(
          "flex items-center gap-2 px-4 py-4",
          collapsed ? "lg:justify-center lg:px-2" : "justify-between",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <BrandMark className="size-8 shrink-0" />
          <span className={cx("flex min-w-0 flex-col", collapsed && "lg:hidden")}>
            <span
              className="truncate text-base leading-tight font-semibold tracking-tight text-zinc-50"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              {UI.brand[lang]}
            </span>
            <span className="truncate text-[11px] leading-tight text-zinc-400">
              {UI.brandTag[lang]}
            </span>
          </span>
        </span>
        <button
          type="button"
          onClick={onCollapse}
          aria-expanded={!collapsed}
          aria-controls="verdant-sidebar-nav"
          aria-label={collapsed ? UI.expand[lang] : UI.collapse[lang]}
          className={cx(
            "hidden size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 motion-safe:transition-colors hover:border-zinc-700 hover:text-zinc-100 lg:inline-flex",
            RING,
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      <div id="verdant-sidebar-nav" className="px-3 pb-6">
        <p
          id="verdant-menu-label"
          className={cx(
            "px-2 pt-2 pb-2 text-[11px] tracking-[0.14em] text-zinc-400 uppercase",
            collapsed && "lg:sr-only",
          )}
        >
          {UI.menu[lang]}
        </p>
        <nav aria-labelledby="verdant-menu-label">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => {
              const on = item.id === active;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    aria-current={on ? "location" : undefined}
                    className={cx(
                      "relative flex min-h-11 items-center gap-3 rounded-xl border px-3 text-sm motion-safe:transition-colors",
                      collapsed && "lg:justify-center lg:px-0",
                      on
                        ? "border-lime-300/60 bg-lime-300/10 text-lime-300"
                        : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                      RING,
                    )}
                  >
                    <item.Icon className="size-4 shrink-0" />
                    <span className={cx("truncate", collapsed && "lg:sr-only")}>
                      {item.label[lang]}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <p
          id="verdant-pref-label"
          className={cx(
            "px-2 pt-6 pb-2 text-[11px] tracking-[0.14em] text-zinc-400 uppercase",
            collapsed && "lg:sr-only",
          )}
        >
          {UI.preference[lang]}
        </p>
        <nav aria-labelledby="verdant-pref-label">
          <ul className="flex flex-col gap-1">
            {([
              { key: "settings" as const, label: UI.navSettings, Icon: Settings },
              { key: "help" as const, label: UI.navHelp, Icon: Info },
            ]).map((row) => (
              <li key={row.key}>
                <button
                  type="button"
                  onClick={() => onPref(row.key)}
                  aria-expanded={pref === row.key}
                  aria-controls="verdant-pref-panel"
                  className={cx(
                    "flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm motion-safe:transition-colors",
                    collapsed && "lg:justify-center lg:px-0",
                    pref === row.key
                      ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                      : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                    RING,
                  )}
                >
                  <row.Icon className="size-4 shrink-0" />
                  <span className={cx("truncate", collapsed && "lg:sr-only")}>
                    {row.label[lang]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div id="verdant-pref-panel" className="px-1">
          {pref === "settings" ? (
            <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-400">{UI.settingsTitle[lang]}</p>
              <button
                type="button"
                role="switch"
                aria-checked={compact}
                onClick={() => onCompact(!compact)}
                className={cx(
                  "mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-2 text-left text-sm text-zinc-100 motion-safe:transition-colors hover:bg-zinc-800",
                  RING,
                )}
              >
                <span className="min-w-0 truncate">{UI.compactRows[lang]}</span>
                <span
                  aria-hidden="true"
                  className={cx(
                    "flex h-6 w-10 shrink-0 items-center rounded-full border p-0.5 motion-safe:transition-colors",
                    compact ? "justify-end border-lime-300 bg-lime-300" : "justify-start border-zinc-600 bg-zinc-800",
                  )}
                >
                  <span
                    className={cx(
                      "size-4 rounded-full",
                      compact ? "bg-zinc-950" : "bg-zinc-400",
                    )}
                  />
                </span>
              </button>
              <p className="mt-2 px-2 text-xs text-zinc-400">
                {`${UI.currentLang[lang]}: ${lang === "en" ? "English" : "한국어"}`}
              </p>
            </div>
          ) : null}
          {pref === "help" ? (
            <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-400">{UI.helpTitle[lang]}</p>
              <ul className="mt-2 flex flex-col gap-2 text-sm text-zinc-100">
                {[UI.help1, UI.help2, UI.help3].map((line, index) => (
                  <li key={`help-${index}`} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-lime-300" aria-hidden="true" />
                    <span className="min-w-0">{line[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export function Topbar({
  lang,
  onLang,
  query,
  onQuery,
  menuOpen,
  onMenu,
  insightsOpen,
  onInsights,
  notifOpen,
  onNotif,
  unread,
  onReadAll,
}: {
  lang: Lang;
  onLang: (next: Lang) => void;
  query: string;
  onQuery: (next: string) => void;
  menuOpen: boolean;
  onMenu: () => void;
  insightsOpen: boolean;
  onInsights: () => void;
  notifOpen: boolean;
  onNotif: () => void;
  unread: number;
  onReadAll: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 lg:px-6">
        <button
          type="button"
          onClick={onMenu}
          aria-expanded={menuOpen}
          aria-controls="verdant-sidebar"
          aria-label={menuOpen ? UI.closeMenu[lang] : UI.openMenu[lang]}
          className={cx(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-300 motion-safe:transition-colors hover:text-zinc-100 lg:hidden",
            RING,
          )}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <div
          role="search"
          className="relative order-last w-full min-w-0 basis-full sm:order-none sm:w-auto sm:min-w-56 sm:flex-1 sm:basis-auto"
        >
          <label htmlFor="verdant-search" className="sr-only">
            {UI.search[lang]}
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            id="verdant-search"
            type="text"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder={UI.searchHint[lang]}
            className={cx(
              "h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-24 pl-9 text-sm text-zinc-100 placeholder:text-zinc-400",
              RING,
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-1 sm:flex"
          >
            {["Ctrl", "F"].map((key) => (
              <span
                key={key}
                className="rounded-md border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {key}
              </span>
            ))}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div
            role="group"
            aria-label={UI.language[lang]}
            className="flex overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
          >
            {(["en", "ko"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onLang(code)}
                aria-pressed={lang === code}
                aria-label={code === "en" ? "English" : "Korean"}
                className={cx(
                  "h-11 w-12 text-xs tracking-wide motion-safe:transition-colors",
                  lang === code
                    ? "bg-lime-300 font-medium text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-100",
                  RING,
                )}
              >
                {code === "en" ? "EN" : "KO"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onInsights}
            aria-expanded={insightsOpen}
            aria-controls="verdant-insights-body"
            className={cx(
              "inline-flex h-11 items-center gap-2 rounded-full bg-lime-300 px-4 text-sm font-medium text-zinc-950 motion-safe:transition-colors hover:bg-lime-200",
              RING,
            )}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{UI.insights[lang]}</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={onNotif}
              aria-expanded={notifOpen}
              aria-controls="verdant-notifications"
              aria-label={`${UI.notifications[lang]}, ${unread} ${UI.unread[lang]}`}
              className={cx(
                "relative inline-flex size-11 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 motion-safe:transition-colors hover:text-zinc-100",
                RING,
              )}
            >
              <Bell className="size-5" aria-hidden="true" />
              {unread > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-lime-300 text-[10px] font-medium text-zinc-950"
                >
                  {unread}
                </span>
              ) : null}
            </button>
            <div id="verdant-notifications" className="absolute top-13 right-0 z-30">
              {notifOpen ? (
                <div className="w-72 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl">
                  <p className="px-1 pb-2 text-xs text-zinc-400">{UI.notifications[lang]}</p>
                  {unread === 0 ? (
                    <p className="px-1 pb-2 text-sm text-zinc-300">{UI.allRead[lang]}</p>
                  ) : null}
                  <ul className="flex flex-col gap-2">
                    {ALERTS.map((alert) => (
                      <li
                        key={alert.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-950 p-2.5"
                      >
                        <p className="flex items-start gap-2 text-sm text-zinc-100">
                          {unread > 0 ? (
                            <span
                              aria-hidden="true"
                              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime-300"
                            />
                          ) : null}
                          <span className="min-w-0">{alert.title[lang]}</span>
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">{alert.body[lang]}</p>
                        <p className="mt-1 text-[11px] text-zinc-400 tabular-nums">
                          {dateShort(alert.day, lang)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={onReadAll}
                    disabled={unread === 0}
                    className={cx(
                      "mt-2 flex min-h-11 w-full items-center justify-center rounded-xl border border-zinc-700 text-sm text-zinc-100 motion-safe:transition-colors hover:bg-zinc-800 disabled:text-zinc-400",
                      RING,
                    )}
                  >
                    {UI.markRead[lang]}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2 pl-1">
            <Avatar seed={7} />
            <span className="hidden min-w-0 flex-col sm:flex">
              <span className="truncate text-sm text-zinc-100">Noor Aldridge</span>
              <span className="truncate text-[11px] text-zinc-400">{UI.role[lang]}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
