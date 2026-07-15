"use client";

import { Bell, ChevronDown, Command, Menu, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function Topbar({
  onMenuClick,
  onSearchClick,
}: {
  onMenuClick: () => void;
  onSearchClick: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="사이드바 열기"
        className="flex size-[44px] shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* 글로벌 검색 ⌘K */}
      <button
        type="button"
        onClick={onSearchClick}
        className="flex h-[44px] w-full min-w-0 max-w-[360px] items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-400 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">캠페인, 세그먼트 검색…</span>
        <span className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 sm:inline-flex">
          <Command className="size-3" aria-hidden="true" />K
        </span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="hidden h-[44px] items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-sm font-medium text-white shadow-sm transition-colors motion-reduce:transition-none hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:flex"
        >
          <Plus className="size-4" aria-hidden="true" />
          새 캠페인
        </button>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label="알림 3건"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className="relative flex size-[44px] items-center justify-center rounded-lg text-zinc-500 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <Bell className="size-[18px]" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 flex size-2 rounded-full bg-rose-500 ring-2 ring-white" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div
              role="menu"
              aria-label="알림"
              className="absolute right-0 top-[calc(100%+6px)] w-72 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1.5 shadow-lg"
            >
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">알림 3건</p>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                &ldquo;7월 웨비나 초대&rdquo; 오픈율 목표 초과 달성
              </div>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                이탈 위험 세그먼트가 1,875명으로 갱신됨
              </div>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                예약된 캠페인이 7월 22일 09:00에 발송됩니다
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={userOpen}
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex h-[44px] items-center gap-1.5 rounded-lg pl-1 pr-2 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700" aria-hidden="true">
              황
            </span>
            <ChevronDown className="size-3.5 text-zinc-400" aria-hidden="true" />
          </button>
          {userOpen ? (
            <div
              role="menu"
              aria-label="계정 메뉴"
              className="absolute right-0 top-[calc(100%+6px)] w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1.5 shadow-lg"
            >
              <div className="border-b border-zinc-100 px-3 py-2">
                <p className="truncate text-sm font-medium text-zinc-800">황유진</p>
                <p className="truncate text-xs text-zinc-500">yjhwang@northwind.studio</p>
              </div>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                계정 설정
              </div>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                로그아웃
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
