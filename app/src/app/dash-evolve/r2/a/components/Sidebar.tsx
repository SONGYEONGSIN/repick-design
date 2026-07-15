"use client";

import Image from "next/image";
import {
  BarChart3,
  CalendarDays,
  ChevronsUpDown,
  Cog,
  Inbox,
  Layers,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  badge?: string;
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "발행",
    items: [
      { id: "calendar", label: "캘린더", Icon: CalendarDays, active: true },
      { id: "queue", label: "발행 대기 큐", Icon: Inbox, badge: "19" },
      { id: "library", label: "콘텐츠 라이브러리", Icon: Layers },
    ],
  },
  {
    label: "분석",
    items: [
      { id: "performance", label: "채널 성과", Icon: BarChart3 },
      { id: "audience", label: "오디언스", Icon: Users },
    ],
  },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Sparkles className="size-4.5" aria-hidden="true" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-900">Cadence</span>
      </div>

      <details className="group mx-3 mb-3 rounded-lg border border-zinc-200 bg-white open:shadow-sm">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2.5 rounded-lg px-2.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-bold text-white">
            C
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-800">Cadence 스튜디오</span>
            <span className="block truncate text-[11px] text-zinc-500">5개 채널 연결됨</span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
        </summary>
        <div className="border-t border-zinc-100 p-1.5 text-sm">
          <button
            type="button"
            className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left font-medium text-zinc-800 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Cadence 스튜디오
          </button>
          <button
            type="button"
            className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-500 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Cadence 파트너 워크스페이스
          </button>
        </div>
      </details>

      <nav aria-label="주요 메뉴" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <h2 className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{section.label}</h2>
            <ul className="mt-1.5 space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavigate}
                    aria-current={item.active ? "page" : undefined}
                    className={`flex min-h-[40px] items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                      item.active ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <item.Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-zinc-500">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-zinc-200 p-2">
        <details className="group">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
            <Image
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=faces"
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-800">노유진</span>
              <span className="block truncate text-[11px] text-zinc-500">yujin@cadence.app</span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          </summary>
          <div className="mt-1 space-y-0.5 border-t border-zinc-100 pt-1.5 text-sm">
            <button
              type="button"
              className="flex min-h-[36px] w-full items-center gap-2 rounded-md px-2.5 text-left text-zinc-600 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <Cog className="size-4 text-zinc-400" aria-hidden="true" />
              계정 설정
            </button>
            <button
              type="button"
              className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-600 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              로그아웃
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white lg:block">
        <div className="h-full">
          <SidebarBody />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="메뉴 닫기" onClick={onClose} className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
          <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white shadow-xl">
            <button
              type="button"
              onClick={onClose}
              aria-label="메뉴 닫기"
              className="absolute top-4 right-3 flex size-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>
            <SidebarBody onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
