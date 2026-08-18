"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Boxes,
  LayoutGrid,
  ClipboardList,
  Building2,
  Truck,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronsUpDown,
  Download,
  Check,
  Menu,
  X,
} from "lucide-react";
import { Popover } from "./Popover";
import { FOCUS_RING, FOCUS_OUTLINE_ON_ACCENT } from "./ui";

const NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Inventory", icon: Boxes, active: true },
  { label: "Purchase orders", icon: ClipboardList, active: false },
  { label: "Suppliers", icon: Truck, active: false },
  { label: "Warehouses", icon: Building2, active: false },
  { label: "Reports", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const WORKSPACES = ["Northlight Retail", "Northlight EU B.V."];

const NOTIFICATIONS = [
  { id: "n1", text: "Low stock alert: Wool Beanie — Heather Grey crossed its reorder point." },
  { id: "n2", text: "Backorder cleared: All-Terrain Hiking Shoe restock is scheduled for Aug 24." },
  { id: "n3", text: "Weekly inventory valuation report is ready to download." },
];

export function AppShell({
  onOpenPalette,
  onExportCsv,
  searchButtonRef,
  children,
}: {
  onOpenPalette: () => void;
  onExportCsv: () => void;
  searchButtonRef: React.RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}) {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const unreadCount = NOTIFICATIONS.length - readIds.size;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasMobileNavOpen = useRef(false);

  // Focus only ever moves inside an effect (after `mobileNavOpen` flips) or a plain event
  // handler — `closeMobileNav` itself never touches `menuButtonRef`, because it gets handed to
  // `navList(...)` while AppShell is rendering, and this lint config treats a ref-reading closure
  // passed into a render-time function call as an unsafe read even when never called until later.
  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  useEffect(() => {
    if (wasMobileNavOpen.current && !mobileNavOpen) menuButtonRef.current?.focus();
    wasMobileNavOpen.current = mobileNavOpen;
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  const navList = (onNavigate?: () => void) => (
    <nav aria-label="Primary" className="flex-1 space-y-0.5 px-3 py-3">
      {NAV.map((item) => (
        <button
          key={item.label}
          type="button"
          disabled={!item.active}
          aria-current={item.active ? "page" : undefined}
          title={item.active ? undefined : "Preview only — not wired in this candidate"}
          onClick={item.active ? onNavigate : undefined}
          className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${FOCUS_RING} ${
            item.active ? "bg-blue-50 text-blue-700" : "text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
          }`}
        >
          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_OUTLINE_ON_ACCENT}`}
      >
        Skip to main content
      </a>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
            <Boxes className="h-4 w-4" aria-hidden="true" />
          </span>
          <span
            className="text-base font-bold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Stockloom
          </span>
        </div>

        <div className="border-b border-zinc-200 px-3 py-3">
          <Popover
            label={
              <>
                <span className="flex-1 truncate text-left">{workspace}</span>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              </>
            }
            panelClassName="w-56"
            render={(close) => (
              <ul>
                {WORKSPACES.map((w) => (
                  <li key={w}>
                    <button
                      type="button"
                      onClick={() => {
                        setWorkspace(w);
                        close();
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-50 ${FOCUS_RING}`}
                    >
                      <span className="truncate text-zinc-700">{w}</span>
                      {w === workspace ? <Check className="h-4 w-4 text-blue-600" aria-hidden="true" /> : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          />
        </div>

        {navList()}

        <div className="flex items-center gap-3 border-t border-zinc-200 px-4 py-4">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">Priya Nandakumar</p>
            <p className="truncate text-xs text-zinc-500">Inventory Lead</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            aria-haspopup="true"
            aria-expanded={mobileNavOpen}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden ${FOCUS_RING}`}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            ref={searchButtonRef}
            type="button"
            onClick={onOpenPalette}
            className={`flex h-11 w-full min-w-0 max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 ${FOCUS_RING}`}
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-left">Search SKUs…</span>
            <kbd className="ml-auto hidden shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onExportCsv}
              className={`hidden h-11 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:flex ${FOCUS_OUTLINE_ON_ACCENT}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              aria-label="Export CSV"
              className={`flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 sm:hidden ${FOCUS_OUTLINE_ON_ACCENT}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </button>

            <Popover
              label={
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  {unreadCount > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white"
                    >
                      {unreadCount}
                    </span>
                  ) : null}
                  <span className="sr-only">Notifications, {unreadCount} unread</span>
                </span>
              }
              align="right"
              panelClassName="w-80"
              render={() => (
                <div>
                  <div className="flex items-center justify-between px-2 pb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Notifications</p>
                    <button
                      type="button"
                      onClick={() => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)))}
                      className={`rounded-sm text-xs font-semibold text-blue-700 hover:underline ${FOCUS_RING}`}
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {NOTIFICATIONS.map((n) => (
                      <li key={n.id} className={`rounded-lg px-2 py-2 text-sm ${readIds.has(n.id) ? "text-zinc-400" : "text-zinc-700"}`}>
                        {n.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            />

            <Popover
              label={
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
                  alt="Priya Nandakumar account menu"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              }
              align="right"
              panelClassName="w-48"
              render={(close) => (
                <ul>
                  {["Profile", "Settings", "Sign out"].map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={close}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            />
          </div>
        </header>

        <main id="main" className="flex min-w-0 flex-1 flex-col">
          {children}
        </main>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-zinc-900/40" onClick={closeMobileNav} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-5">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
                  <Boxes className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-base font-bold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-mono)" }}>
                  Stockloom
                </span>
              </span>
              <button
                type="button"
                onClick={closeMobileNav}
                aria-label="Close navigation menu"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {navList(closeMobileNav)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
