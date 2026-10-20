"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bell, ChevronDown, Download, Menu, Search } from "lucide-react";
import { CURRENT_USER } from "./data";
import { FOCUS_RING, cn } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Q4 2026 revenue mix closed — APAC crossed $2.3M ARR.", timeLabel: "6m ago" },
  { id: "n2", text: "3 Enterprise renewals in EMEA are due this week.", timeLabel: "1h ago" },
  { id: "n3", text: "Monthly board export is ready to review.", timeLabel: "3h ago" },
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
        className={cn("relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50", FOCUS_RING)}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-teal-400" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          <p className="px-2.5 py-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">Notifications</p>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <button type="button" className={cn("flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left hover:bg-white/5", FOCUS_RING)}>
                  <span className="font-normal text-sm text-zinc-50">{n.text}</span>
                  <span className="font-normal text-xs text-zinc-400">{n.timeLabel}</span>
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
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={cn("flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-white/5", FOCUS_RING)}>
        <span className="sr-only">Account menu for {CURRENT_USER.name}, </span>
        <Image
          src={`https://images.unsplash.com/photo-${CURRENT_USER.avatarId}?w=60&h=60&fit=crop&crop=faces`}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full bg-zinc-800 object-cover"
        />
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          <button type="button" className={cn("w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5", FOCUS_RING)}>
            Profile
          </button>
          <button type="button" className={cn("w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5", FOCUS_RING)}>
            Settings
          </button>
          <button type="button" className={cn("w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5", FOCUS_RING)}>
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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-900 px-4">
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={onOpenMobileNav}
        className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden", FOCUS_RING)}
      >
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cn("flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 px-3 text-zinc-400 hover:bg-white/5 sm:max-w-xs", FOCUS_RING)}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate font-normal text-sm">Search regions, tiers…</span>
        <kbd aria-hidden="true" className="ml-auto hidden shrink-0 rounded border border-white/10 bg-zinc-950 px-1.5 py-0.5 font-normal text-[11px] text-zinc-400 lg:inline">
          ⌘K
        </kbd>
      </button>

      <div className="min-w-0 flex-1" />

      {/* The visible label is the only accessible name — wrapped in sr-only sm:not-sr-only
          rather than a divergent aria-label, so the DOM's name never mismatches what renders. */}
      <button
        type="button"
        onClick={onExport}
        className={cn("flex h-11 items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 font-medium text-sm text-zinc-50 motion-safe:transition-colors hover:bg-teal-700", FOCUS_RING)}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Export mix (CSV)</span>
      </button>

      <NotificationsMenu />
      <AccountMenu />
    </header>
  );
}
