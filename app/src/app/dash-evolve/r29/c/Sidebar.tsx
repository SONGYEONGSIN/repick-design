"use client";

import {
  ChevronsUpDown,
  LayoutGrid,
  Package,
  RotateCcw,
  Settings,
  Store,
  Wallet,
  X,
} from "lucide-react";
import { FOCUS_RING } from "./data";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Sellers", icon: Store, active: true },
  { label: "Orders", icon: Package, active: false },
  { label: "Returns", icon: RotateCcw, active: false },
  { label: "Payouts", icon: Wallet, active: false },
  { label: "Settings", icon: Settings, active: false },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-zinc-950/70 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-zinc-950 transition-transform duration-200 motion-reduce:transition-none lg:static lg:z-auto lg:flex lg:w-64 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
              <Store className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="font-[family-name:var(--font-display-grotesk)] text-lg font-semibold tracking-tight text-zinc-50">
              Reloop
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className={`rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only font-normal">Close navigation</span>
          </button>
        </div>

        <button
          type="button"
          className={`mx-4 mt-4 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left hover:bg-white/[0.08] ${FOCUS_RING}`}
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-zinc-50">Aldergate Resale</span>
            <span className="block truncate text-xs font-normal text-zinc-400">Marketplace ops workspace</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        </button>

        <nav aria-label="Primary" className="mt-6 flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                  item.active
                    ? "bg-sky-500/15 font-medium text-sky-300"
                    : "font-normal text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/5 ${FOCUS_RING}`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-200">
              MR
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-50">Mara Ojeda</span>
              <span className="block truncate text-xs font-normal text-zinc-400">Marketplace ops lead</span>
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
