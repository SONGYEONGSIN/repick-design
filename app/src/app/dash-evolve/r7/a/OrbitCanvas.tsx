"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useState } from "react";
import {
  CENTER,
  CUSTOMERS,
  STAGE_META,
  STAGE_ORDER,
  VB,
  customerById,
  dotSize,
  dotXY,
  formatUsdCompact,
  visibleCustomers,
  type Customer,
  type FilterId,
  type PeriodId,
} from "./data";
import { NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { StageBadge } from "./ui";

function angDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

function pct(v: number): number {
  return Math.round((v / VB) * 10000) / 100;
}

export default function OrbitCanvas({
  period,
  filter,
  selectedId,
  onSelect,
}: {
  period: PeriodId;
  filter: FilterId;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [roveId, setRoveId] = useState(selectedId);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visible = visibleCustomers(filter);
  const roveEffective = visible.some((c) => c.id === roveId)
    ? roveId
    : visible.find((c) => c.id === selectedId)?.id ?? visible[0]?.id ?? selectedId;

  const activeId = hoveredId ?? focusedId;
  const activeCustomer = activeId ? customerById(activeId) : undefined;
  const activePos = activeCustomer && visible.some((c) => c.id === activeCustomer.id) ? dotXY(activeCustomer, period) : null;

  function focusDot(id: string) {
    setRoveId(id);
    if (typeof document !== "undefined") document.getElementById(`orbit-dot-${id}`)?.focus();
  }

  function neighborByAngle(current: Customer, dir: 1 | -1): Customer {
    const same = visible.filter((c) => c.stage === current.stage).sort((a, b) => a.angleDeg - b.angleDeg);
    const idx = same.findIndex((c) => c.id === current.id);
    if (idx < 0 || same.length < 2) return current;
    return same[(idx + dir + same.length) % same.length];
  }

  function neighborByRing(current: Customer, dir: 1 | -1): Customer {
    const si = STAGE_ORDER.indexOf(current.stage);
    for (let k = 1; k < STAGE_ORDER.length; k++) {
      const j = si + dir * k;
      if (j < 0 || j >= STAGE_ORDER.length) break;
      const cand = visible.filter((c) => c.stage === STAGE_ORDER[j]);
      if (cand.length) {
        return cand.reduce((best, c) => (angDist(c.angleDeg, current.angleDeg) < angDist(best.angleDeg, current.angleDeg) ? c : best));
      }
    }
    return current;
  }

  function onDotKeyDown(e: ReactKeyboardEvent<SVGCircleElement>, c: Customer) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(c.id);
      setRoveId(c.id);
      return;
    }
    let target: Customer | undefined;
    if (e.key === "ArrowRight") target = neighborByAngle(c, 1);
    else if (e.key === "ArrowLeft") target = neighborByAngle(c, -1);
    else if (e.key === "ArrowUp") target = neighborByRing(c, 1);
    else if (e.key === "ArrowDown") target = neighborByRing(c, -1);
    if (target && target.id !== c.id) {
      e.preventDefault();
      focusDot(target.id);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: "1 / 1" }}>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="absolute inset-0 h-full w-full"
        role="group"
        aria-label={`고객 라이프사이클 궤도. 현재 ${visible.length}개 계정 표시 중. 중심에 가까울수록 초기 단계, 바깥쪽 밴드일수록 확장 단계이며 밴드 안에서 중심에서 먼 정도는 헬스 스코어를 나타냅니다.`}
      >
        {/* 궤도 밴드(두꺼운 반투명 스트로크로 은은한 밴드 틴트) */}
        {STAGE_ORDER.map((s) => {
          const m = STAGE_META[s];
          const mid = (m.ring.inner + m.ring.outer) / 2;
          const thick = m.ring.outer - m.ring.inner;
          return (
            <circle
              key={`band-${s}`}
              cx={CENTER}
              cy={CENTER}
              r={mid}
              fill="none"
              className={m.stroke}
              strokeWidth={thick}
              strokeOpacity={m.escape ? 0.14 : 0.07}
              {...(m.escape ? { strokeDasharray: "2 5" } : {})}
            />
          );
        })}

        {/* 밴드 경계 헤어라인 */}
        {STAGE_ORDER.map((s) => {
          const m = STAGE_META[s];
          return (
            <circle
              key={`guide-${s}`}
              cx={CENTER}
              cy={CENTER}
              r={m.ring.outer}
              fill="none"
              className={m.escape ? "stroke-rose-300/70 dark:stroke-rose-500/40" : "stroke-zinc-200 dark:stroke-zinc-800"}
              strokeWidth={1}
              {...(m.escape ? { strokeDasharray: "4 4" } : {})}
            />
          );
        })}
        <circle cx={CENTER} cy={CENTER} r={STAGE_META.trial.ring.inner} fill="none" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth={1} />

        {/* 중심 코어(허브) */}
        <circle cx={CENTER} cy={CENTER} r={STAGE_META.trial.ring.inner - 8} className="fill-zinc-50 stroke-zinc-200 dark:fill-white/[0.03] dark:stroke-zinc-800" strokeWidth={1} />
        <text x={CENTER} y={CENTER - 3} textAnchor="middle" fontSize={38} fontWeight={700} className="fill-zinc-900 [font-variant-numeric:tabular-nums] dark:fill-zinc-50">
          {visible.length}
        </text>
        <text x={CENTER} y={CENTER + 20} textAnchor="middle" fontSize={12.5} className="fill-zinc-600 dark:fill-zinc-300">
          {filter === "all" ? "전체 계정" : `${STAGE_META[filter].label} 계정`}
        </text>

        {/* 크로스헤어(활성 점에 한함) */}
        {activePos ? (
          <g aria-hidden="true" className="motion-safe:transition-opacity">
            <line x1={8} y1={activePos.y} x2={VB - 8} y2={activePos.y} className="stroke-zinc-400/35 dark:stroke-zinc-500/35" strokeWidth={1} strokeDasharray="3 4" />
            <line x1={activePos.x} y1={8} x2={activePos.x} y2={VB - 8} className="stroke-zinc-400/35 dark:stroke-zinc-500/35" strokeWidth={1} strokeDasharray="3 4" />
            <line x1={CENTER} y1={CENTER} x2={activePos.x} y2={activePos.y} className="stroke-indigo-400/70 dark:stroke-indigo-400/60" strokeWidth={1.25} strokeDasharray="2 3" />
          </g>
        ) : null}

        {/* 고객 점 */}
        {visible.map((c) => {
          const p = dotXY(c, period);
          const size = dotSize(c.arr);
          const isSelected = c.id === selectedId;
          const isActive = c.id === activeId;
          const m = STAGE_META[c.stage];
          return (
            <g
              key={c.id}
              style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
              className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
            >
              {isSelected ? (
                <circle r={size + 5} fill="none" className="stroke-indigo-500 dark:stroke-indigo-400" strokeWidth={1.8} />
              ) : null}
              {isActive ? (
                <circle r={size + 3.5} fill="none" className="stroke-zinc-500/80 dark:stroke-zinc-300/70" strokeWidth={1.4} />
              ) : null}
              <circle r={size} className={cx(m.fill, "stroke-white dark:stroke-zinc-900")} strokeWidth={1.2} />
              <circle
                id={`orbit-dot-${c.id}`}
                r={11}
                fill="transparent"
                role="button"
                tabIndex={c.id === roveEffective ? 0 : -1}
                aria-pressed={isSelected}
                aria-label={`${c.name} 계정, ${m.label} 단계, 헬스 스코어 ${c.health[period]}점, 가입 ${c.signupDaysAgo}일차. 선택하면 상세 패널과 전환 테이블에 강조됩니다.`}
                className="cursor-pointer outline-none [outline:none]"
                onClick={() => {
                  onSelect(c.id);
                  setRoveId(c.id);
                }}
                onKeyDown={(e) => onDotKeyDown(e, c)}
                onFocus={() => setFocusedId(c.id)}
                onBlur={() => setFocusedId((prev) => (prev === c.id ? null : prev))}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId((prev) => (prev === c.id ? null : prev))}
              />
            </g>
          );
        })}
      </svg>

      {/* HTML 오버레이: 궤도 링 라벨 + 크로스헤어 툴팁 (좌표 = SVG 좌표 백분율) */}
      <div className="pointer-events-none absolute inset-0">
        {STAGE_ORDER.map((s) => {
          const m = STAGE_META[s];
          const topY = CENTER - m.ring.outer + (m.escape ? 0 : (m.ring.outer - m.ring.inner) / 2);
          return (
            <div
              key={`label-${s}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: "50%", top: `${pct(topY)}%` }}
            >
              <span
                className={cx(
                  "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold shadow-sm",
                  "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
                  m.text,
                )}
              >
                <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", m.chipDot)} />
                {m.label}
              </span>
            </div>
          );
        })}

        {activeCustomer && activePos ? (
          <TooltipCard customer={activeCustomer} period={period} xPct={pct(activePos.x)} yPct={pct(activePos.y)} />
        ) : null}
      </div>

      <p className="sr-only" aria-live="off">
        화살표 키로 궤도 위 계정 사이를 이동하고 Enter 또는 Space로 선택합니다. 좌우 화살표는 같은 단계 안에서, 상하 화살표는 단계 밴드 사이를 이동합니다.
      </p>
    </div>
  );
}

function TooltipCard({ customer, period, xPct, yPct }: { customer: Customer; period: PeriodId; xPct: number; yPct: number }) {
  const tx = xPct > 62 ? "calc(-100% - 12px)" : "12px";
  const ty = yPct < 24 ? "12px" : "calc(-100% - 12px)";
  return (
    <div className="absolute z-20" style={{ left: `${xPct}%`, top: `${yPct}%` }}>
      <div
        role="status"
        aria-live="polite"
        style={{ transform: `translate(${tx}, ${ty})` }}
        className="w-max min-w-[168px] max-w-[220px] rounded-xl border border-zinc-200 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95"
      >
        <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{customer.name}</p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <StageBadge stage={customer.stage} />
          <span className={cx("text-sm font-semibold", NUM, TEXT_PRIMARY)}>
            {customer.health[period]}
            <span className={cx("ml-0.5 text-[11px] font-normal", TEXT_CAPTION)}>점</span>
          </span>
        </div>
        <p className={cx("mt-1.5 text-[11px]", NUM, TEXT_CAPTION)}>
          가입 {customer.signupDaysAgo}일차 · ARR {formatUsdCompact(customer.arr)}
        </p>
      </div>
    </div>
  );
}

/* 개발 시점 참조: 전체 고객 수(범례/센터 합계 검증용) */
export const _TOTAL = CUSTOMERS.length;
