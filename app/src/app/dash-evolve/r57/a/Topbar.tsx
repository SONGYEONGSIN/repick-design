"use client";

import { Search, Plus, Bell, Menu } from "lucide-react";

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400";

export function Topbar({
  onOpenPalette,
  onOpenDrawer,
  unreadCount,
}: {
  onOpenPalette: () => void;
  onOpenDrawer: () => void;
  unreadCount: number;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center gap-3 border-b border-white/10 bg-slate-950/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open navigation menu"
        className={`flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 lg:hidden ${FOCUS}`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <h1 className="truncate text-sm font-semibold text-slate-100 sm:text-base">Operations Overview</h1>

      <div className="min-w-0 flex-1" />

      <button
        type="button"
        onClick={onOpenPalette}
        className={`hidden h-[44px] min-w-[220px] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left text-slate-400 hover:bg-white/[0.06] sm:flex ${FOCUS}`}
      >
        <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-sm font-normal">Search teams, tickets…</span>
        <kbd className="flex-shrink-0 rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-normal text-slate-400">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        aria-label="Search teams and tickets"
        className={`flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 sm:hidden ${FOCUS}`}
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        className={`hidden h-[44px] flex-shrink-0 items-center gap-2 rounded-lg bg-green-500 px-3.5 text-sm font-medium text-slate-950 hover:bg-green-400 sm:flex ${FOCUS}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New ticket
      </button>

      <button
        type="button"
        aria-label={`Notifications, ${unreadCount} unread`}
        className={`relative flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 ${FOCUS}`}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span aria-hidden="true" className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>
    </header>
  );
}
