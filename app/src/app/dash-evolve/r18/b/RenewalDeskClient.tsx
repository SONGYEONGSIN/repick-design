"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Bell,
  Building2,
  CalendarClock,
  ChevronsUpDown,
  Check,
  CornerDownLeft,
  LayoutDashboard,
  Menu,
  Plug,
  Receipt,
  Search,
  Tags,
  Timer,
  Users,
  X,
} from "lucide-react";
import RailList from "./RailList";
import DetailPane from "./DetailPane";
import { Avatar, cx, focusRing, RiskChip, tierOf } from "./ui";
import { CONTRACTS, krwEok, MONTHS, num, renewalLabel } from "./data";

/**
 * Tenure — B2B subscription renewal desk.
 *
 * Shell (nav + topbar) → master rail (every renewal) → detail pane (one contract, read from a
 * movable vantage point). The shell sidebar and the master rail are deliberately different
 * objects: the sidebar is flat, iconographic and borderless; the rail is a bordered surface of
 * data rows with its own filter bar and footer total.
 */

const NAV_GROUPS: Array<{
  label: string;
  items: Array<{ label: string; icon: typeof Activity; active?: boolean }>;
}> = [
  {
    label: "Workspace",
    items: [
      { label: "개요", icon: LayoutDashboard },
      { label: "갱신 데스크", icon: CalendarClock, active: true },
      { label: "고객사", icon: Building2 },
      { label: "사용량", icon: Activity },
    ],
  },
  {
    label: "Revenue",
    items: [
      { label: "청구", icon: Receipt },
      { label: "가격표", icon: Tags },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "팀", icon: Users },
      { label: "연동", icon: Plug },
    ],
  },
];

const WORKSPACES = ["할시온데이터 · 레비뉴", "할시온데이터 · 프로덕트"];

