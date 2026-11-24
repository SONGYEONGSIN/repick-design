"use client";

import { Briefcase, Check, ChevronsUpDown, LayoutDashboard, Scale, Settings, Users } from "lucide-react";
import { CURRENT_USER, WORKSPACES } from "../lib/data";
import { FOCUS_RING, InitialsAvatar } from "./ui";

export const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "headcount", label: "Headcount", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: Briefcase },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"] | "settings";

interface SidebarProps {
  activeNav: NavId;
  onNavigate: (id: NavId) => void;
  workspace: string;
  workspaceOpen: boolean;
  onToggleWorkspace: () => void;
  onSelectWorkspace: (w: string) => void;
}

export function SidebarContent({
  activeNav,
  onNavigate,
  workspace,
  workspaceOpen,
  onToggleWorkspace,
  onSelectWorkspace,
}: SidebarProps) {
  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="px-4 pt-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-zinc-950">
            <Scale className="h-4 w-4" aria-hidden="true" />
          </span>
          <span style={{ fontFamily: "var(--font-display-grotesk)" }} className="text-lg font-semibold tracking-tight text-zinc-50">
            Fulcrum
          </span>
        </div>

        <div className="relative mt-4">
          <button
            type="button"
            onClick={onToggleWorkspace}
            aria-haspopup="listbox"
            aria-expanded={workspaceOpen}
            className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-left ${FOCUS_RING}`}
          >
            <span className="min-w-0 truncate text-xs font-medium text-zinc-300">{workspace}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          </button>
          {workspaceOpen ? (
            <ul role="listbox" aria-label="Switch workspace entity" className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-2xl">
              {WORKSPACES.map((w) => (
                <li key={w}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={w === workspace}
                    onClick={() => onSelectWorkspace(w)}
                    className={`flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs ${FOCUS_RING} ${
                      w === workspace ? "bg-lime-400/10 text-lime-300" : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="min-w-0 truncate">{w}</span>
                    {w === workspace ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <nav aria-label="Primary" className="mt-5 flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeNav;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                    active ? "bg-lime-400/10 text-lime-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="my-3 border-t border-white/10" />

        <button
          type="button"
          onClick={() => onNavigate("settings")}
          aria-current={activeNav === "settings" ? "page" : undefined}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
            activeNav === "settings" ? "bg-lime-400/10 text-lime-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          Settings
        </button>
      </nav>

      <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-3.5">
        <InitialsAvatar initials={CURRENT_USER.initials} name={CURRENT_USER.name} />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-100">{CURRENT_USER.name}</p>
          <p className="truncate text-[11px] text-zinc-400">{CURRENT_USER.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-white/10 bg-zinc-950 lg:flex">
      <SidebarContent {...props} />
    </aside>
  );
}
