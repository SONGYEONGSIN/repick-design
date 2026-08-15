"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Plus, Search, Settings, User } from "lucide-react";
import { cn } from "../utils";
import { useOps } from "../context";

function SearchTrigger() {
  const { setPaletteOpen } = useOps();
  return (
    <button
      type="button"
      onClick={() => setPaletteOpen(true)}
      className={cn(
        "flex h-11 w-40 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left text-sm text-zinc-400 outline-none transition-colors sm:w-64",
        "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
      )}
    >
      <Search aria-hidden="true" className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">Search shipments…</span>
      <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-zinc-400 sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="PN — open account menu"
        className={cn(
          "flex h-11 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 pl-1.5 pr-2 outline-none transition-colors",
          "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-rose-500/20 text-[11px] font-semibold text-rose-300">
          PN
        </span>
        <ChevronDown aria-hidden="true" className="size-3.5 text-zinc-400" />
      </button>

      {open ? (
        <ul role="menu" aria-label="Account menu" className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg">
          <li role="none" className="px-3 py-2">
            <p className="truncate text-[13px] font-medium text-zinc-100">Priya Navarro</p>
            <p className="truncate text-[11.5px] text-zinc-400">priya@portlane.io</p>
          </li>
          <li role="none" className="my-1 border-t border-white/5" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-zinc-300 outline-none hover:bg-white/5 focus-visible:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <User aria-hidden="true" className="size-3.5" /> Profile
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-zinc-300 outline-none hover:bg-white/5 focus-visible:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <Settings aria-hidden="true" className="size-3.5" /> Settings
            </button>
          </li>
          <li role="none" className="my-1 border-t border-white/5" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-rose-400 outline-none hover:bg-white/5 focus-visible:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <LogOut aria-hidden="true" className="size-3.5" /> Log out
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export function Topbar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/5 bg-zinc-950/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 outline-none transition-colors lg:hidden",
          "hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <SearchTrigger />

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "hidden h-11 items-center gap-1.5 rounded-lg bg-rose-700 px-3.5 text-sm font-semibold text-white outline-none transition-colors sm:flex",
            "hover:bg-rose-400 focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:bg-rose-600",
          )}
        >
          <Plus aria-hidden="true" className="size-4" />
          New shipment
        </button>

        <button
          type="button"
          aria-label="2 unread alerts"
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 outline-none transition-colors",
            "hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          )}
        >
          <Bell aria-hidden="true" className="size-4.5" />
          <span aria-hidden="true" className="absolute right-2.5 top-2.5 flex size-2 rounded-full bg-rose-500 ring-2 ring-zinc-950" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
