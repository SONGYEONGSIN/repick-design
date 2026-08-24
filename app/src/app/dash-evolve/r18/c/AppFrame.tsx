"use client";

/**
 * Application shell: sidebar (brand lockup -> workspace switcher -> sectioned nav -> user), top bar
 * (search ⌘K, primary action, notifications, account), drawer below xl.
 *
 * Sidebar section labels are plain paragraphs, never headings: the shell renders before the page
 * `h1`, and a heading here would open the document at h2 and fail `heading-order`.
 */

import { useEffect, useState, type ReactNode } from "react";
import {
  Banknote,
  Bell,
  Blocks,
  Building2,
  CalendarRange,
  Command,
  Download,
  Grid3x3,
  LayoutGrid,
  Menu,
  Ruler,
  Search,
  Settings,
  TrendingDown,
  Users,
} from "lucide-react";
import { Avatar, FOCUS_RING, LABEL, Popover, PopoverItem } from "./ui";

type NavItem = { id: string; label: string; icon: typeof Grid3x3; meta?: string; current?: boolean };
type NavGroup = { id: string; label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    id: "analysis",
    label: "분석",
    items: [
      { id: "overview", label: "개요", icon: LayoutGrid },
      { id: "cohorts", label: "코호트 리텐션", icon: Grid3x3, current: true },
      { id: "churn", label: "이탈 요인", icon: TrendingDown, meta: "4" },
      { id: "expansion", label: "매출 확장", icon: Banknote },
    ],
  },
  {
    id: "data",
    label: "데이터",
    items: [
      { id: "segments", label: "세그먼트", icon: Users },
      { id: "sources", label: "이벤트 소스", icon: Blocks },
      { id: "dictionary", label: "지표 정의", icon: Ruler },
    ],
  },
  {
    id: "ops",
    label: "운영",
    items: [
      { id: "schedule", label: "리포트 예약", icon: CalendarRange },
      { id: "settings", label: "워크스페이스 설정", icon: Settings },
    ],
  },
];

const WORKSPACES = [
  { id: "northsail", label: "Northsail Labs", meta: "Prod" },
  { id: "northsail-stg", label: "Northsail Labs", meta: "Staging" },
  { id: "kestrel", label: "Kestrel Data", meta: "Prod" },
];

const NOTICES = [
  { id: "n1", title: "2025-09 코호트 적재 완료", body: "M0 스냅샷이 09-30 마감분으로 확정됐습니다." },
  { id: "n2", title: "좌석 동기화 지연 해소", body: "Scale 세그먼트 좌석 수가 재계산됐습니다." },
  { id: "n3", title: "정의 변경 제안 1건", body: "‘활성’ 판정 기준을 7일에서 14일로 넓히자는 제안." },
];

