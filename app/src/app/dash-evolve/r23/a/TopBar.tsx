"use client";

import Image from "next/image";
import { Menu, Search, Plus, Bell, Command } from "lucide-react";
import { CURRENT_AGENT } from "./data";
import { Popover, PopoverItem, FOCUS_LIGHT, cx } from "./ui";

export function TopBar({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button type="button" onClick={onMenu} aria-label="Open navigation" className={cx("flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden", FOCUS_LIGHT)}>
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onSearch}
        className={cx(
          "flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-zinc-500 hover:border-zinc-300 hover:bg-white sm:max-w-sm",
          FOCUS_LIGHT,
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-[13px]">Search cases, buyers, sellers…</span>
        <span className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline-flex">
          <Command className="h-3 w-3" />K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={cx(
            "hidden h-11 items-center gap-1.5 rounded-lg bg-amber-700 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-amber-800 motion-reduce:transition-none sm:inline-flex",
            FOCUS_LIGHT,
          )}
        >
          <Plus className="h-4 w-4" />
          Log dispute
        </button>

        <button type="button" aria-label="Notifications, 3 unread" className={cx("relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100", FOCUS_LIGHT)}>
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
        </button>

        <Popover
          align="right"
          trigger={({ toggle, buttonProps }) => (
            <button type="button" onClick={toggle} {...buttonProps} aria-label="Account menu" className={cx("flex h-11 w-11 items-center justify-center rounded-lg hover:bg-zinc-100", FOCUS_LIGHT)}>
              <span className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src={`https://images.unsplash.com/photo-${CURRENT_AGENT.avatarId}?w=64&h=64&fit=crop&crop=faces`} alt="" fill sizes="32px" className="object-cover" />
              </span>
            </button>
          )}
        >
          <div className="px-2.5 py-1.5">
            <p className="truncate text-[13px] font-medium text-zinc-900">{CURRENT_AGENT.name}</p>
            <p className="truncate text-[11px] text-zinc-500">Senior Trust Analyst</p>
          </div>
          <div className="my-1 h-px bg-zinc-200" />
          <PopoverItem>Profile settings</PopoverItem>
          <PopoverItem>Keyboard shortcuts</PopoverItem>
          <PopoverItem>Sign out</PopoverItem>
        </Popover>
      </div>
    </header>
  );
}
