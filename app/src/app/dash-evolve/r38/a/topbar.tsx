"use client";

import { useState } from "react";
import { Menu, Search, Bell, Download, ChevronDown, LogOut, Settings as SettingsIcon, UserRound } from "lucide-react";
import { InitialsAvatar } from "./ui";

export function Topbar({ onOpenMobileNav, onOpenPalette }: { onOpenMobileNav: () => void; onOpenPalette: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3 px-4 py-3 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-600 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onOpenPalette}
          className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left outline-offset-2 transition-colors duration-150 ease-out hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none sm:max-w-xs"
        >
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm font-normal text-zinc-500">Search vendors…</span>
          <kbd className="hidden shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 sm:inline-block">⌘K</kbd>
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="hidden h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white outline-offset-2 transition-colors duration-150 ease-out hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none sm:inline-flex"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
            Export report
          </button>

          <button
            type="button"
            aria-label="Notifications, 2 unread"
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-600" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex h-11 items-center gap-1.5 rounded-lg px-1.5 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <InitialsAvatar initials="MR" className="h-8 w-8 text-[11px]" />
              <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            </button>
            {menuOpen && (
              <>
                <div aria-hidden="true" className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <ul role="menu" aria-label="Account menu" className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-normal text-zinc-700 outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
                    >
                      <UserRound className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                      Profile
                    </button>
                  </li>
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-normal text-zinc-700 outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
                    >
                      <SettingsIcon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                      Settings
                    </button>
                  </li>
                  <li role="none" className="my-1 border-t border-zinc-100" />
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-normal text-zinc-700 outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
                    >
                      <LogOut className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                      Sign out
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
