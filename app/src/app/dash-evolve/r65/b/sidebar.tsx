"use client";

import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Inbox,
  BarChart3,
  Users,
  Settings,
  ChevronsUpDown,
  X,
  LogOut,
  Rows3,
} from "lucide-react";
import { FOCUS_RING } from "./ui";

const WORKSPACES = ["Northbridge Marketplace", "Lighthouse Social"];

type NavKey = "queue" | "insights" | "reviewers" | "settings";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeNav: NavKey;
  onNavigate: (key: NavKey) => void;
  compact: boolean;
  onToggleCompact: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile, activeNav, onNavigate, compact, onToggleCompact }: SidebarProps) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) setWorkspaceOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const navItems: { key: NavKey; label: string; icon: typeof Inbox }[] = [
    { key: "queue", label: "Queue", icon: Inbox },
    { key: "insights", label: "Insights", icon: BarChart3 },
    { key: "reviewers", label: "Reviewers", icon: Users },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const body = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center justify-between gap-2 border-b border-zinc-200 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-700 text-white">
            <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span
            className="truncate font-bold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            HARBORWATCH
          </span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 lg:hidden ${FOCUS_RING}`}
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="border-b border-zinc-200 p-3" ref={workspaceRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setWorkspaceOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={workspaceOpen}
            className={`flex h-11 w-full items-center justify-between gap-2 rounded-md border border-zinc-200 px-3 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <span className="truncate">{workspace}</span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          </button>
          {workspaceOpen && (
            <div
              role="menu"
              aria-label="Switch workspace"
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg"
            >
              {WORKSPACES.map((w) => (
                <button
                  key={w}
                  type="button"
                  role="menuitemradio"
                  aria-checked={w === workspace}
                  onClick={() => {
                    setWorkspace(w);
                    setWorkspaceOpen(false);
                  }}
                  className={`flex h-11 w-full items-center px-3 text-left text-sm hover:bg-zinc-50 ${FOCUS_RING} ${
                    w === workspace ? "font-medium text-orange-700" : "text-zinc-700"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Primary">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium ${FOCUS_RING} ${
                active ? "bg-orange-50 text-orange-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-3" ref={userMenuRef}>
        <div className="relative">
          {userMenuOpen && (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute bottom-[calc(100%+4px)] left-0 right-0 z-20 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg"
            >
              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={compact}
                onClick={onToggleCompact}
                className={`flex h-11 w-full items-center gap-3 px-3 text-left text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <Rows3 className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                Compact feed rows
                <span className="ml-auto text-xs text-zinc-500">{compact ? "On" : "Off"}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className={`flex h-11 w-full items-center gap-3 px-3 text-left text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <LogOut className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            className={`flex h-11 w-full items-center gap-2.5 rounded-md px-2 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
              MR
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-800">Mina Russo</span>
              <span className="block truncate text-xs text-zinc-500">Senior reviewer</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          </button>
        </div>
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
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-zinc-900/40"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full w-72 max-w-[85vw] shadow-xl">{body}</div>
        </div>
      )}
    </>
  );
}

export type { NavKey };