function BrandMark() {
  // Generative lattice mark — the product's triangle grid, drawn rather than imported.
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0" aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" fill="#FFF7ED" stroke="#FDBA74" />
      <rect x="5" y="5" width="4.5" height="4.5" rx="1" fill="#C2410C" />
      <rect x="10.75" y="5" width="4.5" height="4.5" rx="1" fill="#F97316" />
      <rect x="16.5" y="5" width="2.5" height="4.5" rx="1" fill="#FDBA74" />
      <rect x="5" y="10.75" width="4.5" height="4.5" rx="1" fill="#F97316" />
      <rect x="10.75" y="10.75" width="4.5" height="4.5" rx="1" fill="#FDBA74" />
      <rect x="5" y="16.5" width="4.5" height="2.5" rx="1" fill="#FED7AA" />
    </svg>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const [workspace, setWorkspace] = useState(WORKSPACES[0].id);
  const active = WORKSPACES.find((w) => w.id === workspace) ?? WORKSPACES[0];

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <div className="flex items-center gap-2.5 px-1 pt-1">
        <BrandMark />
        <span
          className="text-[19px] leading-none tracking-[-0.02em] text-zinc-900"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Trellis
        </span>
      </div>

      <Popover
        triggerClassName="flex h-11 w-full items-center gap-2 rounded-[8px] border border-zinc-200 bg-white px-2.5 text-left hover:border-zinc-300"
        panelClassName="w-[236px]"
        triggerContent={
          <>
            <Building2 aria-hidden="true" className="size-4 shrink-0 text-zinc-600" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-zinc-900">{active.label}</span>
              <span className="block text-[11px] text-zinc-600">{active.meta} 워크스페이스</span>
            </span>
            <span className="sr-only">워크스페이스 전환</span>
            <Users aria-hidden="true" className="size-4 shrink-0 text-zinc-500" />
          </>
        }
      >
        {(close) => (
          <>
            <p className={`${LABEL} px-2.5 pb-1 pt-1.5`}>워크스페이스</p>
            {WORKSPACES.map((item) => (
              <PopoverItem
                key={item.id}
                selected={item.id === workspace}
                meta={item.meta}
                onClick={() => {
                  setWorkspace(item.id);
                  close();
                }}
              >
                {item.label}
              </PopoverItem>
            ))}
          </>
        )}
      </Popover>

      <nav aria-label="주요" className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
        {NAV.map((group) => (
          <div key={group.id}>
            <p className={`${LABEL} px-2.5 pb-1.5`} id={`nav-${group.id}`}>
              {group.label}
            </p>
            <ul aria-labelledby={`nav-${group.id}`} className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <a
                      href="#main"
                      onClick={onNavigate}
                      aria-current={item.current ? "page" : undefined}
                      className={`relative flex h-9 items-center gap-2.5 rounded-[7px] px-2.5 text-[13px] transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                        item.current
                          ? "bg-orange-50 font-medium text-orange-900"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {item.current ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1.5 h-6 w-[3px] rounded-r-full bg-orange-600"
                        />
                      ) : null}
                      <Icon
                        aria-hidden="true"
                        className={`size-4 shrink-0 ${item.current ? "text-orange-700" : "text-zinc-500"}`}
                      />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.meta ? (
                        <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 text-[11px] font-medium tabular-nums text-zinc-700">
                          {item.meta}
                        </span>
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 rounded-[8px] border border-zinc-200 bg-zinc-50 p-2.5">
        <Avatar initials="SJ" name="서지우" size={32} tone="accent" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-900">서지우</span>
          <span className="block truncate text-[11px] text-zinc-600">애널리틱스 리드</span>
        </span>
        <a
          href="#main"
          className={`relative flex size-8 items-center justify-center rounded-[7px] text-zinc-600 hover:bg-white hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <Settings aria-hidden="true" className="size-4" />
          <span className="sr-only">계정 설정</span>
        </a>
      </div>
    </div>
  );
}

export default function AppFrame({
  onOpenPalette,
  children,
}: {
  onOpenPalette: () => void;
  children: ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer]);

  return (
    <div className="relative flex min-h-screen bg-zinc-50 text-zinc-900">
      {/* Skip link parked off-screen with a transform rather than sr-only + not-sr-only: those two
          write competing `position` values in the same cascade layer, and which one wins depends on
          utility emission order rather than on anything this file controls. */}
      <a
        href="#main"
        className={`absolute left-4 top-4 z-50 -translate-y-24 rounded-[8px] border border-orange-300 bg-white px-4 py-2.5 text-[13px] font-medium text-orange-900 shadow-[0_8px_24px_-12px_rgba(24,24,27,0.4)] transition-transform duration-150 focus:translate-y-0 motion-reduce:transition-none ${FOCUS_RING}`}
      >
        본문으로 건너뛰기
      </a>

      <div className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white xl:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-zinc-900/35"
          >
            <span className="sr-only">메뉴 닫기</span>
          </button>
          <div className="absolute inset-y-0 left-0 w-[272px] border-r border-zinc-200 bg-white animate-[rise_.16s_ease-out] motion-reduce:animate-none">
            <SidebarBody onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className={`relative flex size-11 shrink-0 items-center justify-center rounded-[8px] border border-zinc-200 text-zinc-700 hover:bg-zinc-50 xl:hidden ${FOCUS_RING}`}
            >
              <Menu aria-hidden="true" className="size-5" />
              <span className="sr-only">탐색 메뉴 열기</span>
            </button>

            <button
              type="button"
              id="global-search-trigger"
              onClick={onOpenPalette}
              className={`relative flex h-11 min-w-0 flex-1 items-center gap-2 rounded-[8px] border border-zinc-200 bg-zinc-50 px-3 text-left text-zinc-600 hover:border-zinc-300 hover:bg-white sm:max-w-md ${FOCUS_RING}`}
            >
              <Search aria-hidden="true" className="size-4 shrink-0" />
              {/* `sr-only sm:not-sr-only` — `hidden sm:inline` would delete the accessible name below sm. */}
              <span className="sr-only min-w-0 flex-1 truncate text-[13px] sm:not-sr-only">
                코호트 · 세그먼트 · 지표 검색
              </span>
              <span className="ml-auto hidden shrink-0 items-center gap-1 rounded-[5px] border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 sm:inline-flex">
                <Command aria-hidden="true" className="size-3" />K
              </span>
            </button>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                className={`relative hidden h-11 items-center gap-2 rounded-[8px] bg-orange-700 px-3.5 text-[13px] font-medium text-white hover:bg-orange-800 sm:inline-flex ${FOCUS_RING}`}
              >
                <Download aria-hidden="true" className="size-4" />
                리포트 내보내기
              </button>

              <Popover
                align="end"
                triggerClassName="relative flex size-11 items-center justify-center rounded-[8px] border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                panelClassName="w-[292px]"
                triggerContent={
                  <>
                    <Bell aria-hidden="true" className="size-5" />
                    <span className="sr-only">알림 3건</span>
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-2 size-2 rounded-full bg-orange-600 ring-2 ring-white"
                    />
                  </>
                }
              >
                {() => (
                  <>
                    <p className={`${LABEL} px-2.5 pb-1 pt-1.5`}>알림</p>
                    <ul className="flex flex-col">
                      {NOTICES.map((notice) => (
                        <li key={notice.id} className="rounded-[6px] px-2.5 py-2 hover:bg-zinc-50">
                          <p className="text-[13px] font-medium text-zinc-900">{notice.title}</p>
                          <p className="mt-0.5 text-[12px] leading-snug text-zinc-600">{notice.body}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Popover>

              <Popover
                align="end"
                triggerClassName="relative flex size-11 items-center justify-center rounded-[8px] border border-zinc-200 hover:bg-zinc-50"
                panelClassName="w-[220px]"
                triggerContent={
                  <>
                    <Avatar initials="SJ" name="계정 메뉴" size={28} tone="accent" />
                  </>
                }
              >
                {(close) => (
                  <>
                    <p className="px-2.5 pb-1 pt-1.5 text-[12px] text-zinc-600">sj@northsail.io</p>
                    <PopoverItem onClick={close}>프로필</PopoverItem>
                    <PopoverItem onClick={close}>알림 설정</PopoverItem>
                    <PopoverItem onClick={close}>로그아웃</PopoverItem>
                  </>
                )}
              </Popover>
            </div>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>

      {drawer ? (
        <span className="sr-only" role="status">
          탐색 메뉴가 열렸습니다
        </span>
      ) : null}
    </div>
  );
}
