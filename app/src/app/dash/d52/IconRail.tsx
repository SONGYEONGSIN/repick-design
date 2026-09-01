"use client";

import { LayoutDashboard, ListFilter, BarChart3, UsersRound, ChevronsUpDown } from "lucide-react";
import { FOCUS_RING } from "./ui/focus";

export const NAV_ITEMS = [
  { id: "terminal", label: "Comp Terminal", icon: LayoutDashboard, active: true },
  { id: "watchlists", label: "Watchlists", icon: ListFilter, active: false },
  { id: "reports", label: "Reports", icon: BarChart3, active: false },
  { id: "team", label: "Team", icon: UsersRound, active: false },
] as const;

function NavButton({ item }: { item: (typeof NAV_ITEMS)[number] }) {
  const Icon = item.icon;
  return (
    <button
      aria-current={item.active ? "page" : undefined}
      title={item.label}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${FOCUS_RING} ${
        item.active ? "bg-amber-400/15 text-amber-300" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      <span className="sr-only">{item.label}</span>
    </button>
  );
}

/** Slim always-visible icon rail — the app-shell sidebar, distinct from the watchlist rail. */
export function IconRail() {
  return (
    <aside className="hidden h-full w-16 shrink-0 flex-col items-center border-r border-white/10 bg-zinc-950 py-4 lg:flex">
      <button className={`flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-zinc-950 ${FOCUS_RING}`}>
        {/* 600. `font-bold`(700) 이면 이 작품의 렌더 웨이트가 4종이 되어 정본(정확히 3종)을 어긴다 —
            이 한 노드가 유일한 700 이었다(2026-09-01 승격 시 §3-1 규칙 위반 해소). */}
        <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display-wide)" }}>
          F
        </span>
        <span className="sr-only">Floorline workspaces</span>
      </button>

      <button
        className={`mt-3 flex h-7 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300 ${FOCUS_RING}`}
        title="Switch workspace"
      >
        <ChevronsUpDown className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">Switch workspace</span>
      </button>

      <nav aria-label="Primary" className="mt-6 flex flex-1 flex-col items-center gap-1.5">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </nav>

      <button
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-200 ${FOCUS_RING}`}
        title="Jordan Ames — Pricing Ops"
      >
        JA
        <span className="sr-only">Account menu — Jordan Ames, Pricing Ops</span>
      </button>
    </aside>
  );
}
