"use client";

import {
  GEN_SOURCES,
  GEN_TYPE_LABEL,
  MERIT_ORDER,
  mwFormatter,
  type GenType,
  type Snapshot,
} from "./data";
import styles from "./console.module.css";

interface MeritOrderStackProps {
  snapshot: Snapshot;
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: GenType | "all";
}

const TOTAL_CAPACITY_MW = GEN_SOURCES.reduce((sum, g) => sum + g.capacityMW, 0);

const ORDERED = [...GEN_SOURCES].sort(
  (a, b) => MERIT_ORDER[a.type] - MERIT_ORDER[b.type] || b.capacityMW - a.capacityMW,
);

// 급전 순위 순으로 누적 설비용량(각 세그먼트의 시작 지점, MW)을 미리 계산 — 렌더 중 변수 재할당 없이 순수 함수로 처리
const SEGMENT_STARTS_MW = ORDERED.map((_, index) =>
  ORDERED.slice(0, index).reduce((sum, g) => sum + g.capacityMW, 0),
);

export default function MeritOrderStack({ snapshot, selectedId, onSelect, filter }: MeritOrderStackProps) {
  const demandMW = snapshot.subs.reduce((sum, s) => sum + s.loadMW, 0);
  const demandPct = Math.round(((demandMW / TOTAL_CAPACITY_MW) * 100 + Number.EPSILON) * 10) / 10;

  return (
    <div>
      <p className="mb-4 max-w-prose text-sm leading-relaxed text-[var(--ink-1)]">
        발전원을 한계비용(급전 우선순위) 순으로 나열한 설비용량 스택입니다. 수요선(점선) 왼쪽은
        급전 대상, 오른쪽은 예비 설비입니다. 회색 빗금은 차단기 개방으로 급전이 불가한 설비입니다.
      </p>

      <div className={`${styles.scrollX} overflow-x-auto pt-12`}>
        <div className="relative min-w-[640px]">
          <div
            className="flex h-16 w-full overflow-hidden rounded-sm border border-[var(--hair)] bg-[var(--bg-2)]"
            role="group"
            aria-label="급전 순위 스택"
          >
            {ORDERED.map((gen, index) => {
              const state = snapshot.gens.find((g) => g.genId === gen.id);
              const widthPct = (gen.capacityMW / TOTAL_CAPACITY_MW) * 100;
              const startMW = SEGMENT_STARTS_MW[index];
              const isOffline = state?.breaker === "open";
              const isDispatched = !isOffline && startMW < demandMW;
              const isSelected = selectedId === gen.id;
              const isDimmed = filter !== "all" && filter !== gen.type;

              const stateText = isOffline
                ? "차단기 개방, 급전 불가"
                : isDispatched
                  ? "급전 대상"
                  : "예비 설비";

              return (
                <button
                  key={gen.id}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${gen.name}, ${GEN_TYPE_LABEL[gen.type]}, 설비용량 ${mwFormatter.format(gen.capacityMW)}메가와트, ${stateText}${isSelected ? ", 현재 선택됨" : ""}`}
                  onClick={() => onSelect(gen.id)}
                  style={{ width: `${widthPct}%` }}
                  className={[
                    styles.stackSegment,
                    "group relative flex h-full min-w-11 flex-col items-center justify-center border-r border-[var(--bg-0)] px-1 text-center last:border-r-0",
                    isOffline
                      ? styles.offlineStripe
                      : isDispatched
                        ? "bg-[var(--amber-dim)]"
                        : "bg-[var(--bg-3)]",
                    isSelected ? "ring-2 ring-inset ring-[var(--cyan)]" : "",
                    isDimmed ? "opacity-30" : "opacity-100",
                  ].join(" ")}
                >
                  <span className="font-mono text-xs font-semibold text-[var(--ink-0)]">{gen.tag}</span>
                  <span className="font-mono text-xs tabular-nums text-[var(--ink-2)]">
                    {mwFormatter.format(gen.capacityMW)}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[-6px] border-l-2 border-dashed border-[var(--cyan)]"
            style={{ left: `${Math.min(demandPct, 100)}%` }}
          >
            <span className="absolute -top-5 -translate-x-1/2 whitespace-nowrap font-mono text-xs tabular-nums text-[var(--cyan)]">
              수요 {mwFormatter.format(demandMW)}MW
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 font-mono text-xs text-[var(--ink-2)]">
        총 설비용량 {mwFormatter.format(TOTAL_CAPACITY_MW)}MW 기준 · 실제 가동 예비력은 상단 KPI
        &ldquo;예비율&rdquo;을 참조하세요
      </p>
    </div>
  );
}
