"use client";

import {
  Activity,
  BarChart3,
  Building2,
  ChevronsUpDown,
  Headset,
  Inbox,
  LogOut,
  TriangleAlert,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Avatar } from "./ui";
import { PRODUCT_NAME, WORKSPACE_NAME } from "./data";

const NAV_ITEMS = [
  { href: "#overview", label: "Overview", icon: Activity, active: true },
  { href: "#channel-queue-card", label: "Queue", icon: Inbox },
  { href: "#agent-workload-card", label: "Agents", icon: Users },
  { href: "#escalations-card", label: "Escalations", icon: TriangleAlert },
  { href: "#automation-card", label: "Automation", icon: Zap },
  { href: "#sla-card", label: "Reports", icon: BarChart3 },
];

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[56px] items-center gap-2 border-b border-white/10 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500 text-zinc-950">
          <Headset className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-50">{PRODUCT_NAME}</span>
      </div>

      <button
        type="button"
        className="mx-3 mt-3 flex h-[44px] items-center gap-2 rounded-lg border border-white/10 bg-zinc-950 px-2.5 text-left transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-zinc-400">
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-100">{WORKSPACE_NAME}</span>
          <span className="block text-[11px] text-zinc-400">Workspace</span>
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>

      <nav aria-label="Primary" className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                item.active
                  ? "bg-sky-500/15 text-sky-200"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          <Avatar name="Jiwoo Choi" size={28} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-zinc-100">Jiwoo Choi</span>
            <span className="block truncate text-[11px] text-zinc-400">Operations Manager</span>
          </span>
          <LogOut className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-white/10 lg:bg-zinc-950">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-950/70"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-zinc-950">
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClickCapture={onCloseMobile}>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
