"use client";

import { useState } from "react";
import {
  ChartColumn,
  ChevronsUpDown,
  FileClock,
  KeyRound,
  LogOut,
  Settings,
  ShieldAlert,
  WavesHorizontal,
  Webhook,
  X,
} from "lucide-react";
import { FOCUS } from "./ui";

type NavItem = { id: string; label: string; icon: typeof KeyRound; active?: boolean };

const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Workspace",
    items: [
      { id: "keys", label: "API keys", icon: KeyRound, active: true },
      { id: "endpoints", label: "Endpoints", icon: Webhook },
      { id: "logs", label: "Request logs", icon: FileClock },
    ],
  },
  {
    heading: "Insights",
    items: [
      { id: "usage", label: "Usage", icon: ChartColumn },
      { id: "alerts", label: "Rate-limit alerts", icon: ShieldAlert },
    ],
  },
];

const WORKSPACES = ["Acme Commerce — Production", "Acme Commerce — Sandbox"];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex h-11 items-center gap-2 px-1">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
          <WavesHorizontal className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="truncate font-[family-name:var(--font-display-wide)] text-[16px] font-semibold text-zinc-900">
          Weir
        </span>
      </div>

      <div className="relative mt-5">
        <button
          type="button"
          onClick={() => setWorkspaceOpen((v) => !v)}
          aria-expanded={workspaceOpen}
          className={`${FOCUS} flex h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-left`}
        >
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{workspace}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />
        </button>
        {workspaceOpen && (
          <>
            <button
              type="button"
              aria-label="Close workspace switcher"
              onClick={() => setWorkspaceOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div
              role="menu"
              aria-label="Workspace switcher"
              className="absolute left-0 top-full z-50 mt-2 w-full min-w-0 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
            >
              {WORKSPACES.map((w) => (
                <button
                  key={w}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setWorkspace(w);
                    setWorkspaceOpen(false);
                  }}
                  className={`${FOCUS} flex w-full min-w-0 items-center rounded-lg px-3 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900`}
                >
                  <span className="min-w-0 flex-1 truncate">{w}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <nav aria-label="Primary" className="mt-6 flex min-w-0 flex-1 flex-col gap-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading} className="min-w-0 pb-4">
            <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
              {section.heading}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={item.active ? "page" : undefined}
                  onClick={onNavigate}
                  className={`${FOCUS} flex h-10 min-w-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                    item.active ? "bg-emerald-50 text-emerald-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative mt-2 border-t border-zinc-200 pt-4">
        <button
          type="button"
          onClick={() => setUserOpen((v) => !v)}
          aria-expanded={userOpen}
          className={`${FOCUS} flex h-11 w-full min-w-0 items-center gap-2.5 rounded-xl px-2 text-left hover:bg-zinc-50`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
            PS
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-900">Priya Shah</span>
            <span className="block truncate text-xs font-normal text-zinc-600">Platform engineer</span>
          </span>
        </button>
        {userOpen && (
          <>
            <button
              type="button"
              aria-label="Close account menu"
              onClick={() => setUserOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute bottom-full left-0 z-50 mb-2 w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900`}
              >
                <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                Account settings
              </button>
              <button
                type="button"
                role="menuitem"
                className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900`}
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/60 px-4 py-4 lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Close navigation menu" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className={`${FOCUS} absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900`}
        >
          <X className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
