"use client";

import { useState } from "react";
import { Search, Bell, Plus, Menu, ChevronDown, LogOut, Settings as SettingsIcon, UserRound } from "lucide-react";
import Image from "next/image";
import { FOCUS_RING } from "./ui";
import { CURRENT_USER } from "./data";

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 lg:hidden ${FOCUS_RING}`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 sm:max-w-sm ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Search services, incidents…</span>
        <kbd className="hidden flex-shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      <button
        type="button"
        className={`flex h-11 flex-shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-3.5 text-sm font-medium text-white hover:bg-green-700 ${FOCUS_RING}`}
      >
        <Plus className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">New incident</span>
      </button>

      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            setNotifOpen((v) => !v);
            setMenuOpen(false);
          }}
          aria-expanded={notifOpen}
          aria-label="Notifications, 3 unread"
          className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 ${FOCUS_RING}`}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-red-600 ring-2 ring-white"
          />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
            <p className="px-2.5 py-2 text-xs font-semibold text-zinc-900">Notifications</p>
            <div className="rounded-md px-2.5 py-2 text-xs text-zinc-700">
              <p className="font-medium text-zinc-900">SEV-1 opened on Payments Ledger</p>
              <p className="mt-0.5 text-zinc-500">2 minutes ago</p>
            </div>
            <div className="rounded-md px-2.5 py-2 text-xs text-zinc-700">
              <p className="font-medium text-zinc-900">Checkout API error budget over 100%</p>
              <p className="mt-0.5 text-zinc-500">41 minutes ago</p>
            </div>
            <div className="rounded-md px-2.5 py-2 text-xs text-zinc-700">
              <p className="font-medium text-zinc-900">Deploy to Search Index rolled back</p>
              <p className="mt-0.5 text-zinc-500">2 hours ago</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            setMenuOpen((v) => !v);
            setNotifOpen(false);
          }}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          aria-label={`Account menu for ${CURRENT_USER.name}`}
          className={`flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-zinc-100 ${FOCUS_RING}`}
        >
          <span className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-zinc-100">
            <Image
              src={`https://images.unsplash.com/photo-${CURRENT_USER.avatarId}?w=64&h=64&fit=crop&crop=faces&q=80`}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-500 sm:inline" aria-hidden="true" />
        </button>
        {menuOpen && (
          <div
            role="menu"
            aria-label="Account"
            className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
          >
            <p className="px-2.5 py-2 text-xs font-medium text-zinc-900">{CURRENT_USER.name}</p>
            <button
              type="button"
              role="menuitem"
              className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              <UserRound className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              Profile
            </button>
            <button
              type="button"
              role="menuitem"
              className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              <SettingsIcon className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              <LogOut className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
