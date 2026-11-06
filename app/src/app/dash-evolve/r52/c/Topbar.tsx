"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Bell, Menu, Plus, LogOut, UserCog, ChevronDown } from "lucide-react";
import { Avatar } from "./ui";

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none lg:hidden"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none sm:max-w-sm"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:truncate">Search tickets, customers…</span>
        <span className="ml-auto hidden items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:flex">
          ⌘K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none sm:px-4"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">New ticket</span>
        </button>

        <button
          type="button"
          aria-label="Notifications, 4 unread"
          className="relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none"
          >
            <Avatar initials="SO" />
            <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-400 sm:block" aria-hidden="true" />
          </button>
          {menuOpen ? (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
            >
              <div className="px-3 py-2 text-xs text-zinc-500">Sana Osei · Escalations lead</div>
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none"
              >
                <UserCog className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                Account settings
              </button>
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none"
              >
                <LogOut className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
