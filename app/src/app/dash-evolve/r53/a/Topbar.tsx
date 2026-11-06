"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Bell, Menu, Plus, User, LogOut, Settings } from "lucide-react";
import { FOCUS_RING } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Zanele Khumalo — risk score 96, new wire payee", time: "2m ago" },
  { id: "n2", text: "Diego Alarcon escalated by Priya Nandakumar's rule match", time: "41m ago" },
  { id: "n3", text: "Weekly risk digest is ready", time: "3h ago" },
];

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
  onNewRule,
  title,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
  onNewRule: () => void;
  title: string;
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
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={`inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 xl:hidden ${FOCUS_RING}`}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <h1 className="max-w-[30vw] flex-shrink-0 truncate font-[family-name:var(--font-display-mono)] text-sm font-semibold tracking-tight text-zinc-50 sm:max-w-none">
        {title}
      </h1>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`ml-auto flex h-11 w-11 flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:border-white/20 sm:ml-4 sm:w-auto sm:flex-1 sm:max-w-sm sm:justify-start sm:px-3 sm:text-left ${FOCUS_RING}`}
      >
        <Search size={16} aria-hidden="true" />
        <span className="sr-only flex-1 truncate text-sm sm:not-sr-only sm:inline">{"Search accounts, signals, rules…"}</span>
        <kbd className="hidden rounded-md border border-white/10 bg-zinc-950 px-1.5 py-0.5 text-[11px] text-zinc-400 sm:inline">
          {"⌘K"}
        </kbd>
      </button>

      <div className="ml-auto flex flex-shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onNewRule}
          className={`hidden h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 sm:inline-flex ${FOCUS_RING}`}
        >
          <Plus size={16} aria-hidden="true" />
          New rule
        </button>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <Bell size={18} aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 top-[calc(100%+6px)] z-20 w-72 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl"
            >
              {NOTIFICATIONS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  role="menuitem"
                  onClick={() => setNotifOpen(false)}
                  className={`block w-full rounded-md px-2.5 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800 ${FOCUS_RING}`}
                >
                  <p className="text-zinc-200">{n.text}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">{n.time}</p>
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
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 ${FOCUS_RING}`}
          >
            <User size={16} aria-hidden="true" />
          </button>
          {avatarOpen ? (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-[calc(100%+6px)] z-20 w-48 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setAvatarOpen(false)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 ${FOCUS_RING}`}
              >
                <Settings size={14} aria-hidden="true" /> Account settings
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setAvatarOpen(false)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 ${FOCUS_RING}`}
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
