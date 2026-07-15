"use client";

import { Bell, ChevronDown, Command, Menu, Plus, Search } from "lucide-react";
import Image from "next/image";
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
        className="flex h-[44px] w-full min-w-0 max-w-[360px] items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-sm text-zinc-500 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">거래처, 딜, 담당자 검색…</span>
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
          새 딜 추가
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
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">알림 3건</p>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                &ldquo;노스스타 항공&rdquo; 딜이 협상 단계에서 3일째 정체됨
              </div>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                &ldquo;팔콘엣지 보안&rdquo; 계약이 방금 체결되었습니다
              </div>
              <div role="menuitem" tabIndex={0} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500">
                이번 주 마감 예정 딜 6건이 있습니다
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={userOpen}
            aria-label="계정 메뉴"
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex h-[44px] items-center gap-1.5 rounded-lg pl-1 pr-2 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&crop=faces"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full object-cover ring-1 ring-zinc-200"
            />
            <ChevronDown className="size-3.5 text-zinc-400" aria-hidden="true" />
          </button>
          {userOpen ? (
            <div
              role="menu"
              aria-label="계정 메뉴"
              className="absolute right-0 top-[calc(100%+6px)] w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1.5 shadow-lg"
            >
              <div className="border-b border-zinc-100 px-3 py-2">
                <p className="truncate text-sm font-medium text-zinc-800">김도윤</p>
                <p className="truncate text-xs text-zinc-500">dowoon@fieldset.io</p>
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
