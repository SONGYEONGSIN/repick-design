"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Plus, Search, Settings, User } from "lucide-react";
import { Avatar } from "./ui";
import { CURRENT_USER_ID, getTeamMember } from "./data";

export function Topbar({
  onOpenPalette,
  onOpenMobileMenu,
}: {
  onOpenPalette: () => void;
  onOpenMobileMenu: () => void;
}) {
  const me = getTeamMember(CURRENT_USER_ID)!;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none lg:hidden"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 min-w-0 max-w-sm flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 hover:border-zinc-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <span className="truncate">Search findings, assets, CVEs…</span>
        <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-teal-700 px-3 text-sm font-medium text-white hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New finding
        </button>
        <NotificationMenu />
        <UserMenu meName={me.name} meRole={me.role} avatarUrl={me.avatarUrl} />
      </div>
    </header>
  );
}

function NotificationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open 3 notifications"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg"
        >
          <p className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">3 notifications</p>
          <ul className="space-y-0.5">
            <li className="rounded-lg px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
              <span className="font-medium text-zinc-900">VULN-1045</span> is at risk of breaching its critical SLA.
            </li>
            <li className="rounded-lg px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
              <span className="font-medium text-zinc-900">Daniel Ruiz</span> moved VULN-1020 to Assigned.
            </li>
            <li className="rounded-lg px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
              <span className="font-medium text-zinc-900">Sofia Almeida</span> requested re-verification on VULN-1004.
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function UserMenu({ meName, meRole, avatarUrl }: { meName: string; meRole: string; avatarUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex h-11 items-center gap-1.5 rounded-lg pr-1.5 pl-0.5 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Avatar src={avatarUrl} name={meName} size="sm" />
        <ChevronDown className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
        <span className="sr-only">{meName} account menu</span>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          <div className="px-2.5 py-2">
            <p className="text-sm font-medium text-zinc-900">{meName}</p>
            <p className="text-xs text-zinc-500">{meRole}</p>
          </div>
          <div className="my-1 h-px bg-zinc-100" />
          <button
            role="menuitem"
            type="button"
            className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2.5 text-sm text-zinc-700 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none"
          >
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            Profile
          </button>
          <button
            role="menuitem"
            type="button"
            className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2.5 text-sm text-zinc-700 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none"
          >
            <Settings className="h-3.5 w-3.5" aria-hidden="true" />
            Settings
          </button>
          <div className="my-1 h-px bg-zinc-100" />
          <button
            role="menuitem"
            type="button"
            className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2.5 text-sm text-rose-600 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
