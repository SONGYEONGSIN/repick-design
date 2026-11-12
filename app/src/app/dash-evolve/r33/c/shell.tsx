"use client";

/**
 * App shell: left sidebar (brand + workspace switcher + nav + user) and top
 * bar (search/⌘K, primary action, notifications, avatar menu). Mobile
 * collapses the sidebar into a drawer. All top-bar controls are 44px tall.
 */

import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Bell,
  Building2,
  Download,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { IconButton, MenuItem, Popover, SelectMenu } from "./ui";
import { CommandPalette, type PaletteCommand } from "./command-palette";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "growth", label: "Growth", icon: TrendingUp },
  { id: "funnels", label: "Funnel reports", icon: GitBranch },
  { id: "cohorts", label: "Cohorts", icon: Users },
  { id: "segments", label: "Segments", icon: Target },
  { id: "experiments", label: "Experiments", icon: FlaskConical },
] as const;

type WorkspaceId = "growth" | "product" | "revenue";

const WORKSPACES: { value: WorkspaceId; label: string }[] = [
  { value: "growth", label: "Growth" },
  { value: "product", label: "Product" },
  { value: "revenue", label: "Revenue" },
];

const NOTIFICATIONS = [
  { id: "n1", title: "Paid → retained drop improved", detail: "Churn reasons refreshed for this period." },
  { id: "n2", title: "Weekly growth digest ready", detail: "Visitor trend is up 6.1% week over week." },
  { id: "n3", title: "New cohort export", detail: "Signups → Activated breakdown exported by Priya." },
];

function NavLink({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  const Icon = item.icon;
  return (
    <a
      href="#main-content"
      aria-current={active ? "page" : undefined}
      className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
        active ? "bg-violet-500/15 text-violet-200" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
      {item.label}
    </a>
  );
}

function SidebarContent({ workspace, onWorkspaceChange }: { workspace: WorkspaceId; onWorkspaceChange: (w: WorkspaceId) => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
          <ShieldCheck className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="text-[17px] font-bold text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          Arcway
        </span>
      </div>

      <div className="px-3">
        <SelectMenu
          ariaLabel="Switch workspace"
          triggerLabel="Workspace"
          value={workspace}
          options={WORKSPACES}
          onChange={onWorkspaceChange}
        />
      </div>

      <nav aria-label="Primary" className="mt-5 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.id} item={item} active={item.id === "growth"} />
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Popover
          align="left"
          trigger={({ triggerProps }) => (
            <button
              {...triggerProps}
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces"
                alt="Portrait of Priya Desai, Growth lead"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-100">Priya Desai</span>
                <span className="block truncate text-xs text-zinc-400">Growth lead</span>
              </span>
            </button>
          )}
        >
          {({ close }) => (
            <>
              <MenuItem icon={Building2} onClick={close}>
                Workspace settings
              </MenuItem>
              <MenuItem icon={Settings} onClick={close}>
                Preferences
              </MenuItem>
              <MenuItem icon={LogOut} onClick={close}>
                Log out
              </MenuItem>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
}

export function Shell({ children, paletteCommands }: { children: ReactNode; paletteCommands: PaletteCommand[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceId>("growth");

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-200"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-900/60 lg:block">
        <SidebarContent workspace={workspace} onWorkspaceChange={setWorkspace} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label="Navigation" className="relative h-full w-72 bg-zinc-900 shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <SidebarContent workspace={workspace} onWorkspaceChange={setWorkspace} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-zinc-950/80 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 lg:hidden"
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden />
          </button>

          <CommandPalette commands={paletteCommands} />

          <div className="ml-auto flex items-center gap-2.5">
            <button
              type="button"
              className="hidden h-11 items-center gap-2 rounded-lg bg-violet-600 px-3.5 text-sm font-medium text-white hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 sm:flex"
            >
              <Download className="h-4 w-4" aria-hidden />
              Export report
            </button>

            <Popover
              align="right"
              trigger={({ triggerProps }) => (
                <button
                  {...triggerProps}
                  type="button"
                  aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  <Bell className="h-[18px] w-[18px]" aria-hidden />
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-medium tabular-nums text-white">
                    {NOTIFICATIONS.length}
                  </span>
                </button>
              )}
              panelClassName="w-72"
            >
              {() => (
                <div className="flex flex-col">
                  <p className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Notifications</p>
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="rounded-lg px-2.5 py-2 hover:bg-white/5">
                      <p className="text-sm font-medium text-zinc-100">{n.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">{n.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </Popover>

            <IconButton icon={Settings} label="Settings" />
          </div>
        </header>

        <main id="main-content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
