"use client";

import { useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Plus, Search, User } from "lucide-react";
import { cx, useDismissable } from "./ui";

export default function Topbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  useDismissable(avatarOpen, () => setAvatarOpen(false), avatarRef);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={cx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
        )}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cx(
          "flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left text-zinc-400 sm:max-w-[320px]",
          "hover:border-white/20 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-[13px] font-normal">Search zones, depots, incidents…</span>
        <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10.5px] font-medium text-zinc-400 sm:inline-block">
          &#8984;K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={cx(
            "hidden h-11 items-center gap-2 rounded-lg bg-[#4da699] px-4 text-[13px] font-semibold text-zinc-950 transition-colors sm:flex",
            "hover:bg-[#8fcdc2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New incident report
        </button>

        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className={cx(
            "relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
          )}
        >
          <Bell className="h-4.5 w-4.5" aria-hidden="true" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden="true" />
        </button>

        <div ref={avatarRef} className="relative">
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={avatarOpen}
            aria-label="Account menu"
            className={cx(
              "flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-white/5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300">
              <User className="h-4 w-4" aria-hidden="true" />
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-400 sm:block" aria-hidden="true" />
          </button>
          {avatarOpen ? (
            <ul
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-[calc(100%+6px)] z-20 w-48 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg"
            >
              {["Account settings", "Team members", "Sign out"].map((item) => (
                <li key={item} role="none">
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => setAvatarOpen(false)}
                    className={cx(
                      "block w-full px-3 py-2 text-left text-[12.5px] font-normal text-zinc-400",
                      "hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6cc0b3]"
                    )}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </header>
  );
}
