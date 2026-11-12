"use client";

import { useState } from "react";
import { Menu, Search, Download, Bell, User, Settings, LogOut } from "lucide-react";
import { NOTIFICATIONS } from "./data";
import { Avatar } from "./ui";
import { Dropdown, DropdownItem } from "./dropdown";

export function Topbar({
  onOpenMobileMenu,
  onOpenPalette,
}: {
  onOpenMobileMenu: () => void;
  onOpenPalette: () => void;
}) {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open navigation menu"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 lg:hidden"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:w-auto sm:justify-start sm:px-3 lg:w-72"
      >
        <Search aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="hidden text-sm font-normal sm:inline">Search reviews, words…</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400 sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      <button
        type="button"
        className="flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:w-auto sm:px-4"
      >
        <Download aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="hidden text-sm font-medium sm:inline">Export report</span>
      </button>

      <Dropdown
        label="Notifications"
        align="right"
        panelClassName="w-80"
        trigger={({ onClick, expanded }) => (
          <button
            type="button"
            onClick={() => {
              onClick();
              setHasUnread(false);
            }}
            aria-expanded={expanded}
            aria-haspopup="true"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            <Bell aria-hidden="true" className="h-5 w-5" />
            {hasUnread ? (
              <span
                aria-hidden="true"
                className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-400"
              />
            ) : null}
            <span className="sr-only">{hasUnread ? "Unread notifications" : "No unread notifications"}</span>
          </button>
        )}
      >
        <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Notifications
        </p>
        <ul className="flex flex-col gap-1">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="flex items-start gap-3 rounded-lg px-3 py-2">
              <Avatar initials={n.initials} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-zinc-50">{n.name}</span>
                <span className="block text-sm font-normal text-zinc-400">{n.message}</span>
                <span className="mt-0.5 block text-xs font-normal text-zinc-400">{n.time}</span>
              </span>
            </li>
          ))}
        </ul>
      </Dropdown>

      <Dropdown
        label="Account menu"
        align="right"
        panelClassName="w-52"
        trigger={({ onClick, expanded }) => (
          <button
            type="button"
            onClick={onClick}
            aria-expanded={expanded}
            aria-haspopup="true"
            aria-label="Account menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            <Avatar initials="JK" />
          </button>
        )}
      >
        <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
        <DropdownItem icon={<Settings className="h-4 w-4" />}>Settings</DropdownItem>
        <DropdownItem icon={<LogOut className="h-4 w-4" />}>Log out</DropdownItem>
      </Dropdown>
    </header>
  );
}
