"use client";

import { useRef, useState } from "react";
import {
  BarChart3,
  BellRing,
  ChevronDown,
  Contact,
  FileCheck2,
  LayoutGrid,
  LogOut,
  MapPinned,
  Route,
  Settings,
  Truck,
  User,
  X,
} from "lucide-react";
import { NAV_SECTIONS, WORKSPACES } from "./data";
import { cx, useDismissable } from "./ui";

const ICONS = {
  "layout-grid": LayoutGrid,
  truck: Truck,
  "bell-ring": BellRing,
  "map-pinned": MapPinned,
  contact: Contact,
  "file-check-2": FileCheck2,
  "bar-chart-3": BarChart3,
  settings: Settings,
} as const;

function SidebarBody({ workspace, setWorkspace }: { workspace: string; setWorkspace: (w: string) => void }) {
  const [wsOpen, setWsOpen] = useState(false);
  const wsRef = useRef<HTMLDivElement>(null);
  useDismissable(wsOpen, () => setWsOpen(false), wsRef);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3f9c90]/15 text-[#8fcdc2]">
          <Route className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <span
          className="text-[16px] font-semibold tracking-tight text-zinc-50"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          Routeline
        </span>
      </div>

      <div ref={wsRef} className="relative shrink-0 border-b border-white/10 p-3">
        <button
          type="button"
          onClick={() => setWsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={wsOpen}
          className={cx(
            "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
          )}
        >
          <span className="min-w-0">
            <span className="block truncate text-[12.5px] font-medium text-zinc-50">{workspace}</span>
            <span className="block text-[11px] font-normal text-zinc-400">Workspace</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
        {wsOpen ? (
          <ul role="listbox" aria-label="Switch workspace" className="absolute left-3 right-3 top-[calc(100%-4px)] z-20 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-lg">
            {WORKSPACES.map((w) => (
              <li key={w} role="option" aria-selected={w === workspace}>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspace(w);
                    setWsOpen(false);
                  }}
                  className={cx(
                    "block w-full px-3 py-2.5 text-left text-[12.5px] font-normal",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6cc0b3]",
                    w === workspace ? "bg-white/10 text-zinc-50" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
                  )}
                >
                  {w}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">{section.label}</p>
            <div className="mt-1.5 space-y-0.5">
              {section.items.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-current={item.active ? "page" : undefined}
                    className={cx(
                      "flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-normal transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]",
                      item.active ? "bg-[#3f9c90]/15 font-medium text-[#8fcdc2]" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          className={cx(
            "flex h-12 w-full items-center gap-2.5 rounded-lg px-2.5 text-left",
            "hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-medium text-zinc-50">Ava Birchall</span>
            <span className="block truncate text-[11px] font-normal text-zinc-400">Network operations</span>
          </span>
          <LogOut className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({
  workspace,
  setWorkspace,
  mobileOpen,
  onCloseMobile,
}: {
  workspace: string;
  setWorkspace: (w: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-950 lg:block">
        <SidebarBody workspace={workspace} setWorkspace={setWorkspace} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-950/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6cc0b3]"
          />
          <div className="relative flex h-full w-72 flex-col bg-zinc-950 shadow-xl">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation"
              className={cx(
                "absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
              )}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <SidebarBody workspace={workspace} setWorkspace={setWorkspace} />
          </div>
        </div>
      ) : null}
    </>
  );
}
