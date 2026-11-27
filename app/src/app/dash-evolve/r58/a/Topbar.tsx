"use client";

import { useState } from "react";
import { Search, Bell, Menu, Plus, X } from "lucide-react";
import { FOCUS } from "./ui";
import { Sidebar } from "./Sidebar";

export function Topbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[44px] min-w-0 items-center gap-3 border-b border-white/10 bg-slate-950/90 px-4 backdrop-blur sm:px-6">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
          className={`flex-shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 lg:hidden ${FOCUS}`}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onOpenPalette}
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-left text-sm font-normal text-slate-400 sm:max-w-sm ${FOCUS}`}
        >
          <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">
            <span className="sr-only sm:not-sr-only">Search resources, clients, bookings…</span>
          </span>
          <kbd className="hidden flex-shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[11px] font-normal text-slate-400 sm:inline">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            className={`hidden items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-400 sm:inline-flex ${FOCUS}`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New booking
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className={`flex-shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 ${FOCUS}`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-slate-950/70" />
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <Sidebar mobile />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
              className={`absolute right-3 top-3 rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 ${FOCUS}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
