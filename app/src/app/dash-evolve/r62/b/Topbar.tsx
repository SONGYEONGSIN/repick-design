"use client";

import { useState } from "react";
import { Search, Bell, Menu, X, Plus } from "lucide-react";
import { FOCUS } from "./ui";
import { Sidebar } from "./Sidebar";
import { UserMenu } from "./UserMenu";

export function Topbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[44px] min-w-0 items-center gap-2 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
          className={`flex-shrink-0 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 lg:hidden ${FOCUS}`}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onOpenPalette}
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-left text-sm font-normal text-zinc-500 sm:max-w-sm ${FOCUS}`}
        >
          <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">
            <span className="sr-only sm:not-sr-only">Search zones, tasks, SKUs…</span>
          </span>
          <kbd className="hidden flex-shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px] font-normal text-zinc-500 sm:inline">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-green-700 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-green-800 sm:px-3 ${FOCUS}`}
          >
            <Plus className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">New task</span>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className={`flex-shrink-0 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS}`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>
          <UserMenu />
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-zinc-900/40" />
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <Sidebar mobile />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
              className={`absolute right-3 top-3 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
