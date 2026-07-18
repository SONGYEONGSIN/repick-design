"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Flag, LogOut, Menu, Search, Settings, UserCircle } from "lucide-react";
import { Avatar } from "./ui";
import { CURRENT_USER, NAV_NOTIFICATIONS, WORKSPACE } from "../lib/data";

/**
 * Global app-shell top bar. Every interactive control here — the ⌘K
 * trigger, the primary action button, and each icon button — is its own
 * h-11 (44px) target, not just the h-11 header container.
 */
export default function AppTopbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-3 sm:px-4">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 lg:hidden"
      >
        <Menu className="h-4.5 w-4.5" aria-hidden="true" />
      </button>

      <div className="hidden min-w-0 flex-col leading-tight sm:flex">
        <span className="truncate text-xs font-semibold text-zinc-900">{WORKSPACE.name}</span>
        <span className="truncate text-[11px] text-zinc-500">Sales performance</span>
      </div>

      <button
        type="button"
        onClick={onOpenPalette}
        className="ml-2 flex h-11 flex-1 max-w-md items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-500 outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden truncate sm:inline">Search reps, teams, deals…</span>
        <span className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-flex">
          ⌘K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white outline-none transition-colors motion-reduce:transition-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 sm:inline-flex"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          New contest
        </button>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label="Notifications"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          >
            <Bell className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
            >
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Notifications
              </p>
              {NAV_NOTIFICATIONS.map((n) => (
                <div key={n.id} role="menuitem" className="rounded-lg px-2 py-2 hover:bg-zinc-50">
                  <p className="text-xs text-zinc-800">{n.text}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{n.time}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative" ref={userRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={userOpen}
            aria-label="Account menu"
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          >
            <Avatar avatarId={CURRENT_USER.avatarId} name={CURRENT_USER.name} size={26} />
          </button>
          {userOpen ? (
            <div
              role="menu"
              aria-label="Account"
              className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
            >
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-zinc-900">{CURRENT_USER.name}</p>
                <p className="text-[11px] text-zinc-500">{CURRENT_USER.role}</p>
              </div>
              <div className="my-1 h-px bg-zinc-100" />
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <UserCircle className="h-3.5 w-3.5" aria-hidden="true" /> Profile
              </button>
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Settings className="h-3.5 w-3.5" aria-hidden="true" /> Settings
              </button>
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
