"use client";

import { useState } from "react";
import { Menu, Search, Plus, Bell, Check } from "lucide-react";
import type { Exchange } from "./data";
import { FOCUS_RING, useOutsideClose, StatusBadge } from "./ui";

function AddWatchMenu({ candidates, onAdd }: { candidates: Exchange[]; onAdd: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex h-8 items-center gap-1.5 rounded-lg bg-sky-700 px-3 text-xs font-medium text-white transition-colors duration-150 ease-out hover:bg-sky-800 ${FOCUS_RING}`}
      >
        <Plus className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Add to watchlist</span>
        <span className="sm:hidden">Add</span>
      </button>
      {open && (
        <div role="listbox" aria-label="Add exchange to watchlist" className="absolute right-0 top-10 z-20 w-72 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
          {candidates.length === 0 ? (
            <p className="px-2.5 py-2 text-xs font-normal text-zinc-600">Every exchange is already on your watchlist.</p>
          ) : (
            candidates.map((c) => (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onAdd(c.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-xs font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <StatusBadge status={c.status} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Topbar({
  onOpenPalette,
  onOpenDrawer,
  atRiskCount,
  degradedCount,
  addCandidates,
  onAddToWatchlist,
}: {
  onOpenPalette: () => void;
  onOpenDrawer: () => void;
  atRiskCount: number;
  degradedCount: number;
  addCandidates: Exchange[];
  onAddToWatchlist: (id: string) => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const notifRef = useOutsideClose<HTMLDivElement>(notifOpen, () => setNotifOpen(false));
  const avatarRef = useOutsideClose<HTMLDivElement>(avatarOpen, () => setAvatarOpen(false));

  return (
    <header className="flex h-11 flex-shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
      {/* The page's one h1 — placed here (first in DOM order) rather than on the market chart, so
          the heading sequence starts at h1 before any h2 further down, even though the watchlist
          rail (h2 "Following") sits visually to the left of the chart. */}
      <h1 className="sr-only">Clearbid — market overview</h1>
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open navigation menu"
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 lg:hidden ${FOCUS_RING}`}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onOpenPalette}
          className={`flex h-8 min-w-0 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-normal text-zinc-600 hover:bg-zinc-50 ${FOCUS_RING}`}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="hidden truncate sm:inline">Search exchanges…</span>
          <span className="flex-shrink-0 rounded border border-zinc-200 px-1 text-[10px] font-medium text-zinc-500">⌘K</span>
        </button>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
        <AddWatchMenu candidates={addCandidates} onAdd={onAddToWatchlist} />

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {atRiskCount > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 z-20 w-64 rounded-lg border border-zinc-200 bg-white p-3 text-xs font-normal text-zinc-600 shadow-lg">
              <p className="font-medium text-zinc-900">Watchlist health</p>
              <p className="mt-1 tabular-nums">
                {atRiskCount} at risk, {degradedCount} degraded on your watchlist right now.
              </p>
            </div>
          )}
        </div>

        <div className="relative" ref={avatarRef}>
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-expanded={avatarOpen}
            aria-label="YS, account menu"
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600 ${FOCUS_RING}`}
          >
            YS
          </button>
          {avatarOpen && (
            <div className="absolute right-0 top-9 z-20 w-40 rounded-lg border border-zinc-200 bg-white p-1 text-xs font-normal shadow-lg">
              <button type="button" onClick={() => setAvatarOpen(false)} className={`block w-full rounded-md px-2 py-1.5 text-left text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
                Profile
              </button>
              <button type="button" onClick={() => setAvatarOpen(false)} className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
                Theme: Light
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-sky-600" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setAvatarOpen(false)} className={`block w-full rounded-md px-2 py-1.5 text-left text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
