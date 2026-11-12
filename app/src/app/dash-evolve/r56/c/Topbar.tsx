"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search, Bell, Menu, AlertTriangle, LogOut, Settings } from "lucide-react";
import { FOCUS_RING } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "notification-queue — full outage, on-call paged", time: "4m ago" },
  { id: "n2", text: "payments-service — p99 latency 4.8x baseline", time: "22m ago" },
  { id: "n3", text: "search-cluster — disk pressure on 2 shards", time: "51m ago" },
];

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
  onViewTopRisk,
  topRiskLabel,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
  onViewTopRisk: () => void;
  topRiskLabel: string | null;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={`inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 xl:hidden ${FOCUS_RING}`}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-zinc-500 transition-colors hover:border-zinc-300 sm:max-w-sm ${FOCUS_RING}`}
      >
        <Search size={16} aria-hidden="true" />
        <span className="flex-1 truncate text-sm">Search services…</span>
        <kbd className="hidden flex-shrink-0 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline">
          {"⌘K"}
        </kbd>
      </button>

      <div className="ml-auto flex flex-shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onViewTopRisk}
          disabled={!topRiskLabel}
          title={topRiskLabel ? `Jump to ${topRiskLabel}` : "No services at risk"}
          className={`hidden h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:inline-flex ${FOCUS_RING}`}
        >
          <AlertTriangle size={16} aria-hidden="true" />
          View top risk
        </button>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <Bell size={18} aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 top-[calc(100%+6px)] z-20 w-72 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
            >
              {NOTIFICATIONS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  role="menuitem"
                  onClick={() => setNotifOpen(false)}
                  className={`block w-full rounded-md px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <p className="text-zinc-800">{n.text}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{n.time}</p>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative" ref={avatarRef}>
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={avatarOpen}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white ${FOCUS_RING}`}
          >
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80"
              alt="Priya Varma avatar"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
          </button>
          {avatarOpen ? (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-[calc(100%+6px)] z-20 w-48 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setAvatarOpen(false)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <Settings size={14} aria-hidden="true" /> Account settings
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setAvatarOpen(false)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <LogOut size={14} aria-hidden="true" /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
