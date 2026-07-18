"use client";

import { useState } from "react";
import {
  Activity,
  Footprints,
  LayoutGrid,
  Repeat,
  Settings,
  Target,
  TrendingUp,
  UsersRound,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { cn } from "../lib/cn";

const NAV_ITEMS = [
  { id: "overview", label: "개요", icon: LayoutGrid },
  { id: "retention", label: "코호트 리텐션", icon: Repeat },
  { id: "funnels", label: "퍼널 분석", icon: Target },
  { id: "events", label: "이벤트 탐색", icon: Activity },
  { id: "segments", label: "세그먼트", icon: UsersRound },
  { id: "revenue", label: "매출", icon: TrendingUp },
] as const;

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function SidebarContent({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex h-14 items-center justify-between gap-2 border-b border-zinc-200 px-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Footprints className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Foothold
          </span>
        </div>
        {onCloseMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="사이드바 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-white/10 lg:hidden"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="border-b border-zinc-200 p-3 dark:border-white/10">
        <button
          type="button"
          onClick={() => setWorkspaceOpen((v) => !v)}
          aria-expanded={workspaceOpen}
          className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 text-left transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[10px] font-bold text-white dark:bg-zinc-200 dark:text-zinc-900">
              NW
            </span>
            <span className="min-w-0 truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
              Northwind Studio
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
        </button>
        {workspaceOpen ? (
          <div className="mt-1.5 rounded-lg border border-zinc-200 bg-white p-1 text-[12.5px] shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <p className="truncate rounded-md px-2 py-1.5 font-medium text-zinc-900 dark:text-zinc-50">
              Northwind Studio
            </p>
            <p className="truncate rounded-md px-2 py-1.5 text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-white/5">
              Harbor Labs (게스트)
            </p>
          </div>
        ) : null}
      </div>

      <nav aria-label="주요" className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
        <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          제품 분석
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.id === "retention";
          return (
            <a
              key={item.id}
              href="#retention-heading"
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-2.5 dark:border-white/10">
        <a
          href="#"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          설정
        </a>
        <div className="mt-1.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
            alt=""
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-zinc-800 dark:text-zinc-100">
              Dana Whitfield
            </p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">분석 리드</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 lg:block dark:border-white/10">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="사이드바 배경 닫기"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-900/40"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] shadow-xl">
            <SidebarContent onCloseMobile={onCloseMobile} />
          </div>
        </div>
      ) : null}
    </>
  );
}
