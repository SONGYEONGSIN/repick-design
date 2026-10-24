"use client";

import { Activity, ChevronsUpDown, Globe, LayoutGrid, LogOut, Map as MapIcon, TableProperties, User, X } from "lucide-react";
import { useState } from "react";
import { BORDER, FOCUS, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { useOutsideClose } from "./ui";

const NAV = [
  { href: "#top", label: "Overview", Icon: LayoutGrid, active: true },
  { href: "#feed", label: "Activity feed", Icon: Activity, active: false },
  { href: "#map", label: "Region map", Icon: MapIcon, active: false },
  { href: "#region-table", label: "Region stats", Icon: TableProperties, active: false },
];

const WORKSPACES = ["Northwind Cloud", "Northwind Cloud — Staging"];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const ref = useOutsideClose(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cx(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-2.5 text-xs",
          BORDER,
          TRANSITION,
          FOCUS,
          "hover:bg-white/5",
        )}
      >
        <span className={cx("truncate font-medium", TEXT_PRIMARY)}>{workspace}</span>
        <ChevronsUpDown size={13} aria-hidden="true" className={cx(TEXT_AUX, "shrink-0")} />
      </button>
      {open ? (
        <div role="listbox" aria-label="Switch workspace" className={cx("absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-lg border bg-zinc-900 py-1 shadow-lg shadow-black/40", BORDER)}>
          {WORKSPACES.map((w) => (
            <button
              key={w}
              type="button"
              role="option"
              aria-selected={w === workspace}
              onClick={() => {
                setWorkspace(w);
                setOpen(false);
              }}
              className={cx("block w-full truncate px-2.5 py-1.5 text-left text-xs", TRANSITION, FOCUS, w === workspace ? "text-sky-300" : cx(TEXT_AUX, "hover:text-zinc-50"))}
            >
              {w}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cx("flex h-10 w-full items-center gap-2.5 rounded-lg px-2 text-left", TRANSITION, FOCUS, "hover:bg-white/5")}
      >
        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-[11px] font-semibold text-sky-300">
          RS
        </span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-xs font-medium", TEXT_PRIMARY)}>Reese Shin</span>
          <span className={cx("block truncate text-[11px]", TEXT_AUX)}>Platform on-call</span>
        </span>
        <ChevronsUpDown size={13} aria-hidden="true" className={cx(TEXT_AUX, "shrink-0")} />
      </button>
      {open ? (
        <div role="menu" aria-label="Account" className={cx("absolute inset-x-0 bottom-full z-30 mb-1.5 overflow-hidden rounded-lg border bg-zinc-900 py-1 shadow-lg shadow-black/40", BORDER)}>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={cx("flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs", TEXT_AUX, TRANSITION, FOCUS, "hover:text-zinc-50")}>
            <User size={13} aria-hidden="true" /> Profile
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={cx("flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs", TEXT_AUX, TRANSITION, FOCUS, "hover:text-zinc-50")}>
            <LogOut size={13} aria-hidden="true" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className={cx("flex h-11 items-center gap-2 border-b px-4", BORDER)}>
        <Globe size={18} aria-hidden="true" className="text-sky-400" />
        <span className="text-[17px] font-semibold tracking-tight text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          Isobar
        </span>
      </div>

      <div className="px-3 pt-3">
        <WorkspaceSwitcher />
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
        <p className={cx("px-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Monitor</p>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.Icon;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={cx(
                    "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm",
                    TRANSITION,
                    FOCUS,
                    item.active ? "bg-sky-400/10 font-semibold text-sky-300" : cx("font-normal", TEXT_AUX, "hover:bg-white/5 hover:text-zinc-50"),
                  )}
                >
                  <Icon size={15} aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={cx("border-t p-2", BORDER)}>
        <UserMenu />
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className={cx("hidden w-64 shrink-0 border-r lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex", BORDER, "bg-zinc-950")}>
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={onCloseMobile} className="absolute inset-0 bg-black/60" />
          <div className={cx("absolute inset-y-0 left-0 w-72 border-r bg-zinc-950", BORDER)}>
            <div className="absolute right-2 top-2">
              <button type="button" onClick={onCloseMobile} aria-label="Close navigation" className={cx("flex h-9 w-9 items-center justify-center rounded-lg", TRANSITION, FOCUS, "hover:bg-white/10")}>
                <X size={16} aria-hidden="true" className={TEXT_AUX} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      ) : null}
    </>
  );
}
