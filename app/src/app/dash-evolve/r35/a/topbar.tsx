"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { cx, FOCUS, TEXT_AUX, TEXT_SECONDARY, TRANSITION } from "./tokens";

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
        aria-label="PK — open account menu"
        className={cx("flex h-11 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 pl-1.5 pr-2", TRANSITION, FOCUS, "hover:bg-white/10")}
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-violet-500/20 text-[11px] font-semibold text-violet-300">PK</span>
        <ChevronDown aria-hidden="true" className={cx("size-3.5", TEXT_AUX)} />
      </button>

      {open ? (
        <ul role="menu" aria-label="Account menu" className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg">
          <li role="none">
            <button type="button" role="menuitem" onClick={() => setOpen(false)} className={cx("flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]", TEXT_SECONDARY, FOCUS, "hover:bg-white/5")}>
              <User aria-hidden="true" className="size-3.5" /> Profile
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" onClick={() => setOpen(false)} className={cx("flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]", TEXT_SECONDARY, FOCUS, "hover:bg-white/5")}>
              <Settings aria-hidden="true" className="size-3.5" /> Settings
            </button>
          </li>
          <li role="none" className="my-1 border-t border-white/5" />
          <li role="none">
            <button type="button" role="menuitem" onClick={() => setOpen(false)} className={cx("flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-rose-400", FOCUS, "hover:bg-white/5")}>
              <LogOut aria-hidden="true" className="size-3.5" /> Log out
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export function Topbar({ onOpenMobileMenu, onOpenPalette }: { onOpenMobileMenu: () => void; onOpenPalette: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/5 bg-zinc-950/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className={cx("flex size-11 shrink-0 items-center justify-center rounded-lg lg:hidden", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/5 hover:text-zinc-100")}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cx("flex h-11 w-44 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left text-sm", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/10 sm:w-72")}
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">Search instruments…</span>
        <kbd className={cx("hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium sm:inline", TEXT_AUX)}>⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="2 unread notifications"
          className={cx("relative flex size-11 shrink-0 items-center justify-center rounded-lg", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/5 hover:text-zinc-100")}
        >
          <Bell aria-hidden="true" className="size-[18px]" />
          <span aria-hidden="true" className="absolute right-2.5 top-2.5 flex size-2 rounded-full border-2 border-zinc-950 bg-rose-500" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
