"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Building2,
  Check,
  ChevronsUpDown,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Plug,
  RotateCcw,
  Settings,
  Workflow,
  X,
} from "lucide-react";
import { FOCUS_RING } from "./ui";

const CURRENT_USER_NAME = "Jordan Avery";
const CURRENT_USER_ROLE = "Engineering Program Manager";
const CURRENT_USER_AVATAR_ID = "1472099645785-5658abf4ff4e";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, active: false },
  { label: "Handoff Flow", icon: Workflow, active: true },
  { label: "Sprint Reports", icon: FileBarChart, active: false },
  { label: "Rework Insights", icon: RotateCcw, active: false },
  { label: "Integrations", icon: Plug, active: false },
];

const WORKSPACES = ["Northwind Platform — Engineering", "Northwind Platform — Sandbox"];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative mt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full items-center gap-2 rounded-lg border border-zinc-200 px-3 text-left font-medium text-sm text-zinc-900 hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        <Building2 className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{WORKSPACES[index]}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute left-0 top-12 z-30 w-full rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
          {WORKSPACES.map((ws, i) => (
            <button
              key={ws}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-900 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              <span className="min-w-0 flex-1 truncate">{ws}</span>
              {i === index ? <Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BrandAndNav() {
  return (
    <div>
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
          <Workflow className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg leading-tight text-zinc-900 [font-family:var(--font-display-wide)]">Relay</p>
          <p className="truncate font-normal text-xs text-zinc-500">Handoff Intelligence</p>
        </div>
      </div>

      <WorkspaceSwitcher />

      <nav className="mt-4" aria-label="Primary">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                  item.active ? "bg-emerald-50 text-emerald-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function UserFooter() {
  return (
    <div className="mt-auto flex items-center gap-2.5 border-t border-zinc-200 px-2 pt-4">
      <Image
        src={`https://images.unsplash.com/photo-${CURRENT_USER_AVATAR_ID}?w=64&h=64&fit=crop&crop=faces`}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full bg-zinc-100 object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm text-zinc-900">{CURRENT_USER_NAME}</p>
        <p className="truncate font-normal text-xs text-zinc-500">{CURRENT_USER_ROLE}</p>
      </div>
      <button
        type="button"
        aria-label="Account settings"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function SidebarContent() {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <BrandAndNav />
      <div className="min-h-0 flex-1" />
      <UserFooter />
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-zinc-200 bg-white motion-safe:animate-[rise_200ms_ease-out]">
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-3">
          <p className="font-semibold text-sm text-zinc-900">Menu</p>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className={`flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
}

export function SignOutRow() {
  return (
    <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-900 hover:bg-zinc-50 ${FOCUS_RING}`}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </button>
  );
}

export { CURRENT_USER_AVATAR_ID, CURRENT_USER_NAME, CURRENT_USER_ROLE };
