"use client";

import { useRef, useState } from "react";
import { Search, Bell, Download, Menu, ChevronDown, Settings, LogOut, CircleUserRound } from "lucide-react";
import { Avatar, cn, FOCUS_RING, IconButton, useDismiss } from "./ui";

interface Notification {
  id: string;
  title: string;
  meta: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Brightside flagged critical shrink", meta: "Loss prevention · 2h ago", unread: true },
  { id: "n2", title: "Q3 audit window closes in 5 days", meta: "Compliance · Yesterday", unread: true },
  { id: "n3", title: "Lakeshore Depot cleared to healthy", meta: "Weekly rollup · Sep 14", unread: false },
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
          "relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-50",
          FOCUS_RING,
        )}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {unreadCount > 0 && (
          <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
        )}
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg"
        >
          <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-zinc-50">
            Notifications
          </div>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="border-b border-white/5 px-4 py-3 last:border-0">
                <div className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", n.unread ? "bg-teal-400" : "bg-transparent")}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200">{n.title}</p>
                    <p className="text-xs text-zinc-400">{n.meta}</p>
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
          "flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 pl-1.5 pr-2.5 transition-colors hover:bg-white/5",
          FOCUS_RING,
        )}
      >
        <Avatar name="Mina Cho" />
        <span className="sr-only text-sm font-medium text-zinc-200 sm:not-sr-only sm:inline">Mina</span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 py-1 shadow-lg"
        >
          <div className="border-b border-white/10 px-3.5 py-2.5">
            <p className="truncate text-sm font-medium text-zinc-50">Mina Cho</p>
            <p className="truncate text-xs text-zinc-400">Loss Prevention Lead · Fernridge</p>
          </div>
          <button
            type="button"
            role="menuitem"
            className={cn(
              "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-zinc-200 hover:bg-white/5",
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
              "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-zinc-200 hover:bg-white/5",
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
              "flex w-full items-center gap-2.5 border-t border-white/10 px-3.5 py-2 text-left text-sm text-zinc-200 hover:bg-white/5",
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
  onExport,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
  onExport: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 sm:px-6 lg:px-8">
      <IconButton label="Open navigation" onClick={onOpenMobileNav} className="lg:hidden">
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
      </IconButton>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cn(
          "flex h-11 flex-1 max-w-xs items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-400 transition-colors hover:bg-white/10",
          FOCUS_RING,
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:truncate">Search or jump to…</span>
        <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-white/15 bg-zinc-900 px-1.5 py-0.5 font-sans text-[11px] font-medium text-zinc-400 sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          onClick={onExport}
          className={cn(
            "hidden h-11 items-center gap-2 rounded-lg bg-teal-400 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-teal-300 sm:inline-flex",
            FOCUS_RING,
          )}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export
        </button>
        <NotificationsMenu />
        <AvatarMenu />
      </div>
    </header>
  );
}
