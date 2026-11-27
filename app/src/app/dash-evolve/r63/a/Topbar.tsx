"use client";

import { useState, type RefObject } from "react";
import { Menu, Search, Bell, Plus, ChevronDown, CircleDollarSign } from "lucide-react";
import { PhotoAvatar, FOCUS_RING, PrimaryButton, IconButton, NUM } from "./ui";
import { getPendingBookings, usdFmt } from "./data";

const PENDING = getPendingBookings();

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const count = PENDING.length;

  return (
    <div className="relative shrink-0">
      <IconButton
        aria-label={count > 0 ? `Notifications, ${count} deposit${count === 1 ? "" : "s"} pending` : "Notifications"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {count > 0 ? (
          <span
            aria-hidden="true"
            className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-700 px-1 text-[10px] font-medium text-white ${NUM}`}
          >
            {count}
          </span>
        ) : null}
      </IconButton>
      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] min-w-0 rounded-lg border border-zinc-200 bg-white shadow-xl">
          <div className="border-b border-zinc-100 px-3 py-2.5">
            <p className="text-sm font-semibold text-zinc-900">Notifications</p>
            <p className="text-xs text-zinc-500">{count} booking{count === 1 ? "" : "s"} waiting on a deposit</p>
          </div>
          <ul className="max-h-72 min-w-0 overflow-y-auto p-1">
            {PENDING.map((bk) => (
              <li key={bk.id} className="flex min-w-0 items-start gap-2 rounded-md px-2.5 py-2">
                <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-900">{bk.eventName}</span>
                  <span className={`block truncate text-xs text-zinc-500 ${NUM}`}>Nov {bk.day} · {usdFmt.format(bk.revenue)} due</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
  onOpenNewBooking,
  paletteTriggerRef,
  newBookingTriggerRef,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
  onOpenNewBooking: () => void;
  paletteTriggerRef: RefObject<HTMLButtonElement | null>;
  newBookingTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1760px] min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
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
          <span className="min-w-0 flex-1 truncate">Search bookings, rooms, clients…</span>
          <span className="hidden shrink-0 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline">
            ⌘K
          </span>
        </button>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <PrimaryButton ref={newBookingTriggerRef} type="button" onClick={onOpenNewBooking}>
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate">New booking</span>
            </PrimaryButton>
          </div>
          <NotificationsMenu />
          <div className="relative shrink-0">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={avatarOpen}
              onClick={() => setAvatarOpen((v) => !v)}
              className={`flex h-11 min-w-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-1.5 transition-colors hover:bg-zinc-100 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              <PhotoAvatar name="Rosa Lin" photoId="1544005313-94ddf0286df2" size={28} />
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
            </button>
            {avatarOpen ? (
              <div
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 top-full z-20 mt-2 w-48 max-w-[calc(100vw-2rem)] min-w-0 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl"
              >
                {["Profile", "Notification settings", "Sign out"].map((label) => (
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
