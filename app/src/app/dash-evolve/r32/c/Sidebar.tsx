"use client";

import { useRef, useState } from "react";
import {
  Workflow,
  LayoutGrid,
  GitBranch,
  Users,
  ShieldAlert,
  Settings,
  ChevronsUpDown,
  Check,
  LogOut,
  X,
} from "lucide-react";
import { cx, FOCUS_RING, useDismiss } from "./ui";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid, active: false },
  { id: "return-flow", label: "Return flow", icon: GitBranch, active: true },
  { id: "sellers", label: "Sellers", icon: Users, active: false },
  { id: "disputes", label: "Disputes", icon: ShieldAlert, active: false },
  { id: "settings", label: "Settings", icon: Settings, active: false },
] as const;

const WORKSPACES = ["repick — Ops (US)", "repick — Ops (EU)", "repick — Sandbox"] as const;

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState<(typeof WORKSPACES)[number]>(WORKSPACES[0]);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div ref={ref} className="relative px-3 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cx(
          "flex w-full items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left transition-colors hover:bg-zinc-50",
          FOCUS_RING,
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-white">
          <Workflow aria-hidden className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-zinc-900">{workspace}</span>
          <span className="block text-[11px] text-zinc-500">Workspace</span>
        </span>
        <ChevronsUpDown aria-hidden className="h-4 w-4 shrink-0 text-zinc-400" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Switch workspace"
          className="absolute left-3 right-3 top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {WORKSPACES.map((ws) => (
            <li key={ws}>
              <button
                type="button"
                role="option"
                aria-selected={ws === workspace}
                onClick={() => {
                  setWorkspace(ws);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-zinc-50",
                  FOCUS_RING,
                  ws === workspace ? "text-zinc-900" : "text-zinc-600",
                )}
              >
                <Check aria-hidden className={cx("h-3.5 w-3.5", ws === workspace ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{ws}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const nav = (
    <nav aria-label="Primary" className="flex-1 space-y-0.5 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.active ? "#main-content" : "#"}
            aria-current={item.active ? "page" : undefined}
            onClick={(e) => {
              if (!item.active) e.preventDefault();
              onCloseMobile();
            }}
            className={cx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
              FOCUS_RING,
              item.active ? "bg-amber-50 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
            )}
          >
            <Icon aria-hidden className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-zinc-200 p-3">
      <div className="flex items-center gap-3 rounded-lg px-1.5 py-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
          RO
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-900">Renata Osei</span>
          <span className="block truncate text-[11px] text-zinc-500">Returns operations</span>
        </span>
        <button
          type="button"
          aria-label="Log out"
          title="Log out"
          className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900", FOCUS_RING)}
        >
          <LogOut aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
        <WorkspaceSwitcher />
        {nav}
        {footer}
      </aside>

      <div className={cx("lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className={cx(
            "fixed inset-0 z-40 bg-zinc-900/30 transition-opacity motion-reduce:transition-none",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          tabIndex={mobileOpen ? 0 : -1}
        />
        <aside
          className={cx(
            "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white transition-transform duration-200 motion-reduce:transition-none",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!mobileOpen}
          inert={!mobileOpen}
        >
          <div className="flex items-center justify-between px-3 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Menu</span>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onCloseMobile}
              className={cx("flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100", FOCUS_RING)}
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
          <WorkspaceSwitcher />
          {nav}
          {footer}
        </aside>
      </div>
    </>
  );
}
