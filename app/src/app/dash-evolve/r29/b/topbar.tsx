"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Menu, Search, Bell, Plus, ChevronDown, Settings, LogOut, UserRound } from "lucide-react";
import { Avatar, FOCUS_RING } from "./ui";

interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "3 critical events in the last hour", body: "Impossible-travel and bulk-export flags on the Payments Gateway need triage.", read: false },
  { id: "n2", title: "Contractor access review due", body: "Anders Vik's temporary Deploy Pipeline grant expires in 2 days.", read: false },
  { id: "n3", title: "Weekly risk digest ready", body: "Anomaly rate averaged 4.6/1k sessions this week, up from 3.1 last week.", read: true },
];

export function Topbar({
  onOpenMenu, onOpenSearch, onNewInvestigation,
}: { onOpenMenu: () => void; onOpenSearch: () => void; onNewInvestigation: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 md:hidden ${FOCUS_RING}`}
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 text-left text-zinc-500 hover:bg-zinc-100 sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
        <span className="sr-only sm:not-sr-only truncate text-sm font-normal">Search events, actors, services…</span>
        <kbd aria-hidden="true" className="ml-auto hidden shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onNewInvestigation}
          className={`flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-3.5 text-sm font-medium text-white hover:bg-emerald-800 ${FOCUS_RING}`}
        >
          <Plus aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
          <span className="sr-only sm:not-sr-only">New investigation</span>
        </button>
        <NotificationsMenu />
        <AccountMenu />
      </div>
    </header>
  );
}

function useOutsideClose(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose]);
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, open, () => setOpen(false));
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 ${FOCUS_RING}`}
      >
        <Bell aria-hidden="true" className="h-5 w-5" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold tabular-nums text-white"
          >
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <span className="text-sm font-bold text-zinc-900">Notifications</span>
            <button
              type="button"
              onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
              className={`rounded-md px-2 py-2 text-xs font-medium text-emerald-700 hover:underline ${FOCUS_RING}`}
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {items.map((n) => (
              <li key={n.id} className="border-b border-zinc-100 px-4 py-3 last:border-b-0">
                <div className="flex items-start gap-2">
                  {!n.read && <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900">{n.title}</p>
                    <p className="mt-0.5 text-xs font-normal text-zinc-500">{n.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, open, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex h-11 items-center gap-2 rounded-lg px-2 hover:bg-zinc-100 ${FOCUS_RING}`}
      >
        <Avatar initials="PC" size={30} />
        <span className="sr-only sm:not-sr-only text-sm font-medium text-zinc-900">Priya Chen</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
        >
          <div className="border-b border-zinc-200 px-4 py-3">
            <p className="truncate text-sm font-medium text-zinc-900">Priya Chen</p>
            <p className="truncate text-xs font-normal text-zinc-500">priya.chen@wardenhq.example</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <UserRound aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
            Your profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <Settings aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
            Settings
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 border-t border-zinc-100 px-4 py-2.5 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <LogOut aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
