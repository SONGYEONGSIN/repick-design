"use client";

import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { CURRENT_USER } from "./data";

interface TopBarProps {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}

function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Kestrel Supply Partners renewed sustainability certification",
    time: "2h ago",
  },
  {
    id: "n2",
    title: "Atlas Fabrication Group flagged for lead-time variance",
    time: "Yesterday",
  },
];

export default function TopBar({ onOpenPalette, onOpenMobileNav }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(menuRef, () => setMenuOpen(false));

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenMobileNav}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 motion-safe:transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Search"
          onClick={onOpenPalette}
          className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-zinc-500 motion-safe:transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden text-sm font-normal sm:inline">Search</span>
          <kbd className="hidden rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="New Comparison"
          className="flex h-11 items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 text-sm font-medium text-white motion-safe:transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">New Comparison</span>
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 motion-safe:transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-600" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
              <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Notifications
              </p>
              <ul>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-3 py-2.5 text-sm font-normal text-zinc-700 hover:bg-zinc-50">
                    <p>{n.title}</p>
                    <p className="mt-0.5 text-xs font-normal text-zinc-500">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-11 items-center gap-1.5 rounded-lg px-1.5 motion-safe:transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            <Image
              src={CURRENT_USER.avatarUrl}
              alt={CURRENT_USER.name}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          </button>
          {menuOpen ? (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full px-3 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Account settings
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full px-3 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
