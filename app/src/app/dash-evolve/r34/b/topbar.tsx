"use client";

import { useState, type RefObject } from "react";
import {
  Bell,
  ChevronDown,
  Command,
  FileWarning,
  Menu,
  Plus,
  Radar as RadarIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  LogOut,
} from "lucide-react";
import { InitialsAvatar, useDismissable } from "./ui";

const NOTIFICATIONS = [
  {
    id: "n1",
    icon: FileWarning,
    title: "Quantum Freight contract renews in 12 days",
    time: "2h ago",
  },
  {
    id: "n2",
    icon: RadarIcon,
    title: "Meridian Fabrication scorecard updated for Q3 2026",
    time: "Yesterday",
  },
  {
    id: "n3",
    icon: ShieldAlert,
    title: "Brightline Parts flagged for compliance review",
    time: "3d ago",
  },
];

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { panelRef, triggerRef } = useDismissable(open, () => setOpen(false));

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-zinc-600 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
      >
        <Bell aria-hidden="true" className="h-5 w-5" />
        <span
          aria-hidden="true"
          className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-700 text-[10px] text-white"
        >
          {NOTIFICATIONS.length}
        </span>
      </button>
      {open && (
        <div
          ref={panelRef}
          role="group"
          aria-label="Notifications"
          className="absolute right-0 top-[calc(100%+8px)] z-20 w-80 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-sm"
        >
          {NOTIFICATIONS.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="flex items-start gap-2.5 rounded-lg px-2.5 py-2">
                <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-zinc-800">{n.title}</span>
                  <span className="mt-0.5 block text-[11px] text-zinc-500">{n.time}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const { panelRef, triggerRef } = useDismissable(open, () => setOpen(false));

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center gap-1 rounded-full px-1.5 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
      >
        <InitialsAvatar initials="JL" className="h-8 w-8 text-xs" />
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-zinc-500" />
      </button>
      {open && (
        <div
          ref={panelRef}
          role="group"
          aria-label="Account"
          className="absolute right-0 top-[calc(100%+8px)] z-20 w-48 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm"
        >
          {[
            { label: "Profile", icon: User },
            { label: "Account settings", icon: Settings },
            { label: "Sign out", icon: LogOut },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Topbar({
  onOpenMobileNav,
  onOpenPalette,
  paletteTriggerRef,
}: {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  paletteTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <header className="flex h-16 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 lg:hidden"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        ref={paletteTriggerRef}
        type="button"
        onClick={onOpenPalette}
        aria-label="Search vendors and contracts, or open the command palette"
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-zinc-500 transition-colors motion-reduce:transition-none hover:border-zinc-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 sm:max-w-sm"
      >
        <Search aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span aria-hidden="true" className="min-w-0 flex-1 truncate text-sm">
          Search vendors, contracts…
        </span>
        <kbd
          aria-hidden="true"
          className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] text-zinc-500 sm:flex"
        >
          <Command aria-hidden="true" className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Add vendor"
          className="flex h-11 items-center gap-1.5 rounded-lg bg-lime-700 px-3.5 text-sm font-semibold text-white transition-colors motion-reduce:transition-none hover:bg-lime-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 sm:px-4"
        >
          <Plus aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Add vendor</span>
        </button>
        <NotificationsMenu />
        <AvatarMenu />
      </div>
    </header>
  );
}
