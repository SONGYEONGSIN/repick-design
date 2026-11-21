"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, LayoutDashboard, LifeBuoy, Ticket as TicketIcon, Users, X } from "lucide-react";
import Image from "next/image";
import { avatarUrl } from "./data";
import { ACCENT, FOCUS_RING, TEXT } from "./tokens";
import { Popover, PopoverItem } from "./ui";

export type NavSection = "overview" | "tickets" | "teams" | "reports";

const NAV_ITEMS: { id: NavSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tickets", label: "Ticket activity", icon: TicketIcon },
  { id: "teams", label: "Team resolution times", icon: Users },
  { id: "reports", label: "SLA pulse", icon: LifeBuoy },
];

function NavList({ activeNav, onNavigate }: { activeNav: NavSection; onNavigate: (id: NavSection) => void }) {
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeNav;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate(item.id)}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${FOCUS_RING} ${
              active ? `${ACCENT.bgSoft} ${ACCENT.text}` : `${TEXT.muted} hover:bg-white/5 hover:text-zinc-50`
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function WorkspaceSwitcher({ workspace, onChange }: { workspace: string; onChange: (w: string) => void }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const workspaces = ["repick Support — Global", "repick Support — EU"];

  return (
    <div className="relative px-3 pb-3">
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-left text-sm font-medium ${TEXT.primary} ${FOCUS_RING}`}
      >
        <span className="truncate">{workspace}</span>
        <ChevronsUpDown aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} align="start" label="Switch workspace">
        {workspaces.map((w) => (
          <PopoverItem key={w} onClick={() => { onChange(w); setOpen(false); }}>
            {w}
          </PopoverItem>
        ))}
      </Popover>
    </div>
  );
}

export function Sidebar({
  activeNav,
  onNavigate,
  workspace,
  onChangeWorkspace,
}: {
  activeNav: NavSection;
  onNavigate: (id: NavSection) => void;
  workspace: string;
  onChangeWorkspace: (w: string) => void;
}) {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${ACCENT.fill}`}>
          <LifeBuoy aria-hidden="true" className={`h-4 w-4 ${ACCENT.onFill}`} />
        </span>
        <span className={`text-sm font-semibold ${TEXT.primary}`}>Ridgehaul</span>
      </div>
      <WorkspaceSwitcher workspace={workspace} onChange={onChangeWorkspace} />
      <div className="mt-2 flex-1 overflow-y-auto">
        <NavList activeNav={activeNav} onNavigate={onNavigate} />
      </div>
      <div className="flex items-center gap-2.5 border-t border-white/10 px-5 py-4">
        <Image src={avatarUrl("sam-okafor")} alt="Sam Okafor" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${TEXT.primary}`}>Sam Okafor</p>
          <p className={`truncate text-xs ${TEXT.muted}`}>Escalations Lead</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileDrawer({
  open,
  onClose,
  activeNav,
  onNavigate,
  workspace,
  onChangeWorkspace,
}: {
  open: boolean;
  onClose: () => void;
  activeNav: NavSection;
  onNavigate: (id: NavSection) => void;
  workspace: string;
  onChangeWorkspace: (w: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} role="presentation" />
      <div role="dialog" aria-modal="true" aria-label="Navigation" className="absolute inset-y-0 left-0 flex w-72 flex-col bg-zinc-950 shadow-2xl">
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${ACCENT.fill}`}>
              <LifeBuoy aria-hidden="true" className={`h-4 w-4 ${ACCENT.onFill}`} />
            </span>
            <span className={`text-sm font-semibold ${TEXT.primary}`}>Ridgehaul</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${TEXT.muted} hover:bg-white/5 ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <WorkspaceSwitcher workspace={workspace} onChange={onChangeWorkspace} />
        <div className="mt-2 flex-1 overflow-y-auto">
          <NavList
            activeNav={activeNav}
            onNavigate={(id) => {
              onNavigate(id);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
