"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Menu, Search, Bell, Plus, ChevronDown, Settings, LogOut, UserRound } from "lucide-react";
import { Avatar, FOCUS_RING } from "./ui";
import { ACTIVITY_FEED, ACTIVITY_ICON, ACTIVITY_TONE, formatRelative } from "./data";

export function Topbar({
  onOpenMenu,
  onOpenSearch,
  onNewAdjustment,
}: {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onNewAdjustment: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3.5 text-left text-zinc-400 hover:bg-white/[0.08] sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
        <span className="sr-only truncate text-sm font-normal sm:not-sr-only">Search lots, codes, categories&hellip;</span>
        <kbd
          aria-hidden="true"
          className="ml-auto hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 sm:inline-block"
        >
          &#8984;K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onNewAdjustment}
          className={`flex h-11 items-center gap-2 rounded-lg bg-indigo-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          <Plus aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
          <span className="sr-only sm:not-sr-only">New adjustment</span>
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
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, open, () => setOpen(false));
  const items = ACTIVITY_FEED.slice(0, 4);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Notifications"
        className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
      >
        <Bell aria-hidden="true" className="h-5 w-5" />
        <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40"
        >
          <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-zinc-50">Desk activity</div>
          <ul className="max-h-72 divide-y divide-white/5 overflow-y-auto">
            {items.map((n) => {
              const Icon = ACTIVITY_ICON[n.type];
              return (
                <li key={n.id} className="px-4 py-3 hover:bg-white/5">
                  <div className="flex items-start gap-2.5">
                    <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${ACTIVITY_TONE[n.type]}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-normal text-zinc-50">{n.description}</p>
                      <p className="mt-0.5 truncate text-xs font-normal text-zinc-400">
                        {n.lotCode} &middot; {n.lotTitle}
                      </p>
                      <p className="mt-1 text-[11px] font-normal text-zinc-400">{formatRelative(n.at)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
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
        className={`flex h-11 items-center gap-2 rounded-lg px-2 hover:bg-white/5 ${FOCUS_RING}`}
      >
        <Avatar initials="RN" size={30} />
        <span className="sr-only text-sm font-medium text-zinc-50 sm:not-sr-only">Reya Novak</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-zinc-50">Reya Novak</p>
            <p className="truncate text-xs font-normal text-zinc-400">reya.novak@lotwise.example</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-normal text-zinc-200 hover:bg-white/5 ${FOCUS_RING}`}
          >
            <UserRound aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
            Your profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-normal text-zinc-200 hover:bg-white/5 ${FOCUS_RING}`}
          >
            <Settings aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
            Desk settings
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2.5 border-t border-white/10 px-4 py-2.5 text-left text-sm font-normal text-zinc-200 hover:bg-white/5 ${FOCUS_RING}`}
          >
            <LogOut aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
