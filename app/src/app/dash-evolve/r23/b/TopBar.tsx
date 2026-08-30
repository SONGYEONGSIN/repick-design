"use client";

import { Menu, Search, Bell, Plus, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { Popover, PopoverItem } from "./ui/Popover";
import { FOCUS_RING } from "./ui/focus";

const NOTIFICATIONS = [
  { id: "n1", text: "Nautilus 5711 comp feed flagged 2 new undercuts", time: "12m" },
  { id: "n2", text: "AJ1 Chicago repick avg crossed above floor +14%", time: "1h" },
  { id: "n3", text: "Weekly comp crawl finished for 10 tracked models", time: "3h" },
];

export function TopBar({
  onOpenPalette,
  onOpenDrawer,
}: {
  onOpenPalette: () => void;
  onOpenDrawer: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenDrawer}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/5 lg:hidden ${FOCUS_RING}`}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Open navigation menu</span>
        </button>
        <div className="min-w-0">
          <p className="truncate text-[11px] uppercase tracking-wider text-zinc-400">Pricing Ops</p>
          <p className="truncate text-[13px] font-medium text-zinc-200">Comp Terminal</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onOpenPalette}
          className={`hidden h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-[12.5px] text-zinc-400 transition-colors hover:text-zinc-200 sm:flex ${FOCUS_RING}`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search comps
          <kbd className="ml-3 rounded border border-white/10 bg-zinc-800 px-1.5 py-0.5 text-[10.5px] text-zinc-400">⌘K</kbd>
        </button>
        <button
          onClick={onOpenPalette}
          className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 sm:hidden ${FOCUS_RING}`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Search comps</span>
        </button>

        <button
          aria-label="Add to watchlist"
          className={`flex h-11 items-center gap-1.5 rounded-lg bg-amber-400 px-3 text-[12.5px] font-semibold text-zinc-950 transition-opacity hover:opacity-90 ${FOCUS_RING}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Add to watchlist</span>
        </button>

        <Popover
          align="end"
          trigger={({ onClick, ref, open, id }) => (
            <button
              ref={ref}
              onClick={onClick}
              aria-expanded={open}
              aria-controls={id}
              className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 ${FOCUS_RING}`}
            >
              <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
              <span className="sr-only">Notifications, 3 unread</span>
            </button>
          )}
        >
          {() => (
            <div className="w-72">
              <p className="border-b border-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Notifications
              </p>
              <ul>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="border-b border-white/5 px-3 py-2.5 last:border-0">
                    <p className="text-[12.5px] text-zinc-200">{n.text}</p>
                    <p className="mt-0.5 text-[10.5px] tabular-nums text-zinc-400">{n.time} ago</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popover>

        <Popover
          align="end"
          trigger={({ onClick, ref, open, id }) => (
            <button
              ref={ref}
              onClick={onClick}
              aria-expanded={open}
              aria-controls={id}
              className={`flex h-11 items-center gap-1.5 rounded-lg pl-1 pr-2 hover:bg-white/5 ${FOCUS_RING}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-200">
                JA
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              <span className="sr-only">Account menu — Jordan Ames</span>
            </button>
          )}
        >
          {() => (
            <div>
              <div className="border-b border-white/10 px-3 py-2.5">
                <p className="text-[12.5px] font-medium text-zinc-100">Jordan Ames</p>
                <p className="text-[11px] text-zinc-400">Pricing Ops · {"jordan.ames@repick.internal"}</p>
              </div>
              <PopoverItem icon={<UserRound className="h-3.5 w-3.5" aria-hidden="true" />}>Profile</PopoverItem>
              <PopoverItem icon={<Settings className="h-3.5 w-3.5" aria-hidden="true" />}>Preferences</PopoverItem>
              <PopoverItem icon={<LogOut className="h-3.5 w-3.5" aria-hidden="true" />}>Sign out</PopoverItem>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}
