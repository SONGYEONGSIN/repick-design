"use client";

import { useState, type RefObject } from "react";
import { Menu, Search, Bell, Plus, ChevronDown } from "lucide-react";
import { Avatar, FOCUS_RING, PrimaryButton, IconButton } from "./ui";

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
  paletteTriggerRef,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
  paletteTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1760px] min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenMobileNav}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] lg:hidden ${FOCUS_RING}`}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* All topbar controls share a 44px (h-11) height, per the app-shell convention. */}
        <button
          ref={paletteTriggerRef}
          type="button"
          onClick={onOpenPalette}
          className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left text-sm text-zinc-400 transition-colors hover:bg-white/[0.06] motion-reduce:transition-none sm:max-w-sm ${FOCUS_RING}`}
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">Search doors, carriers, trailers…</span>
          <span className="hidden shrink-0 rounded border border-white/10 bg-zinc-900 px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 sm:inline">
            ⌘K
          </span>
        </button>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <PrimaryButton type="button">
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate">New booking</span>
            </PrimaryButton>
          </div>
          <IconButton aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
          </IconButton>
          <div className="relative shrink-0">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={avatarOpen}
              onClick={() => setAvatarOpen((v) => !v)}
              className={`flex h-11 min-w-0 items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-1.5 transition-colors hover:bg-white/[0.06] motion-reduce:transition-none ${FOCUS_RING}`}
            >
              <Avatar name="Mara Chen" photoId="1544005313-94ddf0286df2" size={28} />
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
            </button>
            {avatarOpen ? (
              <div
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 top-full z-20 mt-2 w-48 max-w-[calc(100vw-2rem)] min-w-0 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl"
              >
                {["Profile", "Notification settings", "Sign out"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setAvatarOpen(false)}
                    className={`flex h-9 w-full min-w-0 items-center rounded-md px-2 text-left text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-50 ${FOCUS_RING}`}
                  >
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
