"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChartNetwork,
  Home,
  AlertTriangle,
  GitBranch,
  Settings,
  ChevronsUpDown,
  Check,
  LogOut,
  User,
  X,
} from "lucide-react";
import { FOCUS_RING } from "./ui";

export type Section = "overview" | "map" | "incidents" | "deploys" | "settings";

const WORKSPACES = ["repick · platform-eng", "repick · payments-infra", "repick · data-platform"];

const NAV: { id: Section; label: string; icon: typeof Home }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "map", label: "Dependency map", icon: ChartNetwork },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
  { id: "deploys", label: "Deploys", icon: GitBranch },
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

  function renderBody(idPrefix: string) {
    return (
      <div className="flex h-full min-h-0 w-64 flex-col border-r border-zinc-200 bg-white">
        <div className="flex h-11 flex-shrink-0 items-center justify-between px-4 pt-4">
          <span className="flex h-11 items-center gap-2 rounded-lg px-1 text-zinc-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
              <ChartNetwork size={16} aria-hidden="true" />
            </span>
            <span className="font-[family-name:var(--font-display-wide)] text-base font-semibold tracking-tight">
              Nodewatch
            </span>
          </span>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 xl:hidden ${FOCUS_RING}`}
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
            className={`flex h-11 w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left ${FOCUS_RING}`}
          >
            <span className="truncate text-xs font-medium text-zinc-700">{workspace}</span>
            <ChevronsUpDown size={14} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
          </button>
          {wsOpen ? (
            <div
              role="listbox"
              aria-label="Switch workspace"
              className="absolute left-3 right-3 top-[calc(100%+4px)] z-20 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
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
                  className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <span className="truncate">{ws}</span>
                  {ws === workspace ? <Check size={14} className="text-indigo-600" aria-hidden="true" /> : null}
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
                <li key={`${idPrefix}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(item.id);
                      onMobileClose();
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${
                      isActive ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
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
            className={`flex h-11 w-full items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left ${FOCUS_RING}`}
          >
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80"
              alt="Priya Varma avatar"
              width={24}
              height={24}
              className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-zinc-800">Priya Varma</span>
              <span className="block truncate text-[11px] text-zinc-500">Platform SRE</span>
            </span>
          </button>
          {userOpen ? (
            <div
              role="menu"
              aria-label="User menu"
              className="absolute left-3 right-3 bottom-[calc(100%+4px)] z-20 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserOpen(false)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <User size={14} aria-hidden="true" /> Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setUserOpen(false)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <LogOut size={14} aria-hidden="true" /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden xl:sticky xl:top-0 xl:block xl:h-screen xl:flex-shrink-0">
        {renderBody("desktop")}
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={onMobileClose}
            className="absolute inset-0 bg-zinc-900/40"
          />
          <div className="absolute inset-y-0 left-0">{renderBody("mobile")}</div>
        </div>
      ) : null}
    </>
  );
}
