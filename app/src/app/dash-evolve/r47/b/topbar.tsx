"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Plus, Search, Settings } from "lucide-react";
import { FOCUS_RING, Avatar } from "./ui";
import { CURRENT_USER } from "./data";
import { SignOutRow } from "./sidebar";

const NOTIFICATIONS = [
  { id: "n1", text: "Checkout Service × SA East crossed 4% error rate.", timeLabel: "6m ago" },
  { id: "n2", text: "Billing API webhook retries exhausted in SA East.", timeLabel: "41m ago" },
  { id: "n3", text: "Weekly reliability digest for Keelwatch Core is ready.", timeLabel: "3h ago" },
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
        className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          <p className="px-2.5 py-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">Notifications</p>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <button type="button" className={`flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left hover:bg-white/5 ${FOCUS_RING}`}>
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
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-white/5 ${FOCUS_RING}`}
      >
        <span className="sr-only">Account menu for {CURRENT_USER.name}, </span>
        <Avatar name={CURRENT_USER.name} avatarId={CURRENT_USER.avatarId} size={28} />
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}>
            Profile
          </button>
          <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}>
            <Settings className="h-4 w-4" aria-hidden="true" />
            Workspace settings
          </button>
          <SignOutRow />
        </div>
      ) : null}
    </div>
  );
}

export function Topbar({
  onOpenMobileNav,
  onOpenPalette,
  onDeclareIncident,
}: {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  onDeclareIncident: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-950 px-4">
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={onOpenMobileNav}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 px-3 text-zinc-400 hover:bg-white/5 sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate font-normal text-sm">Search services, incidents…</span>
        <kbd aria-hidden="true" className="ml-auto hidden shrink-0 rounded border border-white/10 bg-zinc-900 px-1.5 py-0.5 font-normal text-[11px] text-zinc-400 lg:inline">
          ⌘K
        </kbd>
      </button>

      <div className="min-w-0 flex-1" />

      {/* The visible label is the only accessible name — `sr-only sm:not-sr-only`, never a
          competing `aria-label`, so nothing can mismatch once the label appears at `sm:`. */}
      <button
        type="button"
        onClick={onDeclareIncident}
        className={`flex h-11 items-center gap-1.5 rounded-lg bg-rose-700 px-3.5 font-medium text-sm text-white motion-safe:transition-colors hover:bg-rose-600 ${FOCUS_RING}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Declare incident</span>
      </button>

      <NotificationsMenu />
      <AccountMenu />
    </header>
  );
}
