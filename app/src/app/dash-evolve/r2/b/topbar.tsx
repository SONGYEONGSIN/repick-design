"use client";

import { Bell, Command, Menu, Plus, Search } from "lucide-react";
import { Avatar } from "./ui";

export function Topbar({
  onOpenMobileSidebar,
  onOpenCommandPalette,
}: {
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-zinc-950/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        aria-label="메뉴 열기"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 text-left text-zinc-500 transition-colors hover:border-white/20 hover:text-zinc-400 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none sm:max-w-sm"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[13px]">티켓·에이전트·명령 검색</span>
        <span className="hidden shrink-0 items-center gap-0.5 rounded border border-white/10 bg-zinc-950 px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline-flex">
          <Command className="h-3 w-3" aria-hidden="true" />K
        </span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 text-[13px] font-semibold text-zinc-950 transition-colors hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none sm:inline-flex"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          새 티켓
        </button>
        <button
          type="button"
          aria-label="알림, 읽지 않음 3건"
          className="relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span
            className="absolute top-2.5 right-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white"
            aria-hidden="true"
          >
            3
          </span>
        </button>
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-lg px-1.5 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <Avatar name="최지우" size={30} />
        </button>
      </div>
    </header>
  );
}
