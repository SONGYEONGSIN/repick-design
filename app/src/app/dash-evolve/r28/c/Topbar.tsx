"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";
import { FOCUS_RING } from "./data";

interface TopbarProps {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
}

const NOTIFICATIONS = [
  { id: "n1", title: "Permit renewal cleared", body: "Harbor Point Terminal audit can resume.", time: "12m ago" },
  { id: "n2", title: "Crew Cinder assigned", body: "Silverline Micro-Fulfillment install staffed.", time: "1h ago" },
  { id: "n3", title: "Inspection rework due", body: "Northgate Depot needs a fire-suppression fix by Fri.", time: "3h ago" },
];

export default function Topbar({ onOpenMobileNav, onOpenPalette }: TopbarProps) {
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className={`rounded-md p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open navigation</span>
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 flex-1 max-w-md items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left text-sm text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-300 ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only truncate sm:not-sr-only">Search jobs, crews, sites&hellip;</span>
        <span className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:flex">
          <kbd className="font-sans">&#8984;K</kbd>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={`flex h-11 items-center gap-1.5 rounded-lg bg-cyan-500 px-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-cyan-400 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">New job</span>
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
            className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            <span className="sr-only">Notifications, 3 unread</span>
          </button>
          {notifOpen && (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40"
            >
              <div className="border-b border-white/10 px-4 py-3 text-sm font-medium text-zinc-50">Notifications</div>
              <ul className="max-h-72 divide-y divide-white/5 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-4 py-3 hover:bg-white/5">
                    <p className="text-sm font-medium text-zinc-50">{n.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">{n.body}</p>
                    <p className="mt-1 text-[11px] text-zinc-400">{n.time}</p>
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
            className={`flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-white/5 ${FOCUS_RING}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-medium text-cyan-300">
              JR
            </span>
            <ChevronDown className="hidden h-4 w-4 text-zinc-400 sm:block" aria-hidden="true" />
            <span className="sr-only">Account menu</span>
          </button>
          {avatarOpen && (
            <div
              role="menu"
              aria-label="Account"
              className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/40"
            >
              <button type="button" role="menuitem" className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/5">
                Profile
              </button>
              <button type="button" role="menuitem" className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/5">
                Workspace settings
              </button>
              <div className="my-1 border-t border-white/10" />
              <button type="button" role="menuitem" className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-white/5">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
