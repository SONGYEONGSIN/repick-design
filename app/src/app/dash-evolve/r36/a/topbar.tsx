"use client";

import { forwardRef, useState } from "react";
import { Menu, Search, Bell, Plus, ChevronDown } from "lucide-react";
import { IconButton, PrimaryButton, InitialsAvatar } from "./ui";

export const SearchTrigger = forwardRef<HTMLButtonElement, { onClick: () => void }>(function SearchTrigger(
  { onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="flex h-11 w-full max-w-sm items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-600 outline-offset-2 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-violet-700"
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">Jump to a goal…</span>
      <kbd className="shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-600">
        ⌘K
      </kbd>
    </button>
  );
});

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="MB — Account menu"
        className="flex h-11 items-center gap-1.5 rounded-lg px-1.5 outline-offset-2 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-violet-700"
      >
        <InitialsAvatar initials="MB" className="h-8 w-8 text-[11px]" />
        <ChevronDown className="h-4 w-4 text-zinc-500" aria-hidden="true" />
      </button>
      {open && (
        <>
          <div aria-hidden="true" className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul
            role="menu"
            aria-label="Account"
            className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
          >
            <li role="none">
              <button
                role="menuitem"
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full px-3 py-2 text-left text-sm text-zinc-700 outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-violet-700"
              >
                Profile settings
              </button>
            </li>
            <li role="none">
              <button
                role="menuitem"
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full px-3 py-2 text-left text-sm text-zinc-700 outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-violet-700"
              >
                Sign out
              </button>
            </li>
          </ul>
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
  searchTriggerRef: React.Ref<HTMLButtonElement>;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <IconButton label="Open navigation" onClick={onOpenMobileNav} className="md:hidden">
        <Menu className="h-5 w-5" aria-hidden="true" />
      </IconButton>

      <div className="min-w-0 flex-1">
        <SearchTrigger ref={searchTriggerRef} onClick={onOpenPalette} />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <PrimaryButton className="max-sm:hidden">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New goal
        </PrimaryButton>
        <IconButton label="Notifications, 2 unread" className="relative">
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-700 text-[8px] font-medium leading-none text-white"
          >
            2
          </span>
        </IconButton>
        <AvatarMenu />
      </div>
    </header>
  );
}
