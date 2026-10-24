"use client";

import { useState } from "react";
import { Bell, Download, LogOut, Menu, Search, Settings } from "lucide-react";

const NOTIFICATIONS = [
  { id: "n1", text: "New ARR shortfall widened to 20.6% of target this month." },
  { id: "n2", text: "Support SLA breach hours crossed 200 for the first time this quarter." },
  { id: "n3", text: "Margin erosion report for Q3 is ready to review." },
] as const;

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
        className="relative flex size-11 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        <Bell aria-hidden="true" className="size-5" />
        <span aria-hidden="true" className="absolute right-2.5 top-2.5 size-2 rounded-full bg-sky-600" />
      </button>
      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            aria-label="Notifications"
            className="absolute right-0 top-full z-20 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-sm"
          >
            <p className="px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">Notifications</p>
            {NOTIFICATIONS.map((note) => (
              <p key={note.id} role="menuitem" className="rounded-md px-2.5 py-2 text-sm text-zinc-700">
                {note.text}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Jordan Avery account menu"
        className="flex size-11 items-center justify-center rounded-md hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
          JA
        </span>
      </button>
      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            aria-label="Account"
            className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-sm"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <Settings aria-hidden="true" className="size-4" />
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <LogOut aria-hidden="true" className="size-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Topbar({
  onOpenMobileNav,
  onOpenPalette,
  searchTriggerRef,
}: {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  searchTriggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex size-11 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <button
        ref={searchTriggerRef}
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-500 hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:max-w-xs"
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">Search KPIs, reasons, teams…</span>
        <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-2 rounded-lg bg-sky-700 px-3.5 text-sm font-medium text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:flex"
        >
          <Download aria-hidden="true" className="size-4" />
          Export report
        </button>
        <button
          type="button"
          aria-label="Export report"
          className="flex size-11 items-center justify-center rounded-lg bg-sky-700 text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:hidden"
        >
          <Download aria-hidden="true" className="size-4" />
        </button>
        <NotificationsMenu />
        <AccountMenu />
      </div>
    </header>
  );
}
