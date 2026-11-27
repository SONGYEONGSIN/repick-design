"use client";

import { useState } from "react";
import {
  Flame,
  LayoutDashboard,
  AlertCircle,
  Server,
  Users,
  Settings,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { FOCUS_RING } from "./ui";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "incidents", label: "Incidents", icon: AlertCircle },
  { id: "services", label: "Services", icon: Server },
  { id: "team", label: "On-call team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [activeNav, setActiveNav] = useState("overview");

  return (
    <div className="flex h-full flex-col">
      <div className={`flex h-11 items-center gap-2 rounded-lg px-1 ${FOCUS_RING}`}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-700 text-white">
          <Flame className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-zinc-900">Firebreak</span>
      </div>

      <button
        type="button"
        className={`mt-4 flex h-11 w-full shrink-0 items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 text-left transition-colors hover:bg-zinc-50 motion-reduce:transition-none ${FOCUS_RING}`}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-900">Northwind Retail</span>
          <span className="block truncate text-[11px] text-zinc-500">Production workspace</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
      </button>

      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                setActiveNav(item.id);
                onNavigate?.();
              }}
              className={`flex h-10 w-full items-center gap-2.5 rounded-full px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                isActive ? "bg-orange-50 text-orange-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className={`flex h-11 w-full shrink-0 items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 text-left transition-colors hover:bg-zinc-50 motion-reduce:transition-none ${FOCUS_RING}`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600">
          RK
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-900">Reyna Kade</span>
          <span className="block truncate text-[11px] text-zinc-500">Reliability lead</span>
        </span>
      </button>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-zinc-200 bg-white p-4 lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40 motion-reduce:transition-none"
      />
      <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className={`flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
