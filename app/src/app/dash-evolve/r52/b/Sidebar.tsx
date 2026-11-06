"use client";

import { Fragment } from "react";
import {
  LayoutGrid,
  Receipt,
  Building2,
  ClipboardCheck,
  Settings,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { Avatar } from "./ui";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid, active: false },
  { id: "spend", label: "Spend", icon: Receipt, active: true },
  { id: "vendors", label: "Vendors", icon: Building2, active: false },
  { id: "approvals", label: "Approvals", icon: ClipboardCheck, active: false },
  { id: "settings", label: "Settings", icon: Settings, active: false },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Primary">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={onNavigate}
            aria-current={item.active ? "page" : undefined}
            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none ${
              item.active
                ? "bg-lime-400/15 font-medium text-lime-300"
                : "font-normal text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-sm font-semibold text-zinc-950">
          L
        </span>
        <span className="text-base font-semibold text-zinc-50">Ledgercheck</span>
      </div>
      <button
        type="button"
        className="mx-3 flex h-10 items-center justify-between rounded-lg border border-white/10 px-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none"
      >
        <span className="truncate">Finance &amp; Procurement</span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      <div className="mt-4 flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="flex h-16 items-center gap-3 border-t border-white/10 px-4">
        <Avatar initials="NV" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-zinc-50">Nora Vance</div>
          <div className="truncate text-xs text-zinc-400">Procurement lead</div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-zinc-950 lg:fixed lg:inset-y-0 lg:flex lg:w-60">
      <SidebarBody />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <Fragment>
      <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 shadow-xl lg:hidden"
      >
        <div className="flex h-14 items-center justify-end px-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="-mt-14">
          <SidebarBody onNavigate={onClose} />
        </div>
      </div>
    </Fragment>
  );
}
