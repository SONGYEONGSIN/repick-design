"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Command, Download, Menu, Search } from "lucide-react";
import { Avatar, FOCUS_RING, IconButton, PrimaryButton } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Vertex Robotics health score dropped below 35.", time: "2h ago" },
  { id: "n2", text: "Harpoon Analytics renewal task is now blocked.", time: "5h ago" },
  { id: "n3", text: "Lumen Biosciences signed their renewal order form.", time: "1d ago" },
];

function useClickAway(onAway: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handle(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onAway();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onAway]);
  return ref;
}

export function Topbar({
  onOpenPalette,
  onExportCsv,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onExportCsv: () => void;
  onOpenMobileNav: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useClickAway(() => setNotifOpen(false));
  const userRef = useClickAway(() => setUserOpen(false));

  return (
    <header className="sticky top-0 z-30 flex min-w-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2 lg:px-8">
      <IconButton className="lg:hidden" aria-label="Open navigation" onClick={onOpenMobileNav}>
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
      </IconButton>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 max-w-sm items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-500 transition-colors duration-150 hover:bg-zinc-100 ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Search accounts, tasks…</span>
        <span className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline-flex">
          <Command className="h-3 w-3" aria-hidden="true" />K
        </span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/*
          The visibility toggle lives on these wrapper spans, not on PrimaryButton's own
          className: PrimaryButton's base class already hardcodes `inline-flex`
          unconditionally, and layering a caller-supplied `hidden`/`sm:hidden` directly onto
          the same element loses to that hardcoded display utility at this Tailwind build's
          layer order -- both buttons rendered simultaneously at 390px (measured: both at
          display:flex, 44px icon-only button pushing the desktop text button 34px past the
          viewport edge). A wrapper element with no competing display utility of its own
          resolves the visibility correctly instead.
        */}
        <span className="hidden sm:inline-flex">
          <PrimaryButton onClick={onExportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export ranking
          </PrimaryButton>
        </span>
        <span className="sm:hidden">
          <PrimaryButton onClick={onExportCsv} aria-label="Export ranking">
            <Download className="h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
        </span>

        <div className="relative" ref={notifRef}>
          <IconButton
            aria-label="Notifications"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((v) => !v)}
            className="relative"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
          </IconButton>
          {notifOpen && (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-sm"
            >
              <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Notifications
              </p>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                  <p>{n.text}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={userOpen}
            aria-label="Account menu"
            onClick={() => setUserOpen((v) => !v)}
            className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <Avatar initials="JE" size="md" />
          </button>
          {userOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-sm"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserOpen(false)}
                className={`flex w-full items-center px-3 py-2 text-left text-sm text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserOpen(false)}
                className={`flex w-full items-center px-3 py-2 text-left text-sm text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 ${FOCUS_RING}`}
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
