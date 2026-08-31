"use client";

import { useState } from "react";
import {
  BarChart3,
  ChevronsUpDown,
  ClipboardList,
  CreditCard,
  FileStack,
  Landmark,
  LayoutGrid,
  Receipt,
  Settings,
  Users,
  X,
} from "lucide-react";

const PRIMARY_NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Revenue Recognition", icon: Receipt, active: true },
  { label: "Subscriptions", icon: CreditCard, active: false },
  { label: "Invoices", icon: FileStack, active: false },
];

const REPORTS_NAV = [
  { label: "Forecasts", icon: BarChart3, active: false },
  { label: "Cohorts", icon: Users, active: false },
  { label: "Audit Log", icon: ClipboardList, active: false },
];

const WORKSPACES = ["Acme Corp", "Acme Corp — EU Entity", "Acme Sandbox"];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  const body = (
    <div className="flex h-full flex-col bg-zinc-50">
      <div className="flex h-11 items-center gap-2 px-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-700 text-white">
          <Landmark className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="truncate text-[17px] font-semibold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
          Accrue
        </span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-zinc-500 outline-none hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="relative px-3 pt-2">
        <button
          type="button"
          onClick={() => setSwitcherOpen((v) => !v)}
          aria-expanded={switcherOpen}
          aria-haspopup="listbox"
          className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        >
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700">{workspace}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
        </button>
        {switcherOpen && (
          <>
            <button type="button" aria-label="Close workspace list" className="fixed inset-0 z-10 cursor-default" onClick={() => setSwitcherOpen(false)} />
            <ul role="listbox" aria-label="Workspaces" className="absolute inset-x-3 top-full z-20 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-md">
              {WORKSPACES.map((w) => (
                <li key={w}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={workspace === w}
                    onClick={() => {
                      setWorkspace(w);
                      setSwitcherOpen(false);
                    }}
                    className={`block w-full truncate px-3 py-1.5 text-left text-xs outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-700 ${
                      workspace === w ? "bg-orange-50 text-orange-700" : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {w}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Primary">
        <div>
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Workspace</p>
          <ul className="space-y-0.5">
            {PRIMARY_NAV.map((item) => (
              <li key={item.label}>
                <a
                  href="#main-content"
                  aria-current={item.active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 ${
                    item.active ? "bg-orange-50 font-medium text-orange-700" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Reports</p>
          <ul className="space-y-0.5">
            {REPORTS_NAV.map((item) => (
              <li key={item.label}>
                <a
                  href="#main-content"
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-zinc-600 outline-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700" aria-hidden="true">
            YS
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-800">Y. Song</p>
            <p className="truncate text-[11px] text-zinc-500">Finance Ops</p>
          </div>
          <button
            type="button"
            aria-label="Account settings"
            className="rounded-md p-1.5 text-zinc-500 outline-none hover:bg-zinc-200 hover:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 lg:block">{body}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close navigation overlay" className="absolute inset-0 bg-zinc-900/40" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-zinc-200 shadow-xl">{body}</div>
        </div>
      )}
    </>
  );
}
