"use client";

import { useState } from "react";
import { Menu, Search, Plus, Bell } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export function Topbar({
  onOpenPalette,
  onOpenNewRelease,
  onOpenDrawer,
  pendingCount,
  criticalCount,
}: {
  onOpenPalette: () => void;
  onOpenNewRelease: () => void;
  onOpenDrawer: () => void;
  pendingCount: number;
  criticalCount: number;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="flex h-11 flex-shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open navigation menu"
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 sm:hidden ${FOCUS_RING}`}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onOpenPalette}
          className={`flex h-8 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-normal text-zinc-600 hover:bg-zinc-50 ${FOCUS_RING}`}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Search releases…</span>
          <span className="rounded border border-zinc-200 px-1 text-[10px] font-medium text-zinc-500">⌘K</span>
        </button>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenNewRelease}
          className={`flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-medium text-white transition-colors duration-150 ease-out hover:bg-blue-700 ${FOCUS_RING}`}
        >
          <Plus className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">New release request</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {criticalCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 z-20 w-64 rounded-lg border border-zinc-200 bg-white p-3 text-xs font-normal text-zinc-600 shadow-lg">
              <p className="font-medium text-zinc-900">Approvals waiting</p>
              <p className="mt-1 tabular-nums">
                {pendingCount} release{pendingCount === 1 ? "" : "s"} pending review, {criticalCount} at Critical tier.
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-expanded={avatarOpen}
            aria-label="Account menu"
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600 ${FOCUS_RING}`}
          >
            YS
          </button>
          {avatarOpen && (
            <div className="absolute right-0 top-9 z-20 w-40 rounded-lg border border-zinc-200 bg-white p-1 text-xs font-normal shadow-lg">
              <button
                type="button"
                onClick={() => setAvatarOpen(false)}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => setAvatarOpen(false)}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
