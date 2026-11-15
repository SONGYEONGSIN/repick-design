"use client";

import { useState } from "react";
import { Bell, LogOut, Menu, Plus, Search, Settings } from "lucide-react";
import { FOCUS } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Devon Osei's talk ratio crossed 60% for the third call in a row." },
  { id: "n2", text: "Thornridge Manufacturing flagged at-risk after Friday's escalation call." },
];

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full min-w-0 items-center gap-3 border-b border-white/10 bg-zinc-950/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-50 lg:hidden`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`${FOCUS} flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 text-left text-sm font-normal text-zinc-400 hover:text-zinc-50 sm:max-w-sm`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">
          <span className="sr-only sm:not-sr-only">Search calls, accounts, reps&hellip;</span>
        </span>
        <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] font-normal text-zinc-400 sm:inline">
          &#8984;K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={`${FOCUS} hidden h-11 items-center gap-1.5 rounded-xl bg-sky-400 px-4 text-sm font-semibold text-zinc-950 hover:bg-sky-300 sm:flex`}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          Log call
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
              notifOpen
                ? "border-sky-400/30 bg-sky-400/10 text-sky-400"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-50"
            }`}
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          {notifOpen && (
            <>
              <button
                type="button"
                aria-label="Close notifications"
                onClick={() => setNotifOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div
                role="region"
                aria-label="Notifications"
                className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/50"
              >
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
                  Recent alerts
                </div>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="rounded-lg px-3 py-2 text-sm font-normal text-zinc-50">
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
            className={`${FOCUS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-50 hover:border-sky-400/30`}
          >
            RK<span className="sr-only"> account menu</span>
          </button>
          {userOpen && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                onClick={() => setUserOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/50"
              >
                <button
                  type="button"
                  role="menuitem"
                  className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
                >
                  <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Account settings
                </button>
                <button
                  type="button"
                  role="menuitem"
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
