"use client";

import { useState } from "react";
import {
  BarChart3,
  Building2,
  Check,
  ChevronsUpDown,
  Compass,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MoreVertical,
  Settings,
} from "lucide-react";
import { FOCUS_RING, Avatar } from "./ui";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "renewals", label: "Renewals", icon: Compass },
  { key: "accounts", label: "Accounts", icon: Building2 },
  { key: "playbooks", label: "Playbooks", icon: ListChecks },
  { key: "reports", label: "Reports", icon: BarChart3 },
] as const;

const WORKSPACES = ["Acme Revenue Team", "Acme EMEA Renewals"] as const;

/**
 * Shared between the fixed desktop rail and the mobile drawer. The wrapper this renders into
 * (`SidebarContent`) is given an explicit `w-full min-w-0` of its own: inside the row-flex
 * `<aside>`, an un-truncated min-content width from the workspace switcher label can otherwise
 * overflow the fixed-width rail and overlap the page's own heading, even though the label span
 * itself already carries `truncate min-w-0`.
 */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState<(typeof WORKSPACES)[number]>(WORKSPACES[0]);

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex items-center gap-2 px-4 pt-5 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Compass className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span
          className="truncate text-lg font-semibold tracking-tight text-zinc-900"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          Northbound
        </span>
      </div>

      <div className="relative px-3 pb-3">
        <button
          type="button"
          onClick={() => setWorkspaceOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={workspaceOpen}
          className={`flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left transition-colors duration-150 hover:bg-zinc-100 ${FOCUS_RING}`}
        >
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
            {workspace}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        </button>
        {workspaceOpen && (
          <div
            role="listbox"
            aria-label="Switch workspace"
            className="absolute left-3 right-3 top-full z-20 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-sm"
          >
            {WORKSPACES.map((name) => (
              <button
                key={name}
                type="button"
                role="option"
                aria-selected={name === workspace}
                onClick={() => {
                  setWorkspace(name);
                  setWorkspaceOpen(false);
                }}
                className={`flex w-full min-w-0 items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <span className="min-w-0 flex-1 truncate text-zinc-700">{name}</span>
                {name === workspace && <Check className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="flex-1 min-w-0 overflow-y-auto px-3" aria-label="Primary">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = item.key === "renewals";
            const Icon = item.icon;
            return (
              <li key={item.key} className="min-w-0">
                <button
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className={`flex h-10 w-full min-w-0 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors duration-150 ${FOCUS_RING} ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0 border-t border-zinc-200 px-3 py-3">
        <button
          type="button"
          onClick={onNavigate}
          className={`flex h-10 w-full min-w-0 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-zinc-600 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-left">Settings</span>
        </button>

        <div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg px-3 py-2">
          <Avatar initials="JE" size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900">Jamie Ellis</p>
            <p className="truncate text-xs text-zinc-500">Head of Customer Success</p>
          </div>
          <UserMenuButton />
        </div>
      </div>
    </div>
  );
}

function UserMenuButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account options"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-20 mb-1 w-40 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-sm"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
