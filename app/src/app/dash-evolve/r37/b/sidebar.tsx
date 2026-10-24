"use client";

import {
  BarChart3,
  ChevronsUpDown,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutGrid,
  X,
} from "lucide-react";
import { Popover, PopoverItem } from "./ui";

interface NavItem {
  label: string;
  icon: typeof LayoutGrid;
  active?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Vendor Scorecards", icon: BarChart3, active: true },
  { label: "Purchase Orders", icon: ClipboardList },
  { label: "Inspections", icon: ClipboardCheck },
  { label: "Contracts", icon: FileText },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <span className="flex size-7 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-300">
          <BarChart3 className="size-4" aria-hidden="true" />
        </span>
        <span
          className="text-lg font-semibold text-zinc-50"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Baseline
        </span>
      </div>

      <div className="border-b border-white/10 p-3">
        <Popover
          panelLabel="Workspace switcher"
          trigger={({ ref, onClick, open }) => (
            <button
              ref={ref}
              type="button"
              onClick={onClick}
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-zinc-50">
                  Acme Procurement
                </span>
                <span className="block truncate text-xs text-zinc-400">Workspace</span>
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
            </button>
          )}
        >
          {(close) => (
            <>
              <PopoverItem onClick={close}>Acme Procurement</PopoverItem>
              <PopoverItem onClick={close}>Acme Logistics (EU)</PopoverItem>
            </>
          )}
        </Popover>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={onNavigate}
                aria-current={item.active ? "page" : undefined}
                className={
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 " +
                  (item.active
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50")
                }
              >
                <item.icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Identity display only — the interactive account menu lives in the
          topbar avatar button (see topbar.tsx) per the app-shell split. */}
      <div className="flex items-center gap-2.5 border-t border-white/10 p-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-300"
        >
          RT
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-50">Remy Tran</span>
          <span className="block truncate text-xs text-zinc-400">Procurement lead</span>
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
      <div className="hidden w-64 shrink-0 border-r border-white/10 lg:block">
        <SidebarContent />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-white/10 shadow-xl shadow-black/50">
            <div className="flex h-16 items-center justify-end border-b border-white/10 px-3">
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation"
                className="flex size-9 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                <X className="size-4" aria-hidden="true" />
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
