"use client";

import {
  BarChart3,
  Building2,
  ChevronsUpDown,
  Megaphone,
  Send,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  Icon: LucideIcon;
  current?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "캠페인", Icon: Megaphone, current: true },
  { label: "잠재고객", Icon: Users },
  { label: "자동화", Icon: Zap },
  { label: "분석", Icon: BarChart3 },
  { label: "설정", Icon: Settings },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  return (
    <>
      {/* 모바일 드로어 백드롭 */}
      {open ? (
        <button
          type="button"
          aria-label="사이드바 닫기"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-zinc-900/30 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform motion-reduce:transition-none lg:sticky lg:top-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 브랜드 락업 */}
        <div className="flex h-[44px] shrink-0 items-center gap-2 px-4 pt-4">
          <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white" aria-hidden="true">
            <Send className="size-4" />
          </span>
          <p className="text-[15px] font-semibold tracking-tight text-zinc-900">Relay</p>
        </div>

        {/* 워크스페이스 스위처 */}
        <div className="px-3 pt-4">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={workspaceOpen}
            onClick={() => setWorkspaceOpen((v) => !v)}
            className="flex h-[44px] w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 text-left transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white text-zinc-500 ring-1 ring-zinc-200" aria-hidden="true">
              <Building2 className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-800">노스윈드 스튜디오</span>
              <span className="block truncate text-xs text-zinc-500">무료 체험 · 12일 남음</span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          </button>
          {workspaceOpen ? (
            <div
              role="listbox"
              aria-label="워크스페이스 목록"
              className="mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-sm"
            >
              <div role="option" aria-selected="true" className="cursor-default px-3 py-1.5 text-sm font-medium text-zinc-900">
                노스윈드 스튜디오
              </div>
              <div role="option" aria-selected="false" className="cursor-default px-3 py-1.5 text-sm text-zinc-500">
                포틀랜드 커피 컴퍼니
              </div>
            </div>
          ) : null}
        </div>

        {/* 섹션 구분 nav */}
        <nav aria-label="주요 메뉴" className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">워크스페이스</p>
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  aria-current={item.current ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                    item.current
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <item.Icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 하단 유저 */}
        <div className="flex shrink-0 items-center gap-2.5 border-t border-zinc-200 px-3 py-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
            aria-hidden="true"
          >
            황
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-800">황유진</p>
            <p className="truncate text-xs text-zinc-500">yjhwang@northwind.studio</p>
          </div>
        </div>
      </aside>
    </>
  );
}
