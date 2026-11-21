"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";
import type { RevenueAlert } from "./data";
import { CHANNEL_BY_ID, CURRENT_USER, SYSTEM_NOTIFICATIONS } from "./data";
import { FOCUS_RING } from "./ui";
import { formatPctSigned } from "./format";

function NotificationsMenu({ alerts }: { alerts: RevenueAlert[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const unread = SYSTEM_NOTIFICATIONS.length + alerts.length;

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
        aria-label={`Notifications, ${unread} unread`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
      >
        <Bell className="h-4.5 w-4.5" aria-hidden="true" />
        <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-violet-400" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-30 w-80 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          <p className="px-2.5 py-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">System</p>
          <ul>
            {SYSTEM_NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <p className="rounded-lg px-2.5 py-2 font-normal text-sm text-zinc-300">{n.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-1 px-2.5 py-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
            Your alerts {alerts.length > 0 ? `(${alerts.length})` : ""}
          </p>
          {alerts.length === 0 ? (
            <p className="rounded-lg px-2.5 py-2 font-normal text-sm text-zinc-400">No custom alerts yet. Use &ldquo;New alert&rdquo; to create one.</p>
          ) : (
            <ul>
              {alerts.map((a) => (
                <li key={a.id} className="rounded-lg px-2.5 py-2">
                  <p className="font-normal text-sm text-zinc-300">
                    {CHANNEL_BY_ID[a.channelId].name} — notify when {a.direction} {formatPctSigned(a.direction === "below" ? -a.thresholdPct : a.thresholdPct)}
                  </p>
                </li>
              ))}
            </ul>
          )}
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
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={`flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-white/5 ${FOCUS_RING}`}>
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
          <button type="button" className={`w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
            Profile
          </button>
          <button type="button" className={`w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
            Settings
          </button>
          <button type="button" className={`w-full rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Topbar({
  alerts,
  onOpenMobileNav,
  onOpenPalette,
  onOpenAlertDrawer,
}: {
  alerts: RevenueAlert[];
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  onOpenAlertDrawer: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-900 px-4">
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={onOpenMobileNav}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
      >
        <Menu className="h-4.5 w-4.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 px-3 text-zinc-400 hover:bg-white/5 sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate font-normal text-sm">Search channels</span>
        <kbd aria-hidden="true" className="ml-auto hidden shrink-0 rounded border border-white/10 bg-zinc-950 px-1.5 py-0.5 font-normal text-[11px] text-zinc-400 lg:inline">
          &#8984;K
        </kbd>
      </button>

      <div className="min-w-0 flex-1" />

      {/* The visible label is the only accessible name here (sr-only sm:not-sr-only),
          never a custom aria-label, so the DOM's accessible name and its visible text
          can never mismatch at any breakpoint. */}
      <button
        type="button"
        onClick={onOpenAlertDrawer}
        className={`flex h-11 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 font-medium text-sm text-zinc-50 motion-safe:transition-colors hover:bg-violet-700 ${FOCUS_RING}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">New alert</span>
      </button>

      <NotificationsMenu alerts={alerts} />
      <AccountMenu />
    </header>
  );
}
