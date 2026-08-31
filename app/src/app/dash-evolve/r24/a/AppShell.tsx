"use client";

import { useState, type ReactNode } from "react";
import {
  Anchor,
  Bell,
  BarChart3,
  ChevronDown,
  Inbox,
  LogOut,
  Menu,
  Search,
  Settings,
  Ticket,
  User,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { DropdownMenu, FOCUS_RING, MenuItem } from "./ui";
import { AgentAvatar, InitialsAvatar } from "./Avatar";
import type { Agent } from "./data";

const CURRENT_AGENT: Agent = { id: "jordan", name: "Jordan Ade", initials: "JA", photoId: "1507003211169-0a1dd7228f2d" };

const NAV_SECTIONS: { label: string; items: { label: string; icon: typeof Inbox; active?: boolean; count?: number }[] }[] = [
  {
    label: "Workspace",
    items: [
      { label: "Inbox", icon: Inbox, count: 12 },
      { label: "Cases", icon: Ticket, active: true, count: 9 },
      { label: "Customers", icon: Users },
      { label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Automations", icon: Workflow },
      { label: "Settings", icon: Settings },
    ],
  },
];

function NavContent() {
  return (
    <nav aria-label="Primary" className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{section.label}</p>
          <ul className="mt-1.5 space-y-0.5">
            {section.items.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  aria-current={item.active ? "page" : undefined}
                  className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${
                    item.active ? "bg-teal-50 text-teal-800" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </span>
                  {typeof item.count === "number" && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                        item.active ? "bg-teal-100 text-teal-800" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarUser() {
  return (
    <div className="shrink-0 border-t border-zinc-200 p-3">
      <DropdownMenu
        label="Account menu"
        openUp
        triggerClassName={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-zinc-100 ${FOCUS_RING}`}
        triggerContent={
          <>
            <AgentAvatar agent={CURRENT_AGENT} size={32} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-900">{CURRENT_AGENT.name}</span>
              <span className="block truncate text-xs text-zinc-500">Support lead</span>
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          </>
        }
      >
        {(close) => (
          <>
            <MenuItem icon={User} onClick={close}>
              Profile
            </MenuItem>
            <MenuItem icon={Settings} onClick={close}>
              Preferences
            </MenuItem>
            <MenuItem icon={LogOut} danger onClick={close}>
              Log out
            </MenuItem>
          </>
        )}
      </DropdownMenu>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
      <div className="flex shrink-0 items-center gap-2 border-b border-zinc-200 px-4 py-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-teal-700 text-white">
          <Anchor className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-zinc-900">Harborline</p>
          <p className="truncate text-[11px] text-zinc-500">Support console</p>
        </div>
      </div>
      <button
        type="button"
        className={`mx-3 mt-3 flex shrink-0 items-center justify-between gap-2 rounded-lg border border-zinc-200 px-2.5 py-2 text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <InitialsAvatar name="Acme Support" size={20} />
          <span className="truncate font-medium">Acme Support</span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      <NavContent />
      <SidebarUser />
    </aside>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button aria-label="Close navigation menu" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-teal-700 text-white">
              <Anchor className="size-4.5" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold tracking-tight text-zinc-900">Harborline</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className={`inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>
        <NavContent />
        <SidebarUser />
      </div>
    </div>
  );
}

export function Topbar({
  onOpenDrawer,
  onOpenPalette,
  pageTitle,
}: {
  onOpenDrawer: () => void;
  onOpenPalette: () => void;
  pageTitle: string;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2.5 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenDrawer}
          className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden ${FOCUS_RING}`}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <h1 className="truncate text-base font-semibold text-zinc-900">{pageTitle}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="Search cases (Command K)"
          onClick={onOpenPalette}
          className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-500 hover:bg-zinc-50 ${FOCUS_RING}`}
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Search&hellip;</span>
          <kbd className="hidden rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline">
            &#8984;K
          </kbd>
        </button>

        <DropdownMenu
          label="Notifications"
          align="right"
          triggerClassName={`relative inline-flex size-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
          triggerContent={
            <>
              <Bell className="size-4.5" aria-hidden="true" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" aria-hidden="true" />
            </>
          }
        >
          {() => (
            <>
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Notifications</p>
              <NotificationRow>SLA breached on CS-4103 &middot; Bellwether Health</NotificationRow>
              <NotificationRow>New case assigned to you &middot; CS-4032</NotificationRow>
              <NotificationRow>Customer replied &middot; CS-4127</NotificationRow>
            </>
          )}
        </DropdownMenu>

        <button
          type="button"
          className={`hidden h-11 items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 text-sm font-medium text-white hover:bg-teal-800 sm:inline-flex ${FOCUS_RING}`}
        >
          New case
        </button>

        <DropdownMenu
          label="Your account"
          align="right"
          triggerClassName={`rounded-full ${FOCUS_RING}`}
          triggerContent={<AgentAvatar agent={CURRENT_AGENT} size={36} />}
        >
          {(close) => (
            <>
              <MenuItem icon={User} onClick={close}>
                Profile
              </MenuItem>
              <MenuItem icon={Settings} onClick={close}>
                Preferences
              </MenuItem>
              <MenuItem icon={LogOut} danger onClick={close}>
                Log out
              </MenuItem>
            </>
          )}
        </DropdownMenu>
      </div>
    </header>
  );
}

function NotificationRow({ children }: { children: ReactNode }) {
  return <p className="px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50">{children}</p>;
}
