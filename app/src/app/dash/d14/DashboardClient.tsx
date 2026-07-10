"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Bell,
  Briefcase,
  CalendarClock,
  Gavel,
  Globe,
  Landmark,
  ShieldAlert,
  Stamp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import styles from "./deco.module.css";
import RadialWheel from "./RadialWheel";
import CompositionDonut from "./CompositionDonut";
import RiskGauge from "./RiskGauge";
import Sparkline from "./Sparkline";
import {
  COMPOSITION,
  DOCKET_ROWS,
  JURISDICTION_RISK_BY_TAB,
  KPI_BY_TAB,
  MONTHLY_DEADLINES_BY_TAB,
  MONTH_LABELS,
  RISK_STYLE,
  TAB_LABELS,
  type AssetTab,
  type RowType,
  type TabKpi,
} from "./data";

const TAB_ORDER: AssetTab[] = ["all", "patent", "trademark", "litigation"];

const TAB_ICON: Record<AssetTab, typeof Landmark> = {
  all: Landmark,
  patent: Stamp,
  trademark: Award,
  litigation: Gavel,
};

const TAB_TO_ROW_TYPE: Partial<Record<AssetTab, RowType>> = {
  patent: "특허",
  trademark: "상표",
  litigation: "소송",
};

function riskColorVar(label: TabKpi["riskLabel"]) {
  if (label === "양호") return "var(--gold-300)";
  if (label === "주의") return "var(--gold-500)";
  if (label === "위험") return "var(--risk)";
  return "var(--risk-strong)";
}

function riskBadgeClass(risk: string) {
  if (risk === "심각") return "border-[var(--risk-strong)] text-[var(--risk)]";
  if (risk === "높음") return "border-[var(--risk)] text-[var(--risk)]";
  if (risk === "보통") return "border-[var(--gold-800)] text-[var(--gold-300)]";
  return "border-[var(--gold-800)] text-[var(--slate)]";
}

