"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Download, Menu, Search, User, X } from "lucide-react";

const NOTIFICATIONS = [
  { id: "n1", title: "August close finalized", detail: "Recognized balance posted to the general ledger.", time: "2h ago" },
  { id: "n2", title: "3 credits pending review", detail: "Adjustments queue needs finance sign-off.", time: "1d ago" },
  { id: "n3", title: "New churn risk flagged", detail: "Northwind Ltd. downgraded to monthly billing.", time: "2d ago" },
];

const PALETTE_ITEMS = ["Revenue Recognition", "Subscriptions", "Invoices", "Forecasts", "Cohorts", "Audit Log"];

export default function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (paletteOpen) paletteInputRef.current?.focus();
  }, [paletteOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-11 items-center gap-2 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="rounded-md p-1.5 text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 lg:hidden"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Open search (Command K)"
        className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Search accounts, invoices…</span>
        <kbd className="ml-1 hidden rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="hidden h-9 items-center gap-1.5 rounded-lg bg-orange-700 px-3 text-sm font-medium text-white outline-none hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:flex"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export report
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-expanded={notifOpen}
            aria-haspopup="true"
            aria-label="Notifications, 3 unread"
            className="relative rounded-md p-2 text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-600" aria-hidden="true" />
          </button>
          {notifOpen && (
            <>
              <button type="button" aria-label="Close notifications" className="fixed inset-0 z-10 cursor-default" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
                <p className="border-b border-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700">Notifications</p>
                <ul>
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id} className="border-b border-zinc-50 px-3 py-2.5 last:border-b-0 hover:bg-zinc-50">
                      <p className="text-xs font-medium text-zinc-800">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">{n.detail}</p>
                      <p className="mt-1 text-[10px] text-zinc-500">{n.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label="Account menu"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            YS
          </button>
          {menuOpen && (
            <>
              <button type="button" aria-label="Close account menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-700">
                  <User className="h-3.5 w-3.5" aria-hidden="true" /> Profile
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-700">
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 pt-24" role="dialog" aria-modal="true" aria-label="Command palette">
          <button type="button" aria-label="Close search" className="absolute inset-0" onClick={() => setPaletteOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-zinc-100 px-3.5 py-3">
              <Search className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              <input
                ref={paletteInputRef}
                type="text"
                placeholder="Jump to a page…"
                className="w-full text-sm text-zinc-800 outline-none placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                aria-label="Close search"
                className="rounded-md p-1 text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <ul className="max-h-64 overflow-y-auto py-1.5">
              {PALETTE_ITEMS.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(false)}
                    className="block w-full px-3.5 py-2 text-left text-sm text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-700"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
