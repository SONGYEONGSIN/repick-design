"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Network, Plus, Search, Settings } from "lucide-react";
import { FOCUS } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Data & ML compute crossed 72% of its monthly budget." },
  { id: "n2", text: "Payments database spend is up 5.9% quarter over quarter." },
];

const NAV_ITEMS = [
  { id: "allocation", label: "Allocation" },
  { id: "budgets", label: "Budgets" },
  { id: "anomalies", label: "Anomalies" },
  { id: "reports", label: "Reports" },
] as const;

export function Topbar({
  onOpenSearch,
  onOpenMobileNav,
  onOpenNewAlert,
  onNavPlaceholder,
}: {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
  onOpenNewAlert: () => void;
  onNavPlaceholder: (label: string) => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full min-w-0 items-center gap-2 border-b border-white/10 bg-zinc-950/85 px-4 backdrop-blur sm:px-6 lg:px-8 xl:px-10">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-50 lg:hidden`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex h-11 min-w-0 shrink-0 items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
          <Network className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="hidden truncate text-sm font-semibold text-zinc-50 sm:inline">Spendmesh</span>
      </div>

      <button
        type="button"
        onClick={() => onNavPlaceholder("Workspace switcher")}
        className={`${FOCUS} hidden h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-normal text-zinc-300 hover:text-zinc-50 md:flex`}
      >
        <span className="max-w-[9rem] truncate">Acme Cloud</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>

      <nav aria-label="Primary" className="ml-2 hidden min-w-0 items-center gap-1 lg:flex">
        {NAV_ITEMS.map((item) => {
          const active = item.id === "allocation";
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => {
                if (!active) onNavPlaceholder(item.label);
              }}
              className={`${FOCUS} flex h-11 shrink-0 items-center whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors ${
                active ? "bg-violet-600/15 text-violet-300" : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onOpenSearch}
        className={`${FOCUS} ml-auto flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 text-left text-sm font-normal text-zinc-400 hover:text-zinc-50 sm:max-w-[16rem]`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">
          <span className="sr-only sm:not-sr-only">Jump to a team or service&hellip;</span>
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] font-normal text-zinc-400 sm:inline">
          &#8984;K
        </kbd>
      </button>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenNewAlert}
          className={`${FOCUS} hidden h-11 items-center gap-1.5 whitespace-nowrap rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 sm:flex`}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          New alert
        </button>

        <div className="relative" onKeyDown={(e) => e.key === "Escape" && setNotifOpen(false)}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
              notifOpen ? "border-violet-500/40 bg-violet-600/15 text-violet-300" : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-50"
            }`}
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          {notifOpen && (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => setNotifOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div role="region" aria-label="Notifications" className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/50 sm:w-80">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Recent alerts</div>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="rounded-lg px-3 py-2 text-sm font-normal text-zinc-50">
                    {n.text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative" onKeyDown={(e) => e.key === "Escape" && setUserOpen(false)}>
          <button
            type="button"
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-expanded={userOpen}
            className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-50 hover:border-violet-500/40`}
          >
            RK<span className="sr-only"> account menu</span>
          </button>
          {userOpen && (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => setUserOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div role="menu" aria-label="Account menu" className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/50">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => onNavPlaceholder("Account settings")}
                  className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
                >
                  <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Account settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => onNavPlaceholder("Sign out")}
                  className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
                >
                  <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
