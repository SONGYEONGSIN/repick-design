"use client";

import { useState } from "react";
import { Bell, Menu, Plus, Search, Settings, LogOut } from "lucide-react";
import { FOCUS_RING_CLASS, IconButton, Popover, PopoverItem } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Integration Tests exceeded its SLA budget 4 times this week." },
  { id: "n2", text: "Deploy Production rollout to the EU fleet completed." },
];

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full min-w-0 items-center gap-3 border-b border-white/10 bg-zinc-950/80 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        className={`${FOCUS_RING_CLASS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-50 lg:hidden`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`${FOCUS_RING_CLASS} flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 text-left text-sm font-normal text-zinc-400 hover:text-zinc-50 sm:max-w-sm`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Search pipelines, builds, stages&hellip;</span>
        <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] font-normal text-zinc-400 sm:inline">
          &#8984;K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={`${FOCUS_RING_CLASS} hidden h-11 items-center gap-1.5 rounded-xl bg-violet-400 px-4 text-sm font-semibold text-zinc-950 hover:bg-violet-300 sm:flex`}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          New Pipeline
        </button>

        <div className="relative">
          <IconButton label="Notifications" onClick={() => setNotifOpen((v) => !v)} active={notifOpen}>
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
          </IconButton>
          <Popover open={notifOpen} onClose={() => setNotifOpen(false)} anchorLabel="Notifications" widthClass="w-80" role="region">
            <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
              Recent alerts
            </div>
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className="rounded-lg px-3 py-2 text-sm font-normal text-zinc-50">
                {n.text}
              </div>
            ))}
          </Popover>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setUserOpen((v) => !v)}
            aria-expanded={userOpen}
            className={`${FOCUS_RING_CLASS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-zinc-50 hover:border-violet-400/30`}
          >
            {/* No separate aria-label: the accessible name is this visible content (initials plus
               a visually-hidden label), so it can never drift from what's on screen. */}
            RM<span className="sr-only"> account menu</span>
          </button>
          <Popover open={userOpen} onClose={() => setUserOpen(false)} anchorLabel="Account menu" widthClass="w-56">
            <PopoverItem icon={<Settings className="h-4 w-4 shrink-0" aria-hidden="true" />}>
              Account settings
            </PopoverItem>
            <PopoverItem icon={<LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />}>Sign out</PopoverItem>
          </Popover>
        </div>
      </div>
    </header>
  );
}
