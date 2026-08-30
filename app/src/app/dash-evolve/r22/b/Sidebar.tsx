"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Network,
  LayoutGrid,
  TriangleAlert,
  CloudUpload,
  Bell,
  Settings,
  ChevronsUpDown,
  Check,
  X,
} from "lucide-react";

const WORKSPACES = ["Platform Team", "Payments Squad", "Data Platform"];

const NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Service Graph", icon: Network, active: true },
  { label: "Incidents", icon: TriangleAlert, active: false },
  { label: "Deployments", icon: CloudUpload, active: false },
  { label: "Alerts", icon: Bell, active: false },
  { label: "Settings", icon: Settings, active: false },
];

function SidebarInner() {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
          <Network size={17} aria-hidden="true" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-900">Nodeline</span>
      </div>

      <div className="relative border-b border-zinc-200 px-3 py-3">
        <button
          type="button"
          onClick={() => setSwitcherOpen((v) => !v)}
          aria-expanded={switcherOpen}
          aria-haspopup="listbox"
          className="flex h-11 w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          <span className="min-w-0 truncate text-sm font-medium text-zinc-800">{workspace}</span>
          <ChevronsUpDown size={15} className="shrink-0 text-zinc-500" aria-hidden="true" />
        </button>
        {switcherOpen && (
          <>
            <button
              type="button"
              aria-label="Close workspace menu"
              onClick={() => setSwitcherOpen(false)}
              className="fixed inset-0 z-30 cursor-default"
            />
            <ul
              role="listbox"
              aria-label="Workspaces"
              className="absolute left-3 right-3 top-[calc(100%+4px)] z-40 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-md"
            >
              {WORKSPACES.map((w) => (
                <li key={w}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={w === workspace}
                    onClick={() => {
                      setWorkspace(w);
                      setSwitcherOpen(false);
                    }}
                    className="flex h-9 w-full items-center justify-between px-3 text-sm text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:bg-zinc-50"
                  >
                    {w}
                    {w === workspace && <Check size={14} className="text-teal-700" aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {NAV.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#main-content"
            aria-current={active ? "page" : undefined}
            className={[
              "flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
              active ? "bg-teal-50 text-teal-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
            ].join(" ")}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-zinc-200 px-4 py-3">
        <Image
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&auto=format"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-800">Jordan Vale</p>
          <p className="truncate text-xs text-zinc-500">SRE, Platform</p>
        </div>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <div className="hidden lg:block">
      <SidebarInner />
    </div>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div className="relative h-full w-64 max-w-[80vw] shadow-xl">
        <SidebarInner />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-700"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
