"use client";

import { useRef, useState } from "react";
import { Search, Bell, Plus, Menu, ChevronDown, Settings, LogOut, CircleUserRound } from "lucide-react";
import { NOTIFICATIONS } from "./data";
import { cx, FOCUS_RING, IconButton, useDismiss } from "./ui";

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => setOpen(false));
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notifications, ${unreadCount} unread`}
        title="Notifications"
        className={cx(
          "relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900",
          FOCUS_RING,
        )}
      >
        <Bell aria-hidden className="h-[18px] w-[18px]" />
        {unreadCount > 0 && <span aria-hidden className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-amber-600" />}
      </button>
      {open && (
        <div role="menu" aria-label="Notifications" className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
          <div className="border-b border-zinc-100 px-4 py-3 text-[13px] font-semibold text-zinc-900">Notifications</div>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="border-b border-zinc-50 px-4 py-3 last:border-0">
                <div className="flex items-start gap-2.5">
                  <span aria-hidden className={cx("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", n.unread ? "bg-amber-600" : "bg-transparent")} />
                  <div className="min-w-0">
                    <p className="text-[13px] text-zinc-800">{n.title}</p>
                    <p className="text-[11px] text-zinc-500">{n.meta}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={cx("flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white pl-1.5 pr-2.5 transition-colors hover:bg-zinc-50", FOCUS_RING)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">RO</span>
        <span className="hidden text-[13px] font-medium text-zinc-700 sm:inline">Renata</span>
        <ChevronDown aria-hidden className="h-3.5 w-3.5 text-zinc-400" />
      </button>
      {open && (
        <div role="menu" aria-label="Account menu" className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          <div className="border-b border-zinc-100 px-3.5 py-2.5">
            <p className="truncate text-[13px] font-medium text-zinc-900">Renata Osei</p>
            <p className="truncate text-[11px] text-zinc-500">Returns operations · repick</p>
          </div>
          <button type="button" role="menuitem" className={cx("flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}>
            <CircleUserRound aria-hidden className="h-4 w-4 text-zinc-400" />
            Profile
          </button>
          <button type="button" role="menuitem" className={cx("flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}>
            <Settings aria-hidden className="h-4 w-4 text-zinc-400" />
            Settings
          </button>
          <button type="button" role="menuitem" className={cx("flex w-full items-center gap-2.5 border-t border-zinc-100 px-3.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}>
            <LogOut aria-hidden className="h-4 w-4 text-zinc-400" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Topbar({ onOpenPalette, onOpenMobileNav }: { onOpenPalette: () => void; onOpenMobileNav: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-6 lg:px-8">
      <IconButton label="Open navigation" onClick={onOpenMobileNav} className="lg:hidden">
        <Menu aria-hidden className="h-[18px] w-[18px]" />
      </IconButton>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cx(
          "flex h-11 max-w-xs flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-[13px] text-zinc-600 transition-colors hover:bg-zinc-100",
          FOCUS_RING,
        )}
      >
        <Search aria-hidden className="h-4 w-4 shrink-0" />
        <span className="sr-only sm:not-sr-only sm:truncate">Search stages, paths, cases…</span>
        <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-zinc-500 sm:inline-flex">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          className={cx(
            "hidden h-11 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800 sm:inline-flex",
            FOCUS_RING,
          )}
        >
          <Plus aria-hidden className="h-4 w-4" />
          New return case
        </button>
        <NotificationsMenu />
        <AvatarMenu />
      </div>
    </header>
  );
}
