"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Siren,
  Boxes,
  GitBranch,
  PhoneCall,
  Wallet,
  ChevronsUpDown,
  Check,
  X,
} from "lucide-react";
import { FOCUS_RING } from "./ui";
import { CURRENT_USER } from "./data";

export type NavId = "overview" | "incidents" | "services" | "deploys" | "oncall" | "cost";

const NAV_ITEMS: { id: NavId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "incidents", label: "Incidents", icon: Siren },
  { id: "services", label: "Services", icon: Boxes },
  { id: "deploys", label: "Deploys", icon: GitBranch },
  { id: "oncall", label: "On-call", icon: PhoneCall },
  { id: "cost", label: "Cost", icon: Wallet },
];

const WORKSPACES = ["Thrum — Production", "Thrum — Staging"];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex h-11 w-full items-center gap-2 rounded-lg px-2 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[10px] font-semibold text-zinc-600">
          {workspace.includes("Staging") ? "ST" : "PR"}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700">{workspace}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Switch workspace"
          className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
        >
          {WORKSPACES.map((w) => (
            <li key={w}>
              <button
                type="button"
                role="option"
                aria-selected={w === workspace}
                onClick={() => {
                  setWorkspace(w);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <span className="min-w-0 flex-1 truncate">{w}</span>
                {w === workspace && <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-600" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Shared between the desktop `<aside>` and the mobile drawer. */
export function SidebarContent({
  active,
  onNavigate,
  onClose,
}: {
  active: NavId;
  onNavigate: (id: NavId) => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <div className="flex h-11 flex-shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex h-11 min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-green-600 text-xs font-bold text-white">
            T
          </span>
          <p
            className="truncate text-base font-semibold leading-none text-zinc-900"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Thrum
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex-shrink-0 border-b border-zinc-200 px-3 pb-3">
        <WorkspaceSwitcher />
      </div>
      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    const el = document.getElementById(`section-${item.id}`);
                    el?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
                    onClose?.();
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors duration-150 ease-out ${FOCUS_RING} ${
                    isActive ? "bg-green-50 text-green-800" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="flex flex-shrink-0 items-center gap-2.5 border-t border-zinc-200 px-4 py-4">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600">
          JA
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium leading-none text-zinc-900">{CURRENT_USER.name}</p>
          <p className="mt-1 truncate text-xs font-normal leading-none text-zinc-500">{CURRENT_USER.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ active, onNavigate }: { active: NavId; onNavigate: (id: NavId) => void }) {
  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
      <SidebarContent active={active} onNavigate={onNavigate} />
    </aside>
  );
}

export function MobileDrawer({
  open,
  active,
  onNavigate,
  onClose,
}: {
  open: boolean;
  active: NavId;
  onNavigate: (id: NavId) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Mouse-only backdrop dismiss; Escape (handled by the page) and the visible close button
          inside the drawer are the keyboard equivalents, so this stays out of the tab order. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />
      <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-white shadow-xl">
        <SidebarContent active={active} onNavigate={onNavigate} onClose={onClose} />
      </aside>
    </div>
  );
}
