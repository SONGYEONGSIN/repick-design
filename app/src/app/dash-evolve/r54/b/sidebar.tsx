"use client";

import { Boxes, Check, ChevronsUpDown, History, LogOut, Plug, Rocket, ShieldCheck, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { BRAND, CURRENT_USER, NAV_ITEMS, WORKSPACES } from "./data";
import { ACCENT_SUBTLE, BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, useOutsideClose } from "./ui";

const NAV_ICON: Record<string, LucideIcon> = { Rocket, Boxes, ShieldCheck, History, Plug };

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [ws, setWs] = useState(WORKSPACES[0]);
  const ref = useOutsideClose(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative px-3 pt-3">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex h-11 w-full items-center gap-2 rounded-xl border px-2.5 text-left", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
      >
        <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold", ACCENT_SUBTLE)}>{ws.name.slice(0, 1)}</span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{ws.name}</span>
          <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{ws.meta}</span>
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" className={TEXT_CAPTION} />
      </button>

      {open ? (
        <div role="listbox" aria-label="Select workspace" className={cx("absolute left-3 right-3 top-full z-40 mt-1.5 overflow-hidden rounded-xl border bg-zinc-900 p-1 shadow-lg shadow-black/50", BORDER)}>
          {WORKSPACES.map((w) => {
            const selected = w.id === ws.id;
            return (
              <button
                key={w.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setWs(w);
                  setOpen(false);
                }}
                className={cx("flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{w.name}</span>
                  <span className={cx("truncate text-xs", TEXT_CAPTION)}>{w.meta}</span>
                </span>
                {selected ? <Check size={14} aria-hidden="true" className="shrink-0 text-cyan-400" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 px-4">
        <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-400/15">
          <Rocket size={15} className="text-cyan-300" />
        </span>
        <span className="text-[17px] font-semibold tracking-tight text-zinc-50" style={{ fontFamily: "var(--font-display-wide)" }}>
          {BRAND.name}
        </span>
      </div>

      <WorkspaceSwitcher />

      <nav aria-label="Primary" className="mt-4 flex-1 overflow-y-auto px-3 [scrollbar-width:thin]">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICON[item.icon];
            const active = item.id === "deployments";
            return (
              <li key={item.id}>
                <a
                  href="#main-content"
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium",
                    TRANSITION,
                    FOCUS_RING,
                    active ? "bg-cyan-400/15 text-cyan-300" : cx(TEXT_CAPTION, HOVER_ACTIVE_BG, "hover:text-zinc-50"),
                  )}
                >
                  <Icon size={16} aria-hidden="true" className="shrink-0" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={cx("flex items-center gap-2.5 border-t px-3 py-3", BORDER)}>
        <Avatar initials={CURRENT_USER.initials} name={CURRENT_USER.name} size={32} />
        <div className="min-w-0 flex-1">
          <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
          <p className={cx("truncate text-xs", TEXT_CAPTION)}>{CURRENT_USER.role}</p>
        </div>
        <button type="button" aria-label="Sign out" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", TEXT_CAPTION, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
          <LogOut size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className={cx("hidden w-60 shrink-0 border-r lg:flex", BORDER, "bg-zinc-950")}>
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="presentation">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
          <div role="dialog" aria-modal="true" aria-label="Navigation" className={cx("relative flex h-full w-72 max-w-[85vw] flex-col border-r", BORDER, "bg-zinc-950")}>
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation"
              className={cx("absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-lg", TEXT_CAPTION, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
            >
              <X size={16} aria-hidden="true" />
            </button>
            <SidebarContent />
          </div>
        </div>
      ) : null}
    </>
  );
}
