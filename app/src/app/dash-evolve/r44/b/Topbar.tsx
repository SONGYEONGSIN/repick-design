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
  { id: "n1", title: "Columbus Hub missed the on-time floor", meta: "SLA alert · 2h ago", unread: true },
  { id: "n2", title: "November capacity plan ready for review", meta: "Planning · Yesterday", unread: true },
  { id: "n3", title: "Reno cleared its backlog from last week's storm", meta: "Weekly rollup · Oct 12", unread: false },
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
        className={cn("relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900", FOCUS_RING)}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {unreadCount > 0 && <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500" />}
      </button>
      {open && (
        <div role="menu" aria-label="Notifications" className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
          <div className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900">Notifications</div>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="border-b border-zinc-100 px-4 py-3 last:border-0">
                <div className="flex items-start gap-2.5">
                  <span aria-hidden="true" className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", n.unread ? "bg-emerald-600" : "bg-transparent")} />
                  <div className="min-w-0">
                    <p className="text-sm font-normal text-zinc-700">{n.title}</p>
                    <p className="text-xs font-normal text-zinc-500">{n.meta}</p>
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
        className={cn("flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white pl-1.5 pr-2.5 transition-colors hover:bg-zinc-50", FOCUS_RING)}
      >
        <Avatar name="Alicia Fenn" />
        <span className="sr-only text-sm font-medium text-zinc-700 sm:not-sr-only sm:inline">Alicia</span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" aria-label="Account menu" className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          <div className="border-b border-zinc-200 px-3.5 py-2.5">
            <p className="truncate text-sm font-medium text-zinc-900">Alicia Fenn</p>
            <p className="truncate text-xs font-normal text-zinc-500">Head of Fulfillment Ops</p>
          </div>
          <button type="button" role="menuitem" className={cn("flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}>
            <CircleUserRound className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            Profile
          </button>
          <button type="button" role="menuitem" className={cn("flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}>
            <Settings className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            Settings
          </button>
          <button type="button" role="menuitem" className={cn("flex w-full items-center gap-2.5 border-t border-zinc-200 px-3.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}>
            <LogOut className="h-4 w-4 text-zinc-500" aria-hidden="true" />
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
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/85 sm:px-6 lg:px-8">
      <IconButton label="Open navigation" onClick={onOpenMobileNav} className="lg:hidden">
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
      </IconButton>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cn("flex h-11 flex-1 max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm font-normal text-zinc-500 transition-colors hover:bg-zinc-100", FOCUS_RING)}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:truncate">Search or jump to…</span>
        <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-zinc-500 sm:inline-flex">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          onClick={onExport}
          className={cn("hidden h-11 items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-800 sm:inline-flex", FOCUS_RING)}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export calendar
        </button>
        <NotificationsMenu />
        <AvatarMenu />
      </div>
    </header>
  );
}
