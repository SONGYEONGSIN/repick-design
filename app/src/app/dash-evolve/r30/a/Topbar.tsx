"use client";

import { useRef, useState } from "react";
import { Search, Bell, Plus, Menu, ChevronDown, Settings, LogOut, CircleUserRound } from "lucide-react";
import { cn, FOCUS_RING, IconButton, useDismiss } from "./ui";

interface Notification {
  id: string;
  title: string;
  meta: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Voss Industrial flagged at-risk", meta: "Customer success · 2h ago", unread: true },
  { id: "n2", title: "Q3 close deadline in 5 days", meta: "Finance ops · Yesterday", unread: true },
  { id: "n3", title: "Twine Analytics upgraded to Enterprise", meta: "Expansion · Sep 14", unread: false },
];

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
        className={cn(
          "relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900",
          FOCUS_RING,
        )}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500"
          />
        )}
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
        >
          <div className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">
            Notifications
          </div>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="border-b border-zinc-50 px-4 py-3 last:border-0">
                <div className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      n.unread ? "bg-cyan-500" : "bg-transparent",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-800">{n.title}</p>
                    <p className="text-xs text-zinc-500">{n.meta}</p>
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
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white pl-1.5 pr-2.5 transition-colors hover:bg-zinc-50",
          FOCUS_RING,
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
          MT
        </span>
        <span className="hidden text-sm font-medium text-zinc-700 sm:inline">Maya</span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          <div className="border-b border-zinc-100 px-3.5 py-2.5">
            <p className="truncate text-sm font-medium text-zinc-900">Maya Torres</p>
            <p className="truncate text-xs text-zinc-500">RevOps Lead · Northline SaaS</p>
          </div>
          <button
            type="button"
            role="menuitem"
            className={cn(
              "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50",
              FOCUS_RING,
            )}
          >
            <CircleUserRound className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            className={cn(
              "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50",
              FOCUS_RING,
            )}
          >
            <Settings className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            Settings
          </button>
          <button
            type="button"
            role="menuitem"
            className={cn(
              "flex w-full items-center gap-2.5 border-t border-zinc-100 px-3.5 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50",
              FOCUS_RING,
            )}
          >
            <LogOut className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-6 lg:px-8">
      <IconButton label="Open navigation" onClick={onOpenMobileNav} className="lg:hidden">
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
      </IconButton>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cn(
          "flex h-11 flex-1 max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-100",
          FOCUS_RING,
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:truncate">Search or jump to…</span>
        <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-zinc-500 sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          className={cn(
            "hidden h-11 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:inline-flex",
            FOCUS_RING,
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New report
        </button>
        <NotificationsMenu />
        <AvatarMenu />
      </div>
    </header>
  );
}
