"use client";

import { useEffect, useRef, useState } from "react";
import {
  Anchor,
  Building2,
  Check,
  ChevronsUpDown,
  Gauge,
  LayoutDashboard,
  LogOut,
  Plug,
  Radio,
  Settings,
  X,
} from "lucide-react";
import { FOCUS_RING, Avatar } from "./ui";
import { CURRENT_USER } from "./data";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, active: false },
  { label: "Incident Feed", icon: Radio, active: true },
  { label: "Error Budgets", icon: Gauge, active: false },
  { label: "Integrations", icon: Plug, active: false },
];

const WORKSPACES = ["Keelwatch — Core Platform", "Keelwatch — Staging Fleet"];

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
    <div ref={wrapRef} className="relative mt-4 min-w-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-white/10 px-3 text-left font-medium text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
      >
        <Building2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{WORKSPACES[index]}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute left-0 top-12 z-30 w-full min-w-0 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          {WORKSPACES.map((ws, i) => (
            <button
              key={ws}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(false);
              }}
              className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
            >
              <span className="min-w-0 flex-1 truncate">{ws}</span>
              {i === index ? <Check className="h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BrandAndNav() {
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white">
          <Anchor className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg leading-tight text-zinc-50 [font-family:var(--font-display-wide)]">Keelwatch</p>
          <p className="truncate font-normal text-xs text-zinc-400">Reliability Command</p>
        </div>
      </div>

      <WorkspaceSwitcher />

      <nav className="mt-4 min-w-0" aria-label="Primary">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="min-w-0">
              <button
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex h-10 w-full min-w-0 items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                  item.active ? "bg-rose-500/10 text-rose-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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
    <div className="mt-auto flex min-w-0 items-center gap-2.5 border-t border-white/10 px-2 pt-4">
      <Avatar name={CURRENT_USER.name} avatarId={CURRENT_USER.avatarId} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
        <p className="truncate font-normal text-xs text-zinc-400">{CURRENT_USER.role}</p>
      </div>
      <button
        type="button"
        aria-label="Account settings"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function SidebarContent() {
  return (
    <div className="flex h-full w-full min-w-0 flex-col px-3 py-4">
      <BrandAndNav />
      <div className="min-h-0 flex-1" />
      <UserFooter />
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-950 lg:flex">
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
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950 motion-safe:animate-[rise_200ms_ease-out]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <p className="font-semibold text-sm text-zinc-50">Menu</p>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className={`flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
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
    <button
      type="button"
      className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </button>
  );
}
