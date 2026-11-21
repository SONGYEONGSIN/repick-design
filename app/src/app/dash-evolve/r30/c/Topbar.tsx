"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Download, Menu, Search } from "lucide-react";
import { FOCUS_RING } from "./data";

interface TopbarProps {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  onExport: () => void;
}

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "fraud-service crossed the critical threshold",
    body: "Error rate rose past 4% and p99 latency hit 410ms.",
    time: "14m ago",
  },
  {
    id: "n2",
    title: "Weekly topology review ready",
    body: "3 services moved out of Degraded since last Tuesday.",
    time: "3h ago",
  },
  {
    id: "n3",
    title: "primary-db connection pool at 79%",
    body: "Approaching the configured saturation ceiling of 85%.",
    time: "1d ago",
  },
];

export default function Topbar({ onOpenMobileNav, onOpenPalette, onExport }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen && !avatarOpen) return;
    function handlePointer(e: MouseEvent) {
      const target = e.target as Node;
      if (notifRef.current?.contains(target) || avatarRef.current?.contains(target)) return;
      setNotifOpen(false);
      setAvatarOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [notifOpen, avatarOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden ${FOCUS_RING}`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only font-normal">Open navigation</span>
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 max-w-md flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm font-normal text-zinc-600 hover:bg-zinc-100 hover:text-zinc-700 ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only truncate font-normal sm:not-sr-only">Search services…</span>
        <span className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-normal text-zinc-500 sm:flex">
          <kbd className="font-sans font-normal">&#8984;K</kbd>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className={`flex h-11 items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-rose-500 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only font-medium sm:not-sr-only">Export snapshot</span>
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setAvatarOpen(false);
            }}
            aria-expanded={notifOpen}
            aria-haspopup="true"
            className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            <span className="sr-only font-normal">Notifications, 3 unread</span>
          </button>
          {notifOpen && (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 z-40 mt-2 w-80 max-w-[88vw] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10"
            >
              <div className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900">Notifications</div>
              <ul className="max-h-72 divide-y divide-zinc-100 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-4 py-3 hover:bg-zinc-50">
                    <p className="text-sm font-medium text-zinc-900">{n.title}</p>
                    <p className="mt-0.5 text-xs font-normal text-zinc-500">{n.body}</p>
                    <p className="mt-1 text-[11px] font-normal text-zinc-500">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div ref={avatarRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setAvatarOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-expanded={avatarOpen}
            aria-haspopup="true"
            className={`flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-xs font-medium text-rose-700">
              DO
            </span>
            <ChevronDown className="hidden h-4 w-4 text-zinc-500 sm:block" aria-hidden="true" />
            <span className="sr-only font-normal">Account menu</span>
          </button>
          {avatarOpen && (
            <div
              role="menu"
              aria-label="Account"
              className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl shadow-zinc-900/10"
            >
              <button type="button" role="menuitem" className="block w-full px-4 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50">
                Profile
              </button>
              <button type="button" role="menuitem" className="block w-full px-4 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50">
                Workspace settings
              </button>
              <div className="my-1 border-t border-zinc-200" />
              <button type="button" role="menuitem" className="block w-full px-4 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
