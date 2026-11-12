"use client";

import { useState } from "react";
import {
  AlertOctagon,
  ChevronsUpDown,
  GitFork,
  Hammer,
  LayoutDashboard,
  LogOut,
  Settings,
  Waypoints,
  X,
} from "lucide-react";
import { FOCUS_RING_CLASS, Popover, PopoverItem } from "./ui";

type NavItem = { id: string; label: string; icon: typeof LayoutDashboard; active?: boolean };

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, active: true },
  { id: "pipelines", label: "Pipelines", icon: Waypoints },
  { id: "builds", label: "Builds", icon: Hammer },
  { id: "branches", label: "Branches", icon: GitFork },
  { id: "incidents", label: "Incidents", icon: AlertOctagon },
];

const WORKSPACES = ["Platform Engineering", "Payments Infra", "Mobile Release Train"];

/** Shared nav content rendered both by the permanent rail (lg+) and the mobile drawer. */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    // Explicit w-full on this wrapper: the <aside> around it is a flex container, and without an
    // explicit width here a long workspace name could overflow the fixed-width rail even though
    // the label span inside the switcher button truncates correctly on its own.
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex h-11 items-center gap-2 px-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400 text-zinc-950">
          <Waypoints className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
        <span
          className="truncate text-[15px] font-semibold text-zinc-50"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          Trestle
        </span>
      </div>

      <div className="relative mt-5">
        <button
          type="button"
          onClick={() => setWorkspaceOpen((v) => !v)}
          aria-expanded={workspaceOpen}
          className={`${FOCUS_RING_CLASS} flex h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-left`}
        >
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-50">{workspace}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
        <Popover open={workspaceOpen} onClose={() => setWorkspaceOpen(false)} anchorLabel="Workspace switcher">
          {WORKSPACES.map((w) => (
            <PopoverItem key={w} onClick={() => { setWorkspace(w); setWorkspaceOpen(false); }}>
              {w}
            </PopoverItem>
          ))}
        </Popover>
      </div>

      <nav aria-label="Primary" className="mt-6 flex min-w-0 flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={item.active ? "page" : undefined}
              onClick={onNavigate}
              className={`${FOCUS_RING_CLASS} flex h-10 min-w-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-violet-400/15 text-violet-400"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="relative mt-4 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setUserMenuOpen((v) => !v)}
          aria-expanded={userMenuOpen}
          className={`${FOCUS_RING_CLASS} flex h-11 w-full min-w-0 items-center gap-2.5 rounded-xl px-2 text-left hover:bg-white/5`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-zinc-50">
            RM
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-50">Reyes Marchetti</span>
            <span className="block truncate text-xs font-normal text-zinc-400">Release engineer</span>
          </span>
        </button>
        <Popover open={userMenuOpen} onClose={() => setUserMenuOpen(false)} anchorLabel="Account menu" widthClass="w-56">
          <PopoverItem icon={<Settings className="h-4 w-4 shrink-0" aria-hidden="true" />}>
            Account settings
          </PopoverItem>
          <PopoverItem icon={<LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />}>Sign out</PopoverItem>
        </Popover>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-zinc-950/60 px-4 py-4 lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Close navigation menu" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950 px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className={`${FOCUS_RING_CLASS} absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50`}
        >
          <X className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
