"use client";

import {
  Building2,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "./menu";
import { FOCUS_RING } from "./ui";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard, active: false },
      { label: "Funnel", icon: Workflow, active: true },
      { label: "Buyers", icon: Users, active: false },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Orders", icon: ShoppingCart, active: false },
      { label: "Payments", icon: CreditCard, active: false },
    ],
  },
];

const WORKSPACES = ["Wholesale — North America", "Wholesale — EU", "Sandbox"];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex h-[44px] items-center gap-2 px-4 pt-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
          <Workflow size={16} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-zinc-50 font-[family-name:var(--font-display-mono)]">Portway</span>
      </div>

      <div className="px-3 pt-4">
        <Menu
          open={workspaceOpen}
          onClose={() => setWorkspaceOpen(false)}
          trigger={
            <button
              type="button"
              onClick={() => setWorkspaceOpen((v) => !v)}
              aria-expanded={workspaceOpen}
              className={`${FOCUS_RING} flex h-[44px] w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 text-left hover:bg-white/[0.07]`}
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white/10 text-zinc-300">
                <Building2 size={13} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-200">{workspace}</span>
              <ChevronsUpDown size={14} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
            </button>
          }
          panel={
            <>
              <MenuLabel>Switch workspace</MenuLabel>
              {WORKSPACES.map((w) => (
                <MenuItem
                  key={w}
                  icon={<Building2 size={14} aria-hidden="true" />}
                  onClick={() => {
                    setWorkspace(w);
                    setWorkspaceOpen(false);
                  }}
                >
                  {w}
                </MenuItem>
              ))}
            </>
          }
          panelClassName="w-[15rem]"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pt-5" aria-label="Primary">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              {section.label}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={onNavigate}
                      aria-current={item.active ? "page" : undefined}
                      className={`${FOCUS_RING} flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm motion-safe:transition-colors ${
                        item.active
                          ? "bg-violet-500/15 text-violet-200 font-medium"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" className="flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Menu
          open={userOpen}
          onClose={() => setUserOpen(false)}
          placement="top"
          trigger={
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              aria-expanded={userOpen}
              className={`${FOCUS_RING} flex h-[44px] w-full items-center gap-2.5 rounded-lg px-2 text-left hover:bg-white/5`}
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-medium text-violet-200">
                JA
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-zinc-200">Jordan Ames</span>
                <span className="block truncate text-[11px] text-zinc-400">Workspace Admin</span>
              </span>
              <ChevronsUpDown size={14} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
            </button>
          }
          panel={
            <>
              <MenuItem icon={<Settings size={14} aria-hidden="true" />} onClick={() => setUserOpen(false)}>
                Account settings
              </MenuItem>
              <MenuSeparator />
              <MenuItem icon={<LogOut size={14} aria-hidden="true" />} tone="danger" onClick={() => setUserOpen(false)}>
                Sign out
              </MenuItem>
            </>
          }
          panelClassName="w-[13rem]"
        />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 lg:block">
      <SidebarContent />
    </aside>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 ${FOCUS_RING}`}
      />
      <div className="absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className={`${FOCUS_RING} flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100`}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="h-[calc(100%-2.75rem)]">
          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
