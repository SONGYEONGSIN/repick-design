"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, Search, Download, Bell, User, LogOut, Settings } from "lucide-react";
import { CURRENT_USER, NOTIFICATIONS } from "../lib/data";
import { FOCUS_RING } from "./ui";

export function Topbar({
  onOpenDrawer,
  onOpenPalette,
}: {
  onOpenDrawer: () => void;
  onOpenPalette: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center gap-2 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenDrawer}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden ${FOCUS_RING}`}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-zinc-500 hover:border-zinc-300 sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only truncate text-sm sm:not-sr-only sm:inline">Search or jump to…</span>
        <kbd className="ml-auto sr-only shrink-0 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] text-zinc-500 sm:not-sr-only sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPalette}
          className={`inline-flex h-11 items-center gap-1.5 rounded-lg bg-lime-600 px-3.5 text-sm font-medium text-zinc-950 hover:bg-lime-700 ${FOCUS_RING}`}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Export Scorecard</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setAvatarOpen(false);
            }}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime-600" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close notifications"
                onClick={() => setNotifOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div
                role="menu"
                aria-label="Notifications"
                className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl"
              >
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  Notifications
                </p>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} role="menuitem" className="px-3 py-2 text-xs text-zinc-600">
                    <p className="leading-snug text-zinc-900">{n.title}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">{n.time}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAvatarOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-haspopup="true"
            aria-expanded={avatarOpen}
            aria-label="Account menu"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${FOCUS_RING}`}
          >
            <Image
              src={`https://images.unsplash.com/photo-${CURRENT_USER.photoId}?q=80&w=64&h=64&fit=crop&crop=faces`}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
          </button>
          {avatarOpen ? (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close account menu"
                onClick={() => setAvatarOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div
                role="menu"
                aria-label="Account"
                className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl"
              >
                <p className="truncate px-3 py-1.5 text-xs font-medium text-zinc-900">{CURRENT_USER.name}</p>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setAvatarOpen(false)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-600 hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <User className="h-3.5 w-3.5" aria-hidden="true" /> Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setAvatarOpen(false)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-600 hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <Settings className="h-3.5 w-3.5" aria-hidden="true" /> Workspace Settings
                </button>
                <div className="my-1 border-t border-zinc-200" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setAvatarOpen(false)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
