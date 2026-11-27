"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronsUpDown,
  Handshake,
  Headphones,
  LogOut,
  PhoneCall,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";
import { FOCUS } from "./ui";

type NavItem = { id: string; label: string; icon: typeof Headphones; active?: boolean };

const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Workspace",
    items: [
      { id: "calls", label: "Calls", icon: Headphones, active: true },
      { id: "deals", label: "Deals", icon: Handshake },
      { id: "playbooks", label: "Playbooks", icon: BookOpen },
    ],
  },
  {
    heading: "Insights",
    items: [{ id: "trends", label: "Trends", icon: TrendingUp }],
  },
];

const WORKSPACES = ["Nordlight Revenue Team", "Partner Channel"];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex h-11 items-center gap-2 px-1">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-400 text-zinc-950">
          <PhoneCall className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="truncate font-[family-name:var(--font-display-grotesk)] text-[15px] font-semibold text-zinc-50">
          Clearcall
        </span>
      </div>

      <div className="relative mt-5">
        <button
          type="button"
          onClick={() => setWorkspaceOpen((v) => !v)}
          aria-expanded={workspaceOpen}
          className={`${FOCUS} flex h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-left`}
        >
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-50">{workspace}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
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
              className="absolute left-0 top-full z-50 mt-2 w-full min-w-0 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/50"
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
                  className={`${FOCUS} flex w-full min-w-0 items-center rounded-lg px-3 py-2 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
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
            <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
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
                    item.active ? "bg-sky-400/15 text-sky-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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

      <div className="relative mt-2 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setUserOpen((v) => !v)}
          aria-expanded={userOpen}
          className={`${FOCUS} flex h-11 w-full min-w-0 items-center gap-2.5 rounded-xl px-2 text-left hover:bg-white/5`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-zinc-50">
            RK
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-50">Rhea Kallas</span>
            <span className="block truncate text-xs font-normal text-zinc-400">Revenue ops lead</span>
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
              className="absolute bottom-full left-0 z-50 mb-2 w-56 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/50"
            >
              <button
                type="button"
                role="menuitem"
                className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
              >
                <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                Account settings
              </button>
              <button
                type="button"
                role="menuitem"
                className={`${FOCUS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
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
          className={`${FOCUS} absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50`}
        >
          <X className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
