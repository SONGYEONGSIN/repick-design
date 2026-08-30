"use client";

import Image from "next/image";
import { Bell, LogOut, Menu, Plus, Search, User } from "lucide-react";
import { FOCUS_RING, useDismissablePopover } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", title: "Weekly digest ready", body: "Revenue by channel, last 7 days.", time: "2h ago" },
  { id: "n2", title: "Churn rate crossed 3.4%", body: "Enterprise plan tier, last 30 days.", time: "1d ago" },
];

export function Topbar({
  onOpenMobileNav,
  onOpenPalette,
  onNewQuestion,
}: {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  onNewQuestion: () => void;
}) {
  const notifications = useDismissablePopover<HTMLDivElement>();
  const account = useDismissablePopover<HTMLDivElement>();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-white/10 bg-zinc-950/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/[0.06] lg:hidden ${FOCUS_RING}`}
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left text-zinc-400 hover:border-white/20 sm:max-w-sm ${FOCUS_RING}`}
      >
        <Search size={16} className="shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[13px] font-normal">Search or jump to…</span>
        <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:block">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onNewQuestion}
          className={`hidden h-11 items-center gap-1.5 rounded-lg bg-[#1f5fc4] px-3.5 text-[13px] font-medium text-white hover:bg-[#184a92] sm:flex ${FOCUS_RING}`}
        >
          <Plus size={16} aria-hidden="true" />
          New question
        </button>
        <button
          type="button"
          onClick={onNewQuestion}
          aria-label="New question"
          className={`flex h-11 w-11 items-center justify-center rounded-lg bg-[#1f5fc4] text-white hover:bg-[#184a92] sm:hidden ${FOCUS_RING}`}
        >
          <Plus size={18} aria-hidden="true" />
        </button>

        <div ref={notifications.ref} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={notifications.open}
            aria-label="Notifications, 2 unread"
            onClick={() => notifications.setOpen((o) => !o)}
            className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/[0.06] ${FOCUS_RING}`}
          >
            <Bell size={18} aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#5b9bec]" aria-hidden="true" />
          </button>
          {notifications.open && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-72 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/40">
              <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Notifications</p>
              <ul>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-3 py-2 hover:bg-white/5">
                    <p className="text-[13px] font-medium text-zinc-50">{n.title}</p>
                    <p className="mt-0.5 text-xs font-normal text-zinc-400">{n.body}</p>
                    <p className="mt-0.5 text-[11px] font-normal text-zinc-400">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div ref={account.ref} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={account.open}
            aria-label="Account menu"
            onClick={() => account.setOpen((o) => !o)}
            className={`flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/[0.06] ${FOCUS_RING}`}
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full bg-zinc-800">
              <Image
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
                alt=""
                fill
                sizes="28px"
                className="object-cover"
              />
            </span>
          </button>
          {account.open && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-48 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/40">
              {/* Header text sits outside the role="menu" container — a menu's
                  required children are menuitems only, not arbitrary text. */}
              <p className="px-3 py-1.5 text-[13px] font-medium text-zinc-100">Priya Raman</p>
              <p className="px-3 pb-1.5 text-xs font-normal text-zinc-400">priya@northwind.io</p>
              <div className="my-1 border-t border-white/10" />
              <div role="menu" aria-label="Account actions">
                <button role="menuitem" type="button" onClick={() => account.setOpen(false)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
                  <User size={14} aria-hidden="true" />
                  My account
                </button>
                <button role="menuitem" type="button" onClick={() => account.setOpen(false)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
                  <LogOut size={14} aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