export default function DashboardClient() {
  const [assetTab, setAssetTab] = useState<AssetTab>("all");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [highRiskOnly, setHighRiskOnly] = useState(false);

  const kpi = KPI_BY_TAB[assetTab];
  const monthly = MONTHLY_DEADLINES_BY_TAB[assetTab];
  const jurisdictions = JURISDICTION_RISK_BY_TAB[assetTab];
  const maxJurisdiction = 100;

  const rowsByTab = useMemo(() => {
    const rowType = TAB_TO_ROW_TYPE[assetTab];
    return rowType ? DOCKET_ROWS.filter((r) => r.type === rowType) : DOCKET_ROWS;
  }, [assetTab]);

  const upcoming = useMemo(() => {
    return rowsByTab
      .filter((r) => selectedMonth === null || r.dueMonth === selectedMonth)
      .sort((a, b) => a.dueMonth - b.dueMonth)
      .slice(0, 6);
  }, [rowsByTab, selectedMonth]);

  const tableRows = useMemo(() => {
    return highRiskOnly
      ? rowsByTab.filter((r) => r.risk === "심각" || r.risk === "높음")
      : rowsByTab;
  }, [rowsByTab, highRiskOnly]);

  const kpiCards: {
    key: string;
    icon: typeof Briefcase;
    label: string;
    value: number;
    unit: string;
    trend: number[];
  }[] = [
    { key: "primary", icon: Briefcase, label: kpi.primaryLabel, value: kpi.primaryValue, unit: kpi.primaryUnit, trend: kpi.primaryTrend },
    { key: "due", icon: CalendarClock, label: kpi.dueLabel, value: kpi.dueValue, unit: kpi.dueUnit, trend: kpi.dueTrend },
    { key: "valuation", icon: TrendingUp, label: kpi.valuationLabel, value: kpi.valuationValue, unit: kpi.valuationUnit, trend: kpi.valuationTrend },
  ];

  return (
    <div className={styles.shell}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--gold-500)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--navy-950)]"
      >
        본문으로 건너뛰기
      </a>

      {/* ───────────────────────── 마스트헤드 ───────────────────────── */}
      <header className="relative border-b border-[var(--gold-800)] bg-[var(--navy-900)]/70">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--gold-500)]">
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i * 2 * Math.PI) / 16;
                    // 서버/클라이언트 삼각함수 1ULP 오차로 인한 하이드레이션 불일치 방지
                    const x1 = Math.round((50 + 32 * Math.cos(angle)) * 100) / 100;
                    const y1 = Math.round((50 + 32 * Math.sin(angle)) * 100) / 100;
                    const x2 = Math.round((50 + 44 * Math.cos(angle)) * 100) / 100;
                    const y2 = Math.round((50 + 44 * Math.sin(angle)) * 100) / 100;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="var(--gold-500)"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    );
                  })}
                  <circle cx={50} cy={50} r={22} fill="var(--navy-950)" stroke="var(--gold-500)" strokeWidth={2} />
                </svg>
                <Stamp aria-hidden="true" className="relative size-4 text-[var(--gold-300)]" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-deco-latin)] text-xl leading-none tracking-[0.3em] text-[var(--gold-300)]">
                  SEAL
                </p>
                <p className="mt-1 text-xs text-[var(--slate)]">지식재산 관제 콘솔</p>
              </div>
            </div>

            <p className="hidden rounded-full border border-[var(--gold-800)] px-4 py-1.5 text-xs text-[var(--slate)] sm:block">
              봉인특허법률사무소 · IP전략팀
            </p>

            <div className="flex items-center gap-4">
              <details className="relative">
                <summary
                  className={`${styles.noticeSummary} flex size-11 items-center justify-center rounded-full border border-[var(--gold-800)] text-[var(--slate)] transition-colors hover:border-[var(--gold-500)] hover:text-[var(--ivory)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-300)] motion-reduce:transition-none`}
                  aria-label="알림 3건 열기"
                >
                  <Bell aria-hidden="true" className="size-5" />
                </summary>
                <div className={`${styles.noticePanel} ${styles.card} p-4`}>
                  <p className="font-[family-name:var(--font-deco-kr)] text-sm font-semibold text-[var(--ivory)]">
                    최근 알림
                  </p>
                  <div className={`${styles.hairlineSingle} my-3`} />
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2">
                      <span aria-hidden="true" className={`${styles.diamondBullet} mt-1.5`} />
                      <span className="text-[var(--slate)]">
                        <span className="text-[var(--ivory)]">AUR-0456</span> 이의신청 답변기한이 임박했습니다.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span aria-hidden="true" className={`${styles.diamondBullet} mt-1.5`} />
                      <span className="text-[var(--slate)]">
                        <span className="text-[var(--ivory)]">LIT-2026-014</span> 재판부의 준비서면 요청이 도착했습니다.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span aria-hidden="true" className={`${styles.diamondBullet} mt-1.5`} />
                      <span className="text-[var(--slate)]">
                        <span className="text-[var(--ivory)]">TM-0098</span> 상표 출원이 심사 단계로 전환되었습니다.
                      </span>
                    </li>
                  </ul>
                </div>
              </details>

              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-full border border-[var(--gold-500)] bg-[var(--emerald-900)] text-sm font-semibold text-[var(--gold-300)]"
              >
                최윤
              </span>
              <span className="sr-only">로그인 사용자: 최윤아 변호사</span>
            </div>
          </div>
        </div>

        <div className={styles.chevronFrieze} aria-hidden="true" />

        <nav aria-label="대시보드 보기 전환" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            role="group"
            aria-label="자산 유형 필터 — 이 화면의 통계·차트·도킷 전체에 적용됩니다"
            className="-mx-1 flex gap-1 overflow-x-auto py-3"
          >
            {TAB_ORDER.map((tab) => {
              const Icon = TAB_ICON[tab];
              const selected = tab === assetTab;
              return (
                <button
                  key={tab}
                  type="button"
                  id={`tab-${tab}`}
                  aria-pressed={selected}
                  onClick={() => setAssetTab(tab)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-300)] motion-reduce:transition-none ${
                    selected
                      ? "border-[var(--gold-500)] text-[var(--ivory)]"
                      : "border-transparent text-[var(--slate)] hover:text-[var(--ivory)]"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* ───────────────────────── 메인 ───────────────────────── */}
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-deco-kr)] text-3xl font-semibold text-[var(--ivory)] sm:text-4xl">
              지식재산 관제탑
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[var(--slate)]">
              특허·상표·소송 자산을 하나의 관제 화면에서 감시합니다. 기준: 2026.07.11 09:00 KST 스냅샷.
            </p>
          </div>
          <p className="text-xs text-[var(--slate)]" role="status" aria-live="polite">
            현재 보기 · <span className="text-[var(--gold-300)]">{TAB_LABELS[assetTab]}</span>
          </p>
        </div>

        <div className={`${styles.hairline} mt-6`} aria-hidden="true" />

        {/* KPI 스트립 */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            const delta = card.trend[card.trend.length - 1] - card.trend[0];
            const TrendIcon = delta >= 0 ? TrendingUp : TrendingDown;
            const delayClass = idx === 1 ? styles.riseDelay1 : idx === 2 ? styles.riseDelay2 : "";
            return (
              <article
                key={card.key}
                className={`${styles.card} ${styles.riseIn} ${delayClass} p-5`}
              >
                <div className="flex items-start justify-between">
                  <Icon aria-hidden="true" className="size-5 text-[var(--gold-500)]" />
                  <span className="flex items-center gap-1 text-xs text-[var(--slate)]">
                    <TrendIcon aria-hidden="true" className="size-3.5" />
                    {delta >= 0 ? "상승" : "하락"} 추세
                  </span>
                </div>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-[family-name:var(--font-deco-latin)] text-3xl tabular-nums text-[var(--ivory)]">
                    {card.value.toLocaleString("ko-KR")}
                  </span>
                  <span className="text-sm text-[var(--slate)]">{card.unit}</span>
                </p>
                <p className="mt-1 text-sm text-[var(--slate)]">{card.label}</p>
                <div className="mt-3">
                  <Sparkline data={card.trend} stroke="var(--gold-500)" />
                </div>
              </article>
            );
          })}

          <article className={`${styles.card} ${styles.riseIn} ${styles.riseDelay3} p-5`}>
            <div className="flex items-start justify-between">
              <ShieldAlert aria-hidden="true" className="size-5 text-[var(--gold-500)]" />
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] ${riskBadgeClass(
                  kpi.riskLabel === "양호" ? "낮음" : kpi.riskLabel === "주의" ? "보통" : kpi.riskLabel === "위험" ? "높음" : "심각"
                )}`}
              >
                {kpi.riskLabel}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--slate)]">소송 리스크 지수</p>
            <RiskGauge value={kpi.riskIndex} colorVar={riskColorVar(kpi.riskLabel)} />
            <p className="-mt-2 text-center font-[family-name:var(--font-deco-latin)] text-2xl tabular-nums text-[var(--ivory)]">
              {kpi.riskIndex}
              <span className="ml-1 text-sm text-[var(--slate)]">/100</span>
            </p>
          </article>
        </div>

        {/* 휠 + 임박 마감 / 사이드 위젯 */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className={`${styles.card} lg:col-span-2`} aria-labelledby="wheel-heading">
            <div className="p-5 sm:p-7">
              <h2 id="wheel-heading" className="font-[family-name:var(--font-deco-kr)] text-lg font-semibold text-[var(--ivory)]">
                월별 갱신·기한 관제
              </h2>
              <p className="mt-1 text-sm text-[var(--slate)]">
                각 축의 길이는 해당 월의 마감 건수를 나타냅니다. 월을 선택하면 아래 목록이 필터링됩니다.
              </p>

              <div className="mt-6">
                <RadialWheel
                  monthLabels={MONTH_LABELS}
                  counts={monthly}
                  selectedMonth={selectedMonth}
                  onSelectMonth={setSelectedMonth}
                />
              </div>

              <div className={`${styles.hairlineSingle} mt-8`} aria-hidden="true" />

              <div className="mt-5 flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-deco-kr)] text-base font-semibold text-[var(--ivory)]">
                  임박 마감
                </h3>
                <p className="text-xs text-[var(--slate)]" role="status" aria-live="polite">
                  {upcoming.length}건 표시 중
                </p>
              </div>

              {upcoming.length === 0 ? (
                <p className="mt-4 rounded border border-dashed border-[var(--gold-800)] p-4 text-sm text-[var(--slate)]">
                  선택한 조건에 해당하는 마감 항목이 없습니다.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {upcoming.map((row) => (
                    <li
                      key={row.id}
                      className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--navy-800)] py-2.5 text-sm last:border-b-0"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden="true" className={styles.diamondBullet} />
                        <span className="truncate text-[var(--ivory)]">{row.name}</span>
                        <span className="shrink-0 rounded-full border border-[var(--gold-800)] px-2 py-0.5 text-[11px] text-[var(--slate)]">
                          {row.type}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3 text-xs text-[var(--slate)]">
                        <span>{row.jurisdiction}</span>
                        <span className="font-[family-name:var(--font-deco-latin)] text-[var(--gold-300)]">{row.dueDate}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 ${riskBadgeClass(row.risk)}`}
                        >
                          {row.risk}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <section className={`${styles.card} p-5 sm:p-6`} aria-labelledby="composition-heading">
              <h2 id="composition-heading" className="font-[family-name:var(--font-deco-kr)] text-lg font-semibold text-[var(--ivory)]">
                포트폴리오 구성
              </h2>
              <p className="mt-1 text-sm text-[var(--slate)]">전체 204건 기준, 자산 유형별 비중</p>
              <div className="mt-5">
                <CompositionDonut items={COMPOSITION} />
              </div>
            </section>

            <section className={`${styles.card} p-5 sm:p-6`} aria-labelledby="jurisdiction-heading">
              <h2 id="jurisdiction-heading" className="flex items-center gap-2 font-[family-name:var(--font-deco-kr)] text-lg font-semibold text-[var(--ivory)]">
                <Globe aria-hidden="true" className="size-4 text-[var(--gold-500)]" />
                관할별 리스크 노출
              </h2>
              <ul className="mt-5 space-y-3">
                {jurisdictions.map((j) => (
                  <li key={j.code}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--ivory)]">
                        {j.name} <span className="text-[var(--slate)]">({j.code})</span>
                      </span>
                      <span className="font-[family-name:var(--font-deco-latin)] tabular-nums text-[var(--slate)]">
                        {j.value}
                      </span>
                    </div>
                    <svg viewBox={`0 0 ${maxJurisdiction} 8`} className="mt-1.5 h-2 w-full" aria-hidden="true">
                      <rect x={0} y={0} width={maxJurisdiction} height={8} rx={1} fill="var(--navy-800)" />
                      <rect
                        x={0}
                        y={0}
                        width={j.value}
                        height={8}
                        rx={1}
                        fill={j.value >= 70 ? "var(--risk)" : "var(--gold-500)"}
                      />
                    </svg>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* 도킷 테이블 */}
        <section className="mt-10" aria-labelledby="docket-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="docket-heading" className="font-[family-name:var(--font-deco-kr)] text-lg font-semibold text-[var(--ivory)]">
              전체 도킷
            </h2>
            <label className="flex items-center gap-2 text-sm text-[var(--slate)]">
              <input
                type="checkbox"
                checked={highRiskOnly}
                onChange={(e) => setHighRiskOnly(e.target.checked)}
                className="size-4 rounded-sm border-[var(--gold-800)] accent-[var(--gold-500)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-300)]"
              />
              고위험만 보기
            </label>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {tableRows.length}건의 도킷 항목이 표시됩니다.
          </p>

          <div className={`${styles.card} mt-4 ${styles.tableScroll}`}>
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="px-5 pt-4 text-left text-xs text-[var(--slate)]">
                {TAB_LABELS[assetTab]} 기준 도킷 목록, 총 {tableRows.length}건
              </caption>
              <thead>
                <tr className="border-b border-[var(--gold-800)] text-left text-xs text-[var(--slate)]">
                  <th scope="col" className="px-5 py-3 font-medium">사건 · 자산</th>
                  <th scope="col" className="px-5 py-3 font-medium">유형</th>
                  <th scope="col" className="px-5 py-3 font-medium">관할</th>
                  <th scope="col" className="px-5 py-3 font-medium">상태</th>
                  <th scope="col" className="px-5 py-3 font-medium">다음 기한</th>
                  <th scope="col" className="px-5 py-3 font-medium">담당</th>
                  <th scope="col" className="px-5 py-3 font-medium">리스크</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--navy-800)] last:border-b-0">
                    <td className="px-5 py-3">
                      <p className="text-[var(--ivory)]">{row.name}</p>
                      <p className="font-[family-name:var(--font-deco-latin)] text-xs text-[var(--slate)]">{row.id}</p>
                    </td>
                    <td className="px-5 py-3 text-[var(--slate)]">{row.type}</td>
                    <td className="px-5 py-3 text-[var(--slate)]">{row.jurisdiction}</td>
                    <td className="px-5 py-3 text-[var(--slate)]">{row.status}</td>
                    <td className="px-5 py-3 font-[family-name:var(--font-deco-latin)] text-[var(--gold-300)]">{row.dueDate}</td>
                    <td className="px-5 py-3 text-[var(--slate)]">{row.attorney}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${riskBadgeClass(row.risk)}`}>
                        {RISK_STYLE[row.risk]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tableRows.length === 0 ? (
              <p className="p-6 text-sm text-[var(--slate)]">조건에 해당하는 도킷 항목이 없습니다.</p>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className={styles.hairlineSingle} aria-hidden="true" />
        <p className="mt-4 text-center text-xs text-[var(--slate)]">
          SEAL IP Console · 내부 전용 · v2.4.0
        </p>
      </footer>
    </div>
  );
}
