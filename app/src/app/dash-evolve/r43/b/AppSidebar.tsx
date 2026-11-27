"use client";

import { useRef, useState } from "react";
import {
  LayoutDashboard,
  Waypoints,
  ClipboardList,
  Warehouse,
  FileSearch,
  Settings,
  ChevronsUpDown,
  Check,
  LogOut,
  X,
  Package,
} from "lucide-react";
import { Avatar, cn, FOCUS_RING, useDismiss } from "./ui";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "#main-content" },
  { id: "bridge", label: "Shrinkage bridge", icon: Waypoints, href: "#shrinkage-bridge" },
  { id: "incidents", label: "Incidents", icon: ClipboardList, href: "#incident-ledger" },
  { id: "locations", label: "Locations", icon: Warehouse, href: "#" },
  { id: "audits", label: "Audits", icon: FileSearch, href: "#" },
  { id: "settings", label: "Settings", icon: Settings, href: "#" },
] as const;

const WORKSPACES = ["Fernridge Retail Co.", "Fernridge — Canada", "Sandbox"] as const;

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState<(typeof WORKSPACES)[number]>(WORKSPACES[0]);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div ref={ref} className="relative px-3 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-left transition-colors hover:bg-white/5",
          FOCUS_RING,
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-400/15 text-teal-300">
          <Package className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-50">{workspace}</span>
          <span className="block text-xs text-zinc-400">Workspace</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Switch workspace"
          className="absolute left-3 right-3 top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg"
        >
          {WORKSPACES.map((ws) => (
            <li key={ws}>
              <button
                type="button"
                role="option"
                aria-selected={ws === workspace}
                onClick={() => {
                  setWorkspace(ws);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-white/5",
                  FOCUS_RING,
                  ws === workspace ? "text-zinc-50" : "text-zinc-400",
                )}
              >
                <Check
                  className={cn("h-3.5 w-3.5 text-teal-300", ws === workspace ? "opacity-100" : "opacity-0")}
                  aria-hidden="true"
                />
                <span className="truncate">{ws}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AppSidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const nav = (
    <nav aria-label="Primary" className="flex-1 space-y-0.5 px-3 py-4">
      {NAV_ITEMS.map((item, index) => {
        const active = index === 0;
        const ItemIcon = item.icon;
        return (
          <a
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              if (item.href === "#") e.preventDefault();
              onCloseMobile();
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none",
              FOCUS_RING,
              active
                ? "bg-teal-400/10 text-teal-300"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50",
            )}
          >
            <ItemIcon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center gap-3 rounded-lg px-1.5 py-2">
        <Avatar name="Mina Cho" className="h-9 w-9 text-xs" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-50">Mina Cho</span>
          <span className="block truncate text-xs text-zinc-400">Loss Prevention Lead</span>
        </span>
        <button
          type="button"
          aria-label="Log out"
          title="Log out"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100",
            FOCUS_RING,
          )}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 lg:flex">
        <BrandLockup />
        <WorkspaceSwitcher />
        {nav}
        {footer}
      </aside>

      {/* Mobile drawer */}
      <div className={cn("lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity motion-reduce:transition-none",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          tabIndex={mobileOpen ? 0 : -1}
        />
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950 transition-transform duration-200 motion-reduce:transition-none",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!mobileOpen}
          inert={!mobileOpen}
        >
          <div className="flex items-center justify-between px-3 pt-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onCloseMobile}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5",
                FOCUS_RING,
              )}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <BrandLockup />
          <WorkspaceSwitcher />
          {nav}
          {footer}
        </aside>
      </div>
    </>
  );
}

function BrandLockup() {
  return (
    <div className="flex items-center gap-2 px-4 pt-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-400 text-zinc-950">
        <Warehouse className="h-4 w-4" aria-hidden="true" />
      </span>
      <span
        className="text-base font-semibold tracking-tight text-zinc-50"
        style={{ fontFamily: "var(--font-display-mono)" }}
      >
        Driftline
      </span>
    </div>
  );
}
