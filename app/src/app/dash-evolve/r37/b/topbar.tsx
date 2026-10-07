"use client";

import { Bell, LogOut, Menu, Plus, Search, Settings } from "lucide-react";
import { Popover, PopoverItem } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Harlow Industrial inspection score dropped below 80." },
  { id: "n2", text: "Brightline Fasteners contract renewal due in 29 days." },
  { id: "n3", text: "Delta Harbor Logistics contract expired." },
] as const;

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
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-zinc-950 px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex size-11 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <button
        ref={searchTriggerRef}
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 text-left text-sm text-zinc-400 hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 sm:max-w-xs"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Search vendors…</span>
        <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400 sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-2 rounded-lg bg-indigo-500 px-3.5 text-sm font-medium text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 sm:flex"
        >
          <Plus className="size-4" aria-hidden="true" />
          New inspection
        </button>
        <button
          type="button"
          aria-label="New inspection"
          className="flex size-11 items-center justify-center rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 sm:hidden"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>

        <Popover
          align="right"
          panelLabel="Notifications"
          trigger={({ ref, onClick, open }) => (
            <button
              ref={ref}
              type="button"
              onClick={onClick}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-label="Notifications, 3 unread"
              className="relative flex size-11 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <Bell className="size-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute right-2.5 top-2.5 size-2 rounded-full bg-indigo-400"
              />
            </button>
          )}
        >
          {() => (
            <div className="flex flex-col gap-1">
              <p className="px-2.5 pb-1 pt-1.5 text-xs font-medium text-zinc-400">Notifications</p>
              {NOTIFICATIONS.map((note) => (
                <p
                  key={note.id}
                  className="rounded-md px-2.5 py-2 text-sm text-zinc-300"
                >
                  {note.text}
                </p>
              ))}
            </div>
          )}
        </Popover>

        <Popover
          align="right"
          panelLabel="Account menu"
          trigger={({ ref, onClick, open }) => (
            <button
              ref={ref}
              type="button"
              onClick={onClick}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-label="RT account menu"
              className="flex size-11 items-center justify-center rounded-md hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-300">
                RT
              </span>
            </button>
          )}
        >
          {(close) => (
            <>
              <PopoverItem onClick={close}>
                <Settings className="size-4" aria-hidden="true" />
                Settings
              </PopoverItem>
              <PopoverItem onClick={close}>
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </PopoverItem>
            </>
          )}
        </Popover>
      </div>
    </header>
  );
}
