"use client";

import { useState, useRef, useEffect } from "react";
import {
  Activity,
  Inbox,
  ShieldAlert,
  BarChart3,
  Settings,
  ChevronsUpDown,
  Check,
  LogOut,
  User,
  X,
  Shield,
} from "lucide-react";
import { WORKSPACES } from "./data";
import { FOCUS_RING } from "./ui";

export type Section = "feed" | "queues" | "rules" | "reports" | "settings";

const NAV: { id: Section; label: string; icon: typeof Activity }[] = [
  { id: "feed", label: "Feed", icon: Activity },
  { id: "queues", label: "Queues", icon: Inbox },
  { id: "rules", label: "Rules", icon: ShieldAlert },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  onMobileClose,
}: {
  active: Section;
  onNavigate: (s: Section) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [wsOpen, setWsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const wsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setWsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const body = (
    <div className="flex h-full min-h-0 w-64 flex-col border-r border-white/10 bg-zinc-950">
      <div className="flex h-11 flex-shrink-0 items-center justify-between px-4 pt-4">
        <a
          href="#main-content"
          className={`flex h-11 items-center gap-2 rounded-lg px-1 text-zinc-50 ${FOCUS_RING}`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
            <Shield size={16} aria-hidden="true" />
          </span>
          <span className="font-[family-name:var(--font-display-mono)] text-base font-semibold tracking-tight">
            OUTPOST
          </span>
        </a>
        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Close navigation"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 xl:hidden ${FOCUS_RING}`}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="relative mt-5 px-3" ref={wsRef}>
        <button
          type="button"
          onClick={() => setWsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={wsOpen}
          className={`flex h-11 w-full items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-3 text-left ${FOCUS_RING}`}
        >
          <span className="truncate text-xs font-medium text-zinc-200">{workspace}</span>
          <ChevronsUpDown size={14} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
        {wsOpen ? (
          <div
            role="listbox"
            aria-label="Switch workspace"
            className="absolute left-3 right-3 top-[calc(100%+4px)] z-20 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl"
          >
            {WORKSPACES.map((ws) => (
              <button
                key={ws}
                type="button"
                role="option"
                aria-selected={ws === workspace}
                onClick={() => {
                  setWorkspace(ws);
                  setWsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 ${FOCUS_RING}`}
              >
                <span className="truncate">{ws}</span>
                {ws === workspace ? <Check size={14} className="text-blue-400" aria-hidden="true" /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <nav aria-label="Primary" className="mt-4 flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const isActive = item.id === active;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onMobileClose();
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${
                    isActive ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative mb-4 flex-shrink-0 px-3" ref={userRef}>
        <button
          type="button"
          onClick={() => setUserOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={userOpen}
          className={`flex h-11 w-full items-center gap-2.5 rounded-lg border border-white/10 bg-zinc-900 px-3 text-left ${FOCUS_RING}`}
        >
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
            <User size={13} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-zinc-200">Alicia Reyes</span>
            <span className="block truncate text-[11px] text-zinc-400">Risk analyst</span>
          </span>
        </button>
        {userOpen ? (
          <div
            role="menu"
            aria-label="User menu"
            className="absolute left-3 right-3 bottom-[calc(100%+4px)] z-20 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => setUserOpen(false)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 ${FOCUS_RING}`}
            >
              <User size={14} aria-hidden="true" /> Profile
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => setUserOpen(false)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800 ${FOCUS_RING}`}
            >
              <LogOut size={14} aria-hidden="true" /> Sign out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden xl:sticky xl:top-0 xl:block xl:h-screen xl:flex-shrink-0">{body}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={onMobileClose}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-y-0 left-0">{body}</div>
        </div>
      ) : null}
    </>
  );
}
