"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";
import { FOCUS_RING } from "./ui";

interface TopbarProps {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
}

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Edge CDN origin shield incident is now SEV1-breaching",
    body: "inc-111 has been mitigating for over 3 hours — past its SLA target.",
    time: "2m ago",
  },
  {
    id: "n2",
    title: "New incident reported: Auth Gateway 500s",
    body: "Token-refresh errors climbing on Auth Gateway; no owner assigned yet.",
    time: "8m ago",
  },
  {
    id: "n3",
    title: "Weekly reliability digest ready",
    body: "6 incidents resolved this week, average time to mitigate 3h 45m.",
    time: "1d ago",
  },
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open navigation</span>
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 max-w-md flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left text-sm text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-300 ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only truncate sm:not-sr-only">Search incidents, services, squads…</span>
        <span className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:flex">
          <kbd className="font-sans">&#8984;K</kbd>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={`flex h-11 items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">New incident</span>
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
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="sr-only">Notifications, 3 unread</span>
          </button>
          {notifOpen && (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 z-40 mt-2 w-80 max-w-[88vw] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40"
            >
              <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-zinc-50">Notifications</div>
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
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-medium text-emerald-300">
              CR
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
