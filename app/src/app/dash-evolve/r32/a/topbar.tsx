"use client";

import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";
import { FOCUS_RING, cx } from "./ui";

interface Props {
  onOpenPalette: () => void;
  onOpenDrawer: () => void;
}

export default function Topbar({ onOpenPalette, onOpenDrawer }: Props) {
  return (
    <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5 lg:px-6">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open menu"
        className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 lg:hidden", FOCUS_RING)}
      >
        <Menu aria-hidden className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cx(
          "flex h-11 w-full min-w-0 max-w-sm items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700",
          FOCUS_RING
        )}
      >
        <Search aria-hidden className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-[13px]">Search signals &amp; cases&hellip;</span>
        <kbd className="hidden shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-block">
          &#8984;K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={cx(
            "hidden h-11 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-[13px] font-medium text-white hover:bg-rose-700 sm:flex",
            FOCUS_RING
          )}
        >
          <Plus aria-hidden className="h-4 w-4" />
          New case
        </button>

        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className={cx("relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100", FOCUS_RING)}
        >
          <Bell aria-hidden className="h-4.5 w-4.5" />
          <span aria-hidden className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-600" />
        </button>

        <button
          type="button"
          aria-label="Account menu, Dana Mercer"
          className={cx("flex h-11 items-center gap-2 rounded-lg px-1.5 hover:bg-zinc-100 sm:px-2", FOCUS_RING)}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-700">
            DM
          </span>
          <ChevronDown aria-hidden className="hidden h-3.5 w-3.5 text-zinc-500 sm:block" />
        </button>
      </div>
    </header>
  );
}
