"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Download, Menu, Search } from "lucide-react";
import { Avatar, FOCUS_RING } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Paid conversion rate crossed 54% for the first time this quarter.", timeLabel: "Oct 17" },
  { id: "n2", text: "Lumen Robotics upgraded to the Scale plan.", timeLabel: "Oct 16" },
  { id: "n3", text: "Weekly lifecycle digest is ready to review.", timeLabel: "Oct 13" },
];

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="Notifications, 3 unread"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        <Bell className="h-4.5 w-4.5" aria-hidden="true" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-700" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
          <p className="px-2.5 py-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Notifications</p>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <button type="button" className={`flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left hover:bg-zinc-50 ${FOCUS_RING}`}>
                  <span className="font-normal text-sm text-zinc-900">{n.text}</span>
                  <span className="font-normal text-xs text-zinc-500">{n.timeLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        <span className="sr-only">Account menu for Dana Okafor, </span>
        <Avatar name="Dana Okafor" />
        <ChevronDown className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
          <button type="button" className={`w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
            Profile
          </button>
          <button type="button" className={`w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
            Workspace settings
          </button>
          <button type="button" className={`w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Topbar({
  onOpenMobileNav,
  onOpenPalette,
  onExport,
}: {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  onExport: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-4">
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={onOpenMobileNav}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 lg:hidden ${FOCUS_RING}`}
      >
        <Menu className="h-4.5 w-4.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-zinc-500 hover:bg-zinc-50 sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate font-normal text-sm">Search channels, accounts…</span>
        <kbd
          aria-hidden="true"
          className="ml-auto hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-normal text-[11px] text-zinc-500 lg:inline"
        >
          ⌘K
        </kbd>
      </button>

      <div className="min-w-0 flex-1" />

      {/* The visible label is the only accessible name — `sr-only sm:not-sr-only`, never a
          competing `aria-label`, so nothing can mismatch once the label appears at `sm:`. */}
      <button
        type="button"
        onClick={onExport}
        className={`flex h-11 items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 font-medium text-sm text-white motion-safe:transition-colors hover:bg-blue-800 ${FOCUS_RING}`}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Export CSV</span>
      </button>

      <NotificationsMenu />
      <AccountMenu />
    </header>
  );
}
