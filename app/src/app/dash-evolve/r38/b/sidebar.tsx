"use client";

import { useState } from "react";
import {
  ChartLine,
  ChevronsUpDown,
  GitBranch,
  LayoutGrid,
  Settings,
  Wallet,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: typeof LayoutGrid;
  active?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Variance Explorer", icon: GitBranch, active: true },
  { label: "Forecasts", icon: ChartLine },
  { label: "Cost Centers", icon: Wallet },
  { label: "Settings", icon: Settings },
];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative border-b border-zinc-200 p-3"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-900">Northwind SaaS Co.</span>
          <span className="block truncate text-xs text-zinc-500">Finance workspace</span>
        </span>
        <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 text-zinc-500" />
      </button>
      {open && (
        <ul
          aria-label="Workspaces"
          className="absolute inset-x-3 top-full z-10 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
        >
          {["Northwind SaaS Co.", "Northwind EU B.V."].map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 px-5">
        <span className="flex size-7 items-center justify-center rounded-md bg-sky-600 text-white">
          <GitBranch aria-hidden="true" className="size-4" />
        </span>
        <span
          className="text-lg font-semibold text-zinc-900"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Ledgerline
        </span>
      </div>

      <WorkspaceSwitcher />

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={onNavigate}
                aria-current={item.active ? "page" : undefined}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                  item.active ? "bg-sky-50 text-sky-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <item.icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2.5 border-t border-zinc-200 p-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700"
        >
          JA
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-900">Jordan Avery</span>
          <span className="block truncate text-xs text-zinc-500">RevOps analyst</span>
        </span>
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <div className="hidden w-64 shrink-0 border-r border-zinc-200 lg:block">
        <SidebarContent />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-900/40"
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-zinc-200 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-end border-b border-zinc-200 px-3">
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation"
                className="flex size-11 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="h-[calc(100%-4rem)]">
              <SidebarContent onNavigate={onCloseMobile} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
