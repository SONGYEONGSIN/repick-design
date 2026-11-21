"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Hash,
  Activity,
  Users,
  Bell,
  Building2,
  ChevronDown,
  User,
  CreditCard,
  LogOut,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { NAV_SECTIONS, WORKSPACES, type NavItem } from "./data";
import { Avatar } from "./ui";
import { Dropdown, DropdownItem } from "./dropdown";

const NAV_ICON: Record<string, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  reviews: MessageSquare,
  "word-trends": Hash,
  sentiment: Activity,
  competitors: Users,
  alerts: Bell,
};

const ACTIVE_KEY = "word-trends";

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1 px-3">
      {items.map((item) => {
        const Icon = NAV_ICON[item.key] ?? LayoutDashboard;
        const active = item.key === ACTIVE_KEY;
        return (
          <a
            key={item.key}
            href="#"
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.();
            }}
            className={`flex h-10 items-center gap-3 rounded-full px-3 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
              active
                ? "bg-emerald-500/15 text-emerald-300"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function WorkspaceSwitcher() {
  return (
    <Dropdown
      label="Switch workspace"
      panelClassName="w-56"
      trigger={({ onClick, expanded }) => (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={expanded}
          aria-haspopup="true"
          className="flex h-11 w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <Building2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="flex-1 truncate text-sm font-medium text-zinc-50">{WORKSPACES[0]}</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
        </button>
      )}
    >
      {WORKSPACES.map((ws) => (
        <DropdownItem key={ws} icon={<Building2 className="h-4 w-4" />}>
          {ws}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

function UserMenu() {
  return (
    <Dropdown
      label="User menu"
      panelClassName="w-52"
      align="left"
      trigger={({ onClick, expanded }) => (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={expanded}
          aria-haspopup="true"
          className="flex h-11 w-full items-center gap-2 rounded-lg px-2 text-left hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <Avatar initials="JK" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-50">Jordan Kim</span>
            <span className="block truncate text-xs font-normal text-zinc-400">Product Analyst</span>
          </span>
        </button>
      )}
    >
      <DropdownItem icon={<User className="h-4 w-4" />}>Profile</DropdownItem>
      <DropdownItem icon={<CreditCard className="h-4 w-4" />}>Billing</DropdownItem>
      <DropdownItem icon={<LogOut className="h-4 w-4" />}>Log out</DropdownItem>
    </Dropdown>
  );
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onMobileClose]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-white/10 bg-zinc-950 lg:flex">
        <SidebarInner onNavigate={undefined} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        {/* Click-to-dismiss convenience only; Escape and the X button cover
            keyboard users, so this stays out of the tab order. */}
        <div
          aria-hidden="true"
          onClick={onMobileClose}
          className={`absolute inset-0 bg-zinc-950/70 transition-opacity motion-reduce:transition-none ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-zinc-950 transition-transform motion-reduce:transition-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-end px-3">
            <button
              type="button"
              onClick={onMobileClose}
              tabIndex={mobileOpen ? 0 : -1}
              aria-label="Close navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <SidebarInner onNavigate={onMobileClose} tabbable={mobileOpen} />
        </aside>
      </div>
    </>
  );
}

function SidebarInner({
  onNavigate,
  tabbable = true,
}: {
  onNavigate?: () => void;
  tabbable?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-6 py-4" inert={tabbable ? undefined : true}>
      <div className="flex items-center gap-2 px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-zinc-950">
          V
        </span>
        <span className="text-base font-bold tracking-tight text-zinc-50">Verbatim</span>
      </div>
      <div className="px-3">
        <WorkspaceSwitcher />
      </div>
      <div className="flex-1 overflow-y-auto">
        <p className="px-6 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Workspace
        </p>
        <NavList items={NAV_SECTIONS} onNavigate={onNavigate} />
      </div>
      <div className="border-t border-white/10 px-3 pt-3">
        <UserMenu />
      </div>
    </div>
  );
}
