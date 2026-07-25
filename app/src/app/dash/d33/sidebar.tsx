"use client";

import { useState } from "react";
import {
  BarChart3,
  Building2,
  ChevronsUpDown,
  KanbanSquare,
  LifeBuoy,
  ListChecks,
  LogOut,
  Settings,
  Target,
  Users,
  X,
} from "lucide-react";
import { Avatar } from "./ui";
import { getOwner, CURRENT_USER_ID } from "./data";

const NAV_SECTIONS = [
  {
    label: "Sales",
    items: [
      { id: "pipeline", label: "Pipeline", icon: KanbanSquare, active: true },
      { id: "deals", label: "Deals", icon: ListChecks, active: false },
      { id: "accounts", label: "Accounts", icon: Building2, active: false },
      { id: "forecast", label: "Forecast", icon: BarChart3, active: false },
    ],
  },
  {
    label: "Team",
    items: [
      { id: "reps", label: "Reps", icon: Users, active: false },
      { id: "goals", label: "Goals", icon: Target, active: false },
    ],
  },
];

const WORKSPACES = ["Northwind Sales", "Northwind APAC", "Personal Workspace"];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const me = getOwner(CURRENT_USER_ID);

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-zinc-900/30 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r border-zinc-200 bg-white transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : ""
        }`}
        aria-label="Main sidebar"
      >
        <div className="flex h-14 items-center justify-between gap-2 px-4">
          <WorkspaceSwitcher />
          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Main menu">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <h2 className="px-3 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                {section.label}
              </h2>
              <ul className="mt-2 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        aria-current={item.active ? "page" : undefined}
                        className={`flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                          item.active
                            ? "bg-blue-50 text-blue-700"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-zinc-100 p-3">
          <a
            href="#help"
            className="mb-1 flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <LifeBuoy className="h-4 w-4 shrink-0" aria-hidden="true" />
            Help
          </a>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar src={me.avatarUrl} name={me.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">{me.name}</p>
              <p className="truncate text-xs text-zinc-500">{me.role}</p>
            </div>
            <button
              type="button"
              aria-label="Settings"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(WORKSPACES[0]);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
          K
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-900">{active}</span>
          <span className="block text-[11px] text-zinc-500">Keel · Sales Workspace</span>
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Select workspace"
          className="absolute top-full left-0 z-30 mt-1 w-full min-w-[220px] rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          {WORKSPACES.map((ws) => (
            <button
              key={ws}
              type="button"
              role="option"
              aria-selected={ws === active}
              onClick={() => {
                setActive(ws);
                setOpen(false);
              }}
              className={`flex min-h-[44px] w-full items-center rounded-lg px-2.5 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                ws === active ? "bg-blue-50 font-medium text-blue-700" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {ws}
            </button>
          ))}
          <div className="my-1 h-px bg-zinc-100" />
          <button
            type="button"
            className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2.5 text-sm text-zinc-500 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
