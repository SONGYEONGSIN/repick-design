"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  KanbanSquare,
  ShieldCheck,
  FileWarning,
  FileCheck2,
  Building2,
  FileBarChart2,
  Settings,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { CURRENT_USER, WORKSPACES } from "../lib/data";
import { FOCUS_RING } from "./ui";

export const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "board", label: "Audit Board", icon: KanbanSquare },
  { id: "controls", label: "Controls", icon: ShieldCheck },
  { id: "findings", label: "Findings", icon: FileWarning },
  { id: "evidence", label: "Evidence", icon: FileCheck2 },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "reports", label: "Reports", icon: FileBarChart2 },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"] | "settings";

export function SidebarContent({
  activeSection,
  onNavigate,
  workspace,
  workspaceOpen,
  onToggleWorkspace,
  onSelectWorkspace,
}: {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  workspace: string;
  workspaceOpen: boolean;
  onToggleWorkspace: () => void;
  onSelectWorkspace: (w: string) => void;
}) {
  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="px-4 pt-5">
        <span
          className="text-lg font-semibold tracking-tight text-zinc-50"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Warden
        </span>

        <div className="relative mt-4">
          <button
            type="button"
            onClick={onToggleWorkspace}
            aria-haspopup="listbox"
            aria-expanded={workspaceOpen}
            className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-950/60 px-2.5 py-2 text-left ${FOCUS_RING}`}
          >
            <span className="min-w-0 truncate text-xs font-medium text-zinc-300">{workspace}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          </button>
          {workspaceOpen ? (
            <ul
              role="listbox"
              aria-label="Switch workspace"
              className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl"
            >
              {WORKSPACES.map((w) => (
                <li key={w}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={w === workspace}
                    onClick={() => onSelectWorkspace(w)}
                    className={`flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs ${FOCUS_RING} ${
                      w === workspace ? "text-emerald-300" : "text-zinc-300 hover:bg-white/5"
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
            const active = item.id === activeSection;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                    active ? "bg-emerald-400/15 text-emerald-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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
          aria-current={activeSection === "settings" ? "page" : undefined}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
            activeSection === "settings"
              ? "bg-emerald-400/15 text-emerald-300"
              : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          Settings
        </button>
      </nav>

      <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-3.5">
        <Image
          src={`https://images.unsplash.com/photo-${CURRENT_USER.photoId}?q=80&w=64&h=64&fit=crop&crop=faces`}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-50">{CURRENT_USER.name}</p>
          <p className="truncate text-[11px] text-zinc-400">{CURRENT_USER.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: Parameters<typeof SidebarContent>[0]) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-white/10 bg-zinc-950 lg:flex">
      <SidebarContent {...props} />
    </aside>
  );
}
