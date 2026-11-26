"use client";

import { Menu, Search, Plus, Bell, AlertTriangle } from "lucide-react";
import type { Visit } from "./data";
import { formatDayShort, formatRange } from "./data";
import { Popover } from "./Popover";
import { FOCUS_RING, cx } from "./ui";

interface TopbarProps {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  onOpenNewVisit: () => void;
  atRisk: Visit[];
  onSelectAtRisk: (day: number) => void;
}

export function Topbar({ onOpenMobileNav, onOpenPalette, onOpenNewVisit, atRisk, onSelectAtRisk }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className={cx("flex h-11 w-11 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 lg:hidden", FOCUS_RING)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cx(
          "flex h-11 w-full max-w-xs items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 hover:bg-zinc-100",
          FOCUS_RING
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">Search visits, sites, trials…</span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenNewVisit}
          className={cx(
            "flex h-11 items-center gap-2 rounded-md bg-lime-700 px-4 text-sm font-medium text-white hover:bg-lime-800",
            FOCUS_RING
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">New visit</span>
        </button>

        <Popover
          align="right"
          trigger={({ open, toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-haspopup="menu"
              aria-expanded={open}
              className={cx("relative flex h-11 w-11 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100", FOCUS_RING)}
              aria-label={atRisk.length > 0 ? `Notifications, ${atRisk.length} need attention` : "Notifications"}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {atRisk.length > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold tabular-nums text-white"
                >
                  {atRisk.length}
                </span>
              )}
            </button>
          )}
        >
          {({ close }) => (
            <div>
              <div className="border-b border-zinc-200 px-3 py-2.5">
                <p className="text-sm font-bold text-zinc-900">Needs attention</p>
                <p className="text-xs text-zinc-500">Missed visits and open unscheduled add-ons.</p>
              </div>
              <ul className="max-h-72 overflow-y-auto py-1">
                {atRisk.length === 0 && <li className="px-3 py-3 text-sm text-zinc-500">Nothing needs attention right now.</li>}
                {atRisk.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAtRisk(v.day);
                        close();
                      }}
                      className={cx("flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-zinc-50", FOCUS_RING)}
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-zinc-800">
                          {v.patientId} · {v.visitType}
                        </span>
                        <span className="block truncate text-xs tabular-nums text-zinc-500">
                          {formatDayShort(v.day)}, {formatRange(v.start, v.duration)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}
