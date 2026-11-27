"use client";

import { CalendarCheck2, ChevronsUpDown, Check, X, LogOut, Rows3, LayoutGrid, Building2, Settings } from "lucide-react";
import { TRIALS, type TrialId } from "./data";
import { Popover } from "./Popover";
import { FOCUS_RING, cx } from "./ui";

export type NavKey = "calendar" | "board" | "sites";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeNav: NavKey;
  onNavigate: (key: NavKey) => void;
  activeTrialId: TrialId;
  onSwitchTrial: (id: TrialId) => void;
  compactBoard: boolean;
  onToggleCompactBoard: () => void;
}

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: "calendar", label: "Calendar", icon: LayoutGrid },
  { key: "board", label: "Visit board", icon: Rows3 },
  { key: "sites", label: "Sites", icon: Building2 },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
  activeNav,
  onNavigate,
  activeTrialId,
  onSwitchTrial,
  compactBoard,
  onToggleCompactBoard,
}: SidebarProps) {
  const activeTrial = TRIALS.find((t) => t.id === activeTrialId) ?? TRIALS[0];

  const body = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center justify-between gap-2 border-b border-zinc-200 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-lime-600 text-white">
            <CalendarCheck2 className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span
            className="truncate text-[15px] font-bold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Siteframe
          </span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 lg:hidden", FOCUS_RING)}
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="border-b border-zinc-200 p-3">
        <Popover
          trigger={({ open, toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-haspopup="menu"
              aria-expanded={open}
              className={cx(
                "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-zinc-200 px-3 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                FOCUS_RING
              )}
            >
              <span className="min-w-0 flex-1 truncate">{activeTrial.code}</span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            </button>
          )}
        >
          {({ close }) => (
            <div role="menu" aria-label="Switch trial" className="py-1">
              {TRIALS.map((trial) => {
                const active = trial.id === activeTrialId;
                return (
                  <button
                    key={trial.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      onSwitchTrial(trial.id);
                      close();
                    }}
                    className={cx(
                      "flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-zinc-50",
                      FOCUS_RING,
                      active ? "text-zinc-900" : "text-zinc-700"
                    )}
                  >
                    <Check className={cx("mt-0.5 h-4 w-4 shrink-0", active ? "text-lime-600" : "text-transparent")} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{trial.code}</span>
                      <span className="block truncate text-xs text-zinc-500">{trial.sponsor}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Popover>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium",
                FOCUS_RING,
                active ? "bg-lime-50 text-lime-800" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <Popover
          side="up"
          trigger={({ open, toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-haspopup="menu"
              aria-expanded={open}
              className={cx("flex h-11 w-full items-center gap-2.5 rounded-md px-2 text-left hover:bg-zinc-50", FOCUS_RING)}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                MR
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-800">Mina Russo</span>
                <span className="block truncate text-xs text-zinc-500">Clinical Ops Lead</span>
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            </button>
          )}
        >
          {({ close }) => (
            <div role="menu" aria-label="Account menu" className="py-1">
              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={compactBoard}
                onClick={onToggleCompactBoard}
                className={cx("flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}
              >
                <Rows3 className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                Compact board rows
                <span className="ml-auto text-xs text-zinc-500">{compactBoard ? "On" : "Off"}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={close}
                className={cx("flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}
              >
                <Settings className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                Workspace settings
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={close}
                className={cx("flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}
              >
                <LogOut className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </Popover>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 lg:block">
        <div className="sticky top-0 h-screen">{body}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close navigation menu" className="absolute inset-0 bg-zinc-900/40" onClick={onCloseMobile} />
          <div className="relative z-10 h-full w-72 max-w-[85vw] shadow-xl motion-safe:animate-[rise_0.18s_ease-out]">{body}</div>
        </div>
      )}
    </>
  );
}
