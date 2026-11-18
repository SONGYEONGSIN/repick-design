"use client";

import { useState, type RefObject } from "react";
import { Menu, Search, Bell, Plus, ChevronDown, AlertTriangle, CheckCircle2, Rocket } from "lucide-react";
import { FOCUS_RING, PrimaryButton, IconButton, InitialsAvatar } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", icon: AlertTriangle, text: "Rollback triggered on billing-v3-invoices", meta: "5 days ago" },
  { id: "n2", icon: Rocket, text: "ai-search-suggestions advanced to 18%", meta: "yesterday" },
  { id: "n3", icon: CheckCircle2, text: "dark-mode-rollout reached 100% of eligible users", meta: "1 week ago" },
];

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
  paletteTriggerRef,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
  paletteTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-16 w-full min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenMobileNav}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden ${FOCUS_RING}`}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* All topbar controls share a 44px (h-11) height, per the app-shell convention. */}
        <button
          ref={paletteTriggerRef}
          type="button"
          onClick={onOpenPalette}
          className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-100 motion-reduce:transition-none sm:max-w-sm ${FOCUS_RING}`}
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">Jump to a flag, segment or action…</span>
          <span className="hidden shrink-0 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline">
            ⌘K
          </span>
        </button>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <PrimaryButton type="button" onClick={onOpenPalette}>
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate">New flag</span>
            </PrimaryButton>
          </div>

          <div className="relative shrink-0">
            <IconButton aria-label="Notifications" aria-haspopup="menu" aria-expanded={notifOpen} onClick={() => setNotifOpen((v) => !v)}>
              <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconButton>
            {notifOpen ? (
              <div
                role="menu"
                aria-label="Recent rollout events"
                className="absolute right-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] min-w-0 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl"
              >
                {NOTIFICATIONS.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} role="menuitem" className="flex min-w-0 items-start gap-2.5 rounded-md px-2.5 py-2">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-zinc-900">{n.text}</span>
                        <span className="block text-xs text-zinc-500">{n.meta}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={avatarOpen}
              onClick={() => setAvatarOpen((v) => !v)}
              className={`flex h-11 min-w-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-1.5 transition-colors hover:bg-zinc-100 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              <InitialsAvatar initials="RT" size={28} />
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
            </button>
            {avatarOpen ? (
              <div
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 top-full z-20 mt-2 w-48 max-w-[calc(100vw-2rem)] min-w-0 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl"
              >
                {["Profile", "API keys", "Sign out"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setAvatarOpen(false)}
                    className={`flex h-9 w-full min-w-0 items-center rounded-md px-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
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
