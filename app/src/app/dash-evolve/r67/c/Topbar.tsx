"use client";

import { useState } from "react";
import { Bell, Check, Download, LogOut, Menu, Search, Settings } from "lucide-react";
import { FOCUS } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Northgate Freight churned this week — Scale plan, $6,800 MRR lost." },
  { id: "n2", text: "Meridian Outfitters crossed into at-risk status." },
];

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
  onExport,
  exported,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
  onExport: () => void;
  exported: boolean;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full min-w-0 items-center gap-3 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-900 lg:hidden`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`${FOCUS} flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-left text-sm font-normal text-zinc-600 hover:text-zinc-900 sm:max-w-sm`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">
          <span className="sr-only sm:not-sr-only">Search accounts, plans&hellip;</span>
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[11px] font-normal text-zinc-600 sm:inline">&#8984;K</kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className={`${FOCUS} hidden h-11 items-center gap-1.5 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 motion-reduce:transition-none sm:flex`}
        >
          {exported ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : <Download className="h-4 w-4 shrink-0" aria-hidden="true" />}
          {exported ? "Report exported" : "Export report"}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors motion-reduce:transition-none ${
              notifOpen ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          {notifOpen && (
            <>
              <button type="button" aria-label="Close notifications" onClick={() => setNotifOpen(false)} className="fixed inset-0 z-40 cursor-default" />
              <div role="region" aria-label="Notifications" className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">Recent alerts</div>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="rounded-lg px-3 py-2 text-sm font-normal text-zinc-900">
                    {n.text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setUserOpen((v) => !v)}
            aria-expanded={userOpen}
            className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-emerald-100 text-xs font-semibold text-emerald-700 hover:border-emerald-300`}
          >
            RK<span className="sr-only"> account menu</span>
          </button>
          {userOpen && (
            <>
              <button type="button" aria-label="Close account menu" onClick={() => setUserOpen(false)} className="fixed inset-0 z-40 cursor-default" />
              <div role="menu" aria-label="Account menu" className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                <button type="button" role="menuitem" className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900`}>
                  <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Account settings
                </button>
                <button type="button" role="menuitem" className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900`}>
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