const ACCOUNT = {
  name: "윤도현",
  initials: "윤도",
  email: "dohyun.yoon@tenure.example",
  role: "리텐션 리드",
};

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="주요 메뉴" className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={onNavigate}
                    aria-current={item.active ? "page" : undefined}
                    className={cx(
                      "flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-sm transition-colors duration-150 motion-reduce:transition-none",
                      item.active
                        ? "bg-rose-500/10 text-rose-200"
                        : "text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100",
                      focusRing,
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function RenewalDeskClient() {
  const [selectedId, setSelectedId] = useState(CONTRACTS[0].id);
  const [vantage, setVantage] = useState(MONTHS - 1);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [query, setQuery] = useState("");
  const [paletteWasOpen, setPaletteWasOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const contract = CONTRACTS.find((item) => item.id === selectedId) ?? CONTRACTS[0];
  const pipelineArr = CONTRACTS.reduce((sum, item) => sum + item.arr, 0);
  const withinQuarter = CONTRACTS.filter((item) => item.daysOut <= 90).length;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (event.key === "Escape") {
        setPaletteOpen(false);
        setDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Reset the search query during render (not inside an effect) when `paletteOpen` flips true —
  // adjusting state while rendering avoids the setState-in-effect cascade; the DOM focus() call
  // stays in an effect since it needs the input to be mounted first.
  if (paletteOpen !== paletteWasOpen) {
    setPaletteWasOpen(paletteOpen);
    if (paletteOpen) setQuery("");
  }

  useEffect(() => {
    if (paletteOpen) {
      searchRef.current?.focus();
    }
  }, [paletteOpen]);

  /** Selecting a contract resets the vantage: a point in time only means something per contract. */
  function selectContract(id: string) {
    setSelectedId(id);
    setVantage(MONTHS - 1);
    setMobileView("detail");
  }

  const needle = query.trim().toLowerCase();
  const paletteResults = CONTRACTS.filter(
    (item) =>
      needle === "" ||
      item.company.toLowerCase().includes(needle) ||
      item.segment.toLowerCase().includes(needle) ||
      item.ownerName.includes(needle),
  );

  return (
    <div className="relative flex h-dvh overflow-hidden bg-zinc-950 text-zinc-100">
      {/* The wrapper carries the positioning so the link itself only ever toggles `sr-only`.
          Putting `focus:absolute` on the link would race `not-sr-only`'s `position: static`. */}
      <div className="absolute top-3 left-3 z-50">
        <a
          href="#deck-main"
          className={cx(
            "sr-only focus:not-sr-only focus:inline-block focus:rounded-lg focus:bg-rose-500 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950",
            focusRing,
          )}
        >
          본문으로 건너뛰기
        </a>
      </div>

      {/* ── shell sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 px-3 py-4 lg:flex">
        <div className="flex items-center gap-2.5 px-2">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-zinc-950"
          >
            <Timer className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-50">Tenure</span>
        </div>

        <div
          className="relative mt-4"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setWorkspaceOpen(false);
            }
          }}
        >
          <button
            type="button"
            onClick={() => setWorkspaceOpen((open) => !open)}
            aria-expanded={workspaceOpen}
            aria-haspopup="menu"
            className={cx(
              "flex h-11 w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-left transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
              focusRing,
            )}
          >
            <Avatar initials="할시" size="sm" />
            <span className="min-w-0 flex-1 truncate text-xs text-zinc-200">{workspace}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          </button>
          {workspaceOpen && (
            <div
              role="menu"
              aria-label="워크스페이스 선택"
              className="absolute inset-x-0 z-30 mt-1.5 rounded-lg border border-white/15 bg-zinc-900 p-1 shadow-xl shadow-black/60"
            >
              {WORKSPACES.map((name) => (
                <button
                  key={name}
                  type="button"
                  role="menuitemradio"
                  aria-checked={name === workspace}
                  onClick={() => {
                    setWorkspace(name);
                    setWorkspaceOpen(false);
                  }}
                  className={cx(
                    "flex h-9 w-full items-center justify-between gap-2 rounded-md px-2 text-left text-xs transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                    name === workspace ? "text-rose-200" : "text-zinc-300",
                    focusRing,
                  )}
                >
                  <span className="truncate">{name}</span>
                  {name === workspace && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          <NavList />
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2">
          <Avatar initials={ACCOUNT.initials} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-100">{ACCOUNT.name}</p>
            <p className="truncate text-[11px] text-zinc-400">{ACCOUNT.role}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ── topbar ──────────────────────────────────────────────────── */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cx(
              "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none lg:hidden",
              focusRing,
            )}
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="sr-only">메뉴 열기</span>
          </button>

          <span className="flex items-center gap-2 lg:hidden">
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-rose-500 text-zinc-950"
            >
              <Timer className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-zinc-50">Tenure</span>
          </span>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className={cx(
              "inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-400 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none lg:w-full lg:max-w-sm",
              focusRing,
            )}
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            {/* The only label is kept in the accessibility tree at every width: `hidden` would
                strip it below the breakpoint and leave the button unnamed. */}
            <span className="sr-only md:not-sr-only md:flex-1 md:text-left">검색</span>
            <kbd className="hidden rounded border border-white/15 bg-white/[0.05] px-1.5 py-0.5 font-sans text-[11px] text-zinc-300 md:inline">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className={cx(
                "hidden h-11 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none sm:inline-flex",
                focusRing,
              )}
            >
              <Receipt className="h-4 w-4" aria-hidden="true" />
              분기 리포트
            </button>
            <button
              type="button"
              className={cx(
                "relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-rose-400"
              />
              <span className="sr-only">알림 3건</span>
            </button>
            <button
              type="button"
              className={cx(
                "inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <span className="sr-only">계정 메뉴</span>
              <Avatar initials={ACCOUNT.initials} />
              <span className="hidden text-sm text-zinc-200 xl:inline">{ACCOUNT.name}</span>
            </button>
          </div>
        </header>

        {/* ── content ─────────────────────────────────────────────────── */}
        <main id="deck-main" className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3 lg:px-6">
            <h1 className="text-[19px] font-semibold tracking-tight text-zinc-50">갱신 데스크</h1>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-zinc-400">
              <span>
                진행 중 <span className="tabular-nums text-zinc-200">{num(CONTRACTS.length)}</span>건
              </span>
              <span aria-hidden="true">·</span>
              <span>
                90일 내 <span className="tabular-nums text-zinc-200">{num(withinQuarter)}</span>건
              </span>
              <span aria-hidden="true">·</span>
              <span>
                파이프라인 ARR{" "}
                <span className="tabular-nums text-zinc-200">{krwEok(pipelineArr)}</span>
              </span>
            </p>
          </div>

          <div className="flex min-h-0 flex-1 gap-3 px-4 pb-4 lg:gap-4 lg:px-6 lg:pb-5">
            <section
              aria-labelledby="rail-heading"
              className={cx(
                "w-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40",
                "lg:flex lg:w-auto lg:shrink-0 lg:grow-0 lg:basis-[38%] xl:basis-[34%] 2xl:basis-[30%]",
                mobileView === "list" ? "flex" : "hidden",
              )}
            >
              <RailList contracts={CONTRACTS} activeId={selectedId} onSelect={selectContract} />
            </section>

            <section
              aria-labelledby="detail-heading"
              className={cx(
                "min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 lg:flex",
                mobileView === "detail" ? "flex" : "hidden",
              )}
            >
              <DetailPane
                contract={contract}
                vantage={vantage}
                onVantage={setVantage}
                onBack={() => setMobileView("list")}
              />
            </section>
          </div>
        </main>
      </div>

      {/* ── mobile drawer ─────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/70"
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="주요 메뉴"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950 px-3 py-4"
          >
            <div className="flex items-center justify-between px-2">
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-zinc-950"
                >
                  <Timer className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[15px] font-semibold text-zinc-50">Tenure</span>
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className={cx(
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">메뉴 닫기</span>
              </button>
            </div>
            <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-xs text-zinc-300">
              {workspace}
            </p>
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
              <NavList onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2">
              <Avatar initials={ACCOUNT.initials} />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-zinc-100">{ACCOUNT.name}</p>
                <p className="truncate text-[11px] text-zinc-400">{ACCOUNT.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── command palette ───────────────────────────────────────────── */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <div
            className="absolute inset-0 bg-zinc-950/75"
            aria-hidden="true"
            onClick={() => setPaletteOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="빠른 이동"
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-white/15 bg-zinc-900 shadow-2xl shadow-black/70"
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 px-3.5">
              <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
              <label className="sr-only" htmlFor="tenure-palette">
                고객사, 세그먼트, 담당자로 검색
              </label>
              <input
                id="tenure-palette"
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="고객사, 세그먼트, 담당자 검색"
                className={cx(
                  "h-12 w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rose-400",
                )}
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                className={cx(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">팔레트 닫기</span>
              </button>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {paletteResults.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-zinc-300">
                  일치하는 갱신 건이 없습니다.
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {paletteResults.map((item) => {
                    const tier = tierOf(item.risk[item.risk.length - 1]);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            selectContract(item.id);
                            setPaletteOpen(false);
                          }}
                          className={cx(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                            focusRing,
                          )}
                        >
                          <Avatar initials={item.company.slice(0, 2)} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-zinc-100">
                              {item.company}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-zinc-400">
                              {item.segment} · 갱신 {renewalLabel(item)} · {krwEok(item.arr)}
                            </span>
                          </span>
                          <RiskChip tier={tier} size="xs" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <p className="flex items-center gap-2 border-t border-white/10 px-3.5 py-2 text-[11px] text-zinc-400">
              <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              선택하면 상세 페인이 해당 계약의 갱신 시점으로 이동합니다. Esc 로 닫기.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
