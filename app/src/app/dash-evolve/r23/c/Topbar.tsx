"use client";

import { Menu, Search, Plus, Bell, User, SlidersHorizontal, LogOut, TriangleAlert, Clock } from "lucide-react";
import { Popover, PopoverItem, Badge, FOCUS, Avatar } from "./ui";

export function Topbar({
  onOpenDrawer,
  onOpenPalette,
}: {
  onOpenDrawer: () => void;
  onOpenPalette: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden ${FOCUS}`}
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 w-full min-w-0 max-w-md items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 text-left text-zinc-500 hover:border-zinc-300 hover:bg-white ${FOCUS}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-[13px]">Search pickups, sellers, inspectors…</span>
        <kbd className="hidden shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-zinc-500 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={`hidden h-11 items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 text-[13px] font-medium text-white hover:bg-teal-800 sm:flex ${FOCUS}`}
        >
          <Plus className="h-4 w-4" aria-hidden />
          New Pickup
        </button>
        <button
          type="button"
          aria-label="New pickup"
          className={`flex h-11 w-11 items-center justify-center rounded-lg bg-teal-700 text-white hover:bg-teal-800 sm:hidden ${FOCUS}`}
        >
          <Plus className="h-4 w-4" />
        </button>

        <Popover
          align="right"
          width="w-80"
          trigger={({ toggle, open: isOpen }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Notifications"
              aria-haspopup="true"
              aria-expanded={isOpen}
              className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS}`}
            >
              <Bell className="h-[18px] w-[18px]" aria-hidden />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
            </button>
          )}
        >
          {() => (
            <div>
              <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                Notifications
              </p>
              <div className="flex items-start gap-2.5 rounded-lg px-2.5 py-2">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" aria-hidden />
                <div className="min-w-0">
                  <p className="text-[12.5px] text-zinc-800">Thu Sep 3 is at capacity — 38h / 40h booked.</p>
                  <p className="text-[11px] text-zinc-500">12 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg px-2.5 py-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                <div className="min-w-0">
                  <p className="text-[12.5px] text-zinc-800">2 items flagged this week are awaiting re-grade.</p>
                  <p className="text-[11px] text-zinc-500">1 hr ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg px-2.5 py-2">
                <Badge tone="green">Synced</Badge>
                <p className="text-[12.5px] text-zinc-800">Inspector shift plan for next week published.</p>
              </div>
            </div>
          )}
        </Popover>

        <Popover
          align="right"
          width="w-56"
          trigger={({ toggle, open: isOpen }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full hover:opacity-90 ${FOCUS}`}
            >
              <Avatar name="Jordan Ahn" size={32} />
            </button>
          )}
        >
          {(close) => (
            <div>
              <PopoverItem icon={<User className="h-3.5 w-3.5" aria-hidden />} onClick={close}>
                Profile
              </PopoverItem>
              <PopoverItem icon={<SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />} onClick={close}>
                Preferences
              </PopoverItem>
              <PopoverItem icon={<LogOut className="h-3.5 w-3.5" aria-hidden />} onClick={close}>
                Sign out
              </PopoverItem>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}
