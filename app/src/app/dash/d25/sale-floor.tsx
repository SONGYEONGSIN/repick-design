"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  ClipboardList,
  Coins,
  Gavel,
  Globe,
  LayoutGrid,
  Menu,
  ScrollText,
  Ticket,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import styles from "./sheet.module.css";
import { EstimateSpread } from "./estimate-spread";
import { LotRail } from "./lot-rail";
import { LotTable } from "./lot-table";
import { DocketPanel } from "./docket-panel";
import {
  DEPARTMENTS,
  type DepartmentCode,
  LOTS,
  SALE_DATE_LABEL,
  computeSummary,
  formatDelta,
  formatUSD,
} from "./data";

type DepartmentFilter = "ALL" | DepartmentCode;

const NAV_ITEMS: Array<{ href: string; label: string; icon: typeof LayoutGrid }> = [
  { href: "#overview", label: "개요", icon: LayoutGrid },
  { href: "#estimate-spread", label: "추정가 스프레드", icon: Gavel },
  { href: "#lot-board", label: "로트 보드", icon: Ticket },
  { href: "#docket", label: "선택 로트 도켓", icon: ClipboardList },
  { href: "#catalogue", label: "카탈로그", icon: ScrollText },
];

export function SaleFloor() {
  const [department, setDepartment] = useState<DepartmentFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>("L015");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const filteredLots = useMemo(
    () => (department === "ALL" ? LOTS : LOTS.filter((l) => l.department === department)),
    [department],
  );
  const summary = useMemo(() => computeSummary(filteredLots), [filteredLots]);
  const selectedLot = useMemo(() => filteredLots.find((l) => l.id === selectedId) ?? null, [filteredLots, selectedId]);

  function handleSelectDepartment(code: DepartmentFilter) {
    setDepartment(code);
    const nextLots = code === "ALL" ? LOTS : LOTS.filter((l) => l.department === code);
    setSelectedId((prev) => {
      if (nextLots.some((l) => l.id === prev)) return prev;
      const fallback = nextLots.find((l) => l.status === "live") ?? nextLots.find((l) => l.status === "hammered") ?? nextLots[0];
      return fallback ? fallback.id : null;
    });
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    menuButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!isDrawerOpen) return;
    const drawerEl = drawerRef.current;
    const focusable = drawerEl?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen]);

  const activeLabel = department === "ALL" ? "전체" : DEPARTMENTS.find((d) => d.code === department)?.label ?? "전체";
  const vsHighDelta = formatDelta(summary.vsHigh);

  const kpiItems: Array<{ label: string; value: string; caption: string; icon: typeof Coins; tone?: "red" | "ink"; progress?: number }> = [
    {
      label: "낙찰 총액",
      value: formatUSD(summary.hammerTotal),
      caption: `${summary.hammeredCount}개 로트 낙찰`,
      icon: Coins,
    },
    {
      label: "추정 상단 대비",
      value: vsHighDelta.text,
      caption: "상단 추정가 합계 대비",
      icon: summary.vsHigh >= 0 ? TrendingUp : TrendingDown,
      tone: summary.vsHigh >= 0 ? "red" : "ink",
    },
    {
      label: "판매율",
      value: `${Math.round(summary.sellThrough * 100)}%`,
      caption: `${summary.hammeredCount} / ${summary.offeredCount} 로트`,
      icon: BadgeCheck,
    },
    {
      label: "평균 낙찰배수",
      value: `${summary.avgMultiple.toFixed(2)}×`,
      caption: "낙찰가 ÷ 중간 추정가",
      icon: Gavel,
    },
    {
      label: "온라인 응찰 비중",
      value: `${Math.round(summary.onlineAvg)}%`,
      caption: "평균, 진행 로트 기준",
      icon: Globe,
    },
    {
      label: "세일 진행",
      value: `${summary.liveOrOffered} / ${summary.total}`,
      caption: "상정 완료 로트",
      icon: Ticket,
      progress: summary.total > 0 ? summary.liveOrOffered / summary.total : 0,
    },
  ];

  return (
    <div className={`${styles.root} relative min-h-screen`}>
      <span aria-hidden="true" className={`${styles.regMark} fixed top-3 left-3 z-30`} />
      <span aria-hidden="true" className={`${styles.regMark} fixed top-3 right-3 z-30`} />
      <span aria-hidden="true" className={`${styles.regMark} fixed bottom-3 left-3 z-30`} />
      <span aria-hidden="true" className={`${styles.regMark} fixed bottom-3 right-3 z-30`} />

      <a href="#catalogue-main" className={`${styles.skipLink} bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--paper)]`}>
        본문으로 건너뛰기
      </a>

      <div className="lg:flex lg:h-screen">
        <nav
          aria-label="주요 섹션 내비게이션"
          className={`hidden lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-[var(--rule-strong)] lg:bg-[var(--paper-card)] ${styles.thinScroll}`}
        >
          <NavList />
          <SessionCard />
        </nav>

        {isDrawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="내비게이션 배경 닫기"
              onClick={closeDrawer}
              className="absolute inset-0 bg-black/30"
            />
            <div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="주요 섹션 내비게이션"
              className={`absolute top-0 left-0 h-full w-72 max-w-[85vw] overflow-y-auto border-r border-[var(--rule-strong)] bg-[var(--paper)] ${styles.thinScroll}`}
            >
              <div className="flex items-center justify-between border-b border-[var(--rule)] px-4 py-3">
                <span className="font-display text-lg italic text-[var(--ink)]">ROSTRUM</span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="내비게이션 닫기"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--ink-muted)] hover:bg-black/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <NavList onNavigate={closeDrawer} />
              <SessionCard />
            </div>
          </div>
        )}

        <div className={`flex min-w-0 flex-1 flex-col lg:h-screen lg:overflow-y-auto ${styles.thinScroll}`}>
          <header className="sticky top-0 z-20 border-b border-[var(--rule-strong)] bg-[var(--paper)]">
            <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  ref={menuButtonRef}
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  aria-label="내비게이션 열기"
                  className="-ml-2.5 flex h-11 w-11 items-center justify-center rounded-full text-[var(--ink)] hover:bg-black/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] lg:hidden"
                >
                  <Menu aria-hidden="true" className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <span className="block font-display text-lg leading-none italic text-[var(--ink)]">ROSTRUM</span>
                  <span className="hidden text-[10px] tracking-[0.2em] text-[var(--ink-muted)] uppercase sm:block">
                    Saleroom OS
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <span className="hidden text-right sm:block">
                  <span className="block text-xs font-medium text-[var(--ink)]">J. 들라크루아</span>
                  <span className="block text-xs text-[var(--ink-muted)]">수석 옥셔니어</span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-semibold text-[var(--paper)]"
                >
                  JD
                </span>
              </div>
            </div>
            <div className="flex h-9 items-center justify-between gap-4 border-t border-[var(--rule)] px-4 text-xs tracking-wide text-[var(--ink-muted)] sm:px-6 lg:px-8">
              <span className="truncate uppercase">SALE 214 · PARIS — 현대미술 이브닝 세일</span>
              <span className="hidden truncate sm:block">
                표시 중: {activeLabel} · {filteredLots.length}개 로트
              </span>
              <span className="shrink-0">
                {SALE_DATE_LABEL} · p. 01
              </span>
            </div>
          </header>

          <main id="catalogue-main" className="flex-1 space-y-8 px-4 py-6 sm:px-6 md:space-y-10 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium tracking-[0.2em] text-[var(--ink-muted)] uppercase">
                Rostrum Saleroom OS
              </p>
              <h1 className="mt-1 font-display text-3xl leading-tight text-[var(--ink)] italic sm:text-4xl">
                Sale 214 — 현대미술 이브닝 세일
              </h1>
              <p className="mt-1.5 text-sm text-[var(--ink-muted)]">
                파리 · {SALE_DATE_LABEL} · 총 {LOTS.length}개 로트
              </p>
            </div>

            <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-24">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 id="overview-heading" className="text-sm font-semibold tracking-wide text-[var(--ink)]">
                  개요 — 진행 현황
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-3 lg:grid-cols-6">
                {kpiItems.map((item) => (
                  <div key={item.label} className="min-w-0 bg-[var(--paper-card)] p-4">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
                      <item.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <p
                      className="mt-1.5 truncate font-mono text-xl font-semibold tabular-nums sm:text-2xl lg:text-3xl"
                      style={{ color: item.tone === "red" ? "var(--accent-red)" : "var(--ink)" }}
                    >
                      {item.value}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--ink-muted)]">{item.caption}</p>
                    {item.progress != null && (
                      <div className="mt-2 h-1 w-full bg-[var(--rule)]">
                        <div className="h-1 bg-[var(--ink)]" style={{ width: `${item.progress * 100}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div role="group" aria-label="부문 필터" className="flex flex-wrap items-center gap-2">
              {(["ALL", ...DEPARTMENTS.map((d) => d.code)] as DepartmentFilter[]).map((code) => {
                const isActive = department === code;
                const label = code === "ALL" ? "전체" : DEPARTMENTS.find((d) => d.code === code)?.label ?? code;
                return (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSelectDepartment(code)}
                    className={`flex min-h-11 items-center border px-3.5 text-xs font-medium tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] ${
                      isActive
                        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                        : "border-[var(--rule-strong)] bg-transparent text-[var(--ink-muted)] hover:bg-black/[0.03]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
              <div className="min-w-0 lg:col-span-2">
                <EstimateSpread lots={filteredLots} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
              <div className="min-w-0 lg:col-span-1 lg:h-full">
                <LotRail lots={filteredLots} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </div>

            <DocketPanel lot={selectedLot} />

            <LotTable lots={filteredLots} selectedId={selectedId} onSelect={setSelectedId} />

            <footer className="border-t border-[var(--rule)] pt-4 text-xs text-[var(--ink-muted)]">
              <p>추정가·낙찰가는 미국 달러(USD) 기준이며 buyer&apos;s premium은 포함되어 있지 않습니다.</p>
              <p className="mt-1">ROSTRUM Saleroom OS · Sale 214 · {SALE_DATE_LABEL}</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-0.5 px-2 py-3">
      {NAV_ITEMS.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            onClick={() => onNavigate?.()}
            className="flex min-h-11 items-center gap-2.5 px-2.5 text-sm text-[var(--ink-muted)] transition-colors duration-150 hover:bg-black/[0.04] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-red)]"
          >
            <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SessionCard() {
  return (
    <div className="mt-auto border-t border-[var(--rule)] p-4">
      <p className="text-xs text-[var(--ink-muted)]">진행 세션</p>
      <p className="mt-1 text-sm font-medium text-[var(--ink)]">Sale 214 · 이브닝 세일</p>
      <div className="mt-3 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-semibold text-[var(--paper)]"
        >
          JD
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-medium text-[var(--ink)]">J. 들라크루아</span>
          <span className="block text-xs text-[var(--ink-muted)]">수석 옥셔니어</span>
        </span>
      </div>
    </div>
  );
}
