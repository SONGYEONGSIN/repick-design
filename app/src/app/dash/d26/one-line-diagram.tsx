"use client";

import type { KeyboardEvent } from "react";
import {
  GEN_SOURCES,
  GEN_TYPE_LABEL,
  SUBSTATIONS,
  loadTier,
  LOAD_TIER_LABEL,
  mwFormatter,
  pctFormatter,
  type GenType,
  type Snapshot,
} from "./data";
import styles from "./console.module.css";

interface OneLineDiagramProps {
  snapshot: Snapshot;
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: GenType | "all";
}

const GEN_X: Record<string, number> = {
  "gen-pv1": 60,
  "gen-wd1": 220,
  "gen-lng1": 380,
  "gen-ess1": 540,
  "gen-pv2": 700,
  "gen-nu1": 840,
  "gen-lng2": 980,
};

const SUB_X: Record<string, number> = {
  "sub-il": 140,
  "sub-gs": 320,
  "sub-yd": 500,
  "sub-sw": 680,
  "sub-bp": 840,
  "sub-ic": 960,
};

const BUS_Y = 148;
const GEN_ICON_Y = 40;
const GEN_BREAKER_Y = 96;
const SUB_TRANSFORMER_Y = 210;
const SUB_ICON_Y = 268;
const BUS_A = { x1: 20, x2: 585 };
const BUS_B = { x1: 615, x2: 1010 };
const TIE_X = 600;

function handleActivateKey(event: KeyboardEvent, onActivate: () => void) {
  if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
    event.preventDefault();
    onActivate();
  }
}

export default function OneLineDiagram({ snapshot, selectedId, onSelect, filter }: OneLineDiagramProps) {
  const genState = (id: string) => snapshot.gens.find((g) => g.genId === id);
  const subState = (id: string) => snapshot.subs.find((s) => s.subId === id);

  return (
    <div>
      <div className={`${styles.scrollX} overflow-x-auto`}>
        <svg
          viewBox="0 0 1040 340"
          className="h-auto w-full min-w-[720px]"
          role="group"
          aria-labelledby="sld-title"
          aria-describedby="sld-desc"
        >
          <desc id="sld-desc">
            발전원에서 모선을 거쳐 변전소로 이어지는 단선 결선도. 호박색으로 빛나는 선은 통전 중,
            회색 점선은 개방된 차단기를 의미합니다. 발전기 또는 변전소를 선택하면 상세 정보가
            갱신됩니다.
          </desc>

          {/* 모선 (버스바) — 통전 시 은은한 글로우 */}
          <g aria-hidden="true">
            <line
              x1={BUS_A.x1}
              y1={BUS_Y}
              x2={BUS_A.x2}
              y2={BUS_Y}
              stroke="var(--amber)"
              strokeWidth={3}
              strokeLinecap="round"
              className={`${styles.busEnergized} ${styles.energizeGlow}`}
            />
            <line
              x1={BUS_B.x1}
              y1={BUS_Y}
              x2={BUS_B.x2}
              y2={BUS_Y}
              stroke="var(--amber)"
              strokeWidth={3}
              strokeLinecap="round"
              className={`${styles.busEnergized} ${styles.energizeGlow}`}
            />
            <text x={BUS_A.x1} y={BUS_Y - 10} fontFamily="var(--font-mono)" fontSize={11} fill="var(--ink-2)">
              BUS-A 345kV
            </text>
            <text x={BUS_B.x2} y={BUS_Y - 10} textAnchor="end" fontFamily="var(--font-mono)" fontSize={11} fill="var(--ink-2)">
              BUS-B 345kV
            </text>
            {/* 모선연계차단기 (상시 폐로) */}
            <rect x={TIE_X - 6} y={BUS_Y - 8} width={12} height={16} rx={2} fill="var(--amber-dim)" stroke="var(--amber)" strokeWidth={1.5} />
            <text x={TIE_X} y={BUS_Y + 26} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--ink-2)">
              TIE
            </text>
          </g>

          {/* 발전원 */}
          {GEN_SOURCES.map((gen) => {
            const x = GEN_X[gen.id];
            const state = genState(gen.id);
            if (!state) return null;
            const isOpen = state.breaker === "open";
            const isCharging = state.outputMW < 0;
            const isEnergized = !isOpen && state.outputMW > 0;
            const isSelected = selectedId === gen.id;
            const isDimmed = filter !== "all" && filter !== gen.type;

            const lineStroke = isOpen
              ? "var(--line-open)"
              : isCharging
                ? "var(--cyan)"
                : isEnergized
                  ? "var(--amber)"
                  : "var(--ink-2)";

            const label = `${gen.name}, 발전기, ${GEN_TYPE_LABEL[gen.type]}, ${
              isOpen ? "차단기 개방, 계통 분리" : `차단기 폐로, 출력 ${mwFormatter.format(Math.abs(state.outputMW))}메가와트 ${isCharging ? "충전 흡수" : "공급"}`
            }, 용량 ${mwFormatter.format(gen.capacityMW)}메가와트${isSelected ? ", 현재 선택됨" : ""}`;

            return (
              <g
                key={gen.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={label}
                className={styles.svgNode}
                opacity={isDimmed ? 0.28 : 1}
                onClick={() => onSelect(gen.id)}
                onKeyDown={(e) => handleActivateKey(e, () => onSelect(gen.id))}
              >
                {/* 터치 타겟 확장 히트영역 (시각적으로는 투명) */}
                <rect x={x - 32} y={GEN_ICON_Y - 16} width={64} height={GEN_BREAKER_Y + 16 - (GEN_ICON_Y - 16)} fill="transparent" />
                {/* 드롭 라인 */}
                <line
                  x1={x}
                  y1={GEN_ICON_Y + 12}
                  x2={x}
                  y2={GEN_BREAKER_Y - 8}
                  stroke={lineStroke}
                  strokeWidth={2}
                  strokeDasharray={isOpen ? "3 3" : undefined}
                  className={isEnergized ? styles.lineEnergized : undefined}
                />
                <line
                  x1={x}
                  y1={GEN_BREAKER_Y + 8}
                  x2={x}
                  y2={BUS_Y}
                  stroke={lineStroke}
                  strokeWidth={2}
                  strokeDasharray={isOpen ? "3 3" : undefined}
                  className={isEnergized ? styles.lineEnergized : undefined}
                />
                {/* 차단기 글리프 */}
                <rect
                  x={x - 6}
                  y={GEN_BREAKER_Y - 8}
                  width={12}
                  height={16}
                  rx={2}
                  fill={isOpen ? "var(--bg-2)" : isEnergized ? "var(--amber-dim)" : "var(--bg-2)"}
                  stroke={lineStroke}
                  strokeWidth={1.5}
                  className="nodeChrome"
                />
                {isOpen && (
                  <>
                    <line x1={x - 4} y1={GEN_BREAKER_Y - 6} x2={x + 4} y2={GEN_BREAKER_Y + 6} stroke={lineStroke} strokeWidth={1.5} />
                    <line x1={x + 4} y1={GEN_BREAKER_Y - 6} x2={x - 4} y2={GEN_BREAKER_Y + 6} stroke={lineStroke} strokeWidth={1.5} />
                  </>
                )}
                {/* 노드 플레이트 */}
                <rect
                  x={x - 19}
                  y={GEN_ICON_Y - 11}
                  width={38}
                  height={22}
                  rx={3}
                  fill={isSelected ? "var(--bg-3)" : "var(--bg-2)"}
                  stroke={isSelected ? "var(--cyan)" : "var(--hair-strong)"}
                  strokeWidth={isSelected ? 2 : 1.25}
                  className="nodeChrome"
                />
                <text
                  x={x}
                  y={GEN_ICON_Y + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fontWeight={600}
                  fill={isDimmed ? "var(--ink-2)" : "var(--ink-0)"}
                >
                  {gen.tag}
                </text>
                <text
                  x={x}
                  y={GEN_ICON_Y - 18}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill={isCharging ? "var(--cyan)" : isEnergized ? "var(--amber-strong)" : "var(--ink-2)"}
                >
                  {isOpen ? "OPEN" : `${isCharging ? "-" : ""}${mwFormatter.format(Math.abs(state.outputMW))}MW`}
                </text>
              </g>
            );
          })}

          {/* 변전소 */}
          {SUBSTATIONS.map((sub) => {
            const x = SUB_X[sub.id];
            const state = subState(sub.id);
            if (!state) return null;
            const ratio = (state.loadMW / sub.capacityMW) * 100;
            const tier = loadTier(ratio);
            const isSelected = selectedId === sub.id;
            const tierColor =
              tier === "overload" ? "var(--alarm)" : tier === "elevated" ? "var(--caution)" : "var(--ink-1)";

            const label = `${sub.name}, 변전소, ${sub.voltage}, 부하 ${mwFormatter.format(state.loadMW)}메가와트, 부하율 ${pctFormatter.format(ratio)}퍼센트, 상태 ${LOAD_TIER_LABEL[tier]}${isSelected ? ", 현재 선택됨" : ""}`;

            return (
              <g
                key={sub.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={label}
                className={styles.svgNode}
                onClick={() => onSelect(sub.id)}
                onKeyDown={(e) => handleActivateKey(e, () => onSelect(sub.id))}
              >
                {/* 터치 타겟 확장 히트영역 (시각적으로는 투명) */}
                <rect x={x - 32} y={SUB_TRANSFORMER_Y - 16} width={64} height={SUB_ICON_Y + 16 - (SUB_TRANSFORMER_Y - 16)} fill="transparent" />
                <line
                  x1={x}
                  y1={BUS_Y}
                  x2={x}
                  y2={SUB_TRANSFORMER_Y - 9}
                  stroke="var(--amber)"
                  strokeWidth={2}
                  className={styles.lineEnergized}
                />
                <line
                  x1={x}
                  y1={SUB_TRANSFORMER_Y + 9}
                  x2={x}
                  y2={SUB_ICON_Y - 11}
                  stroke="var(--amber)"
                  strokeWidth={2}
                  className={styles.lineEnergized}
                />
                <g aria-hidden="true">
                  <circle cx={x - 4} cy={SUB_TRANSFORMER_Y - 5} r={9} fill="var(--bg-1)" stroke="var(--hair-strong)" strokeWidth={1.5} />
                  <circle cx={x + 4} cy={SUB_TRANSFORMER_Y + 5} r={9} fill="var(--bg-1)" stroke="var(--hair-strong)" strokeWidth={1.5} />
                </g>
                <rect
                  x={x - 23}
                  y={SUB_ICON_Y - 11}
                  width={46}
                  height={22}
                  rx={3}
                  fill={isSelected ? "var(--bg-3)" : "var(--bg-2)"}
                  stroke={isSelected ? "var(--cyan)" : "var(--hair-strong)"}
                  strokeWidth={isSelected ? 2 : 1.25}
                  className="nodeChrome"
                />
                <text x={x} y={SUB_ICON_Y + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fontWeight={600} fill="var(--ink-0)">
                  {sub.tag}
                </text>
                <text x={x} y={SUB_ICON_Y + 24} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill={tierColor}>
                  {pctFormatter.format(ratio)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-[var(--hair)] pt-3 font-mono text-xs text-[var(--ink-2)]">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-[2px] w-4 rounded-full bg-[var(--amber)]" /> 통전(에너자이즈드)
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-[2px] w-4 rounded-full bg-[var(--cyan)]" /> ESS 충전 흡수
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-[2px] w-4 rounded-full border-t-2 border-dashed border-[var(--line-open)]" />
          개방(OPEN) — 계통 분리
        </li>
        <li>도형: □ 차단기 · ○○ 변압기</li>
      </ul>

      <table className="sr-only">
        <caption>단선 결선도 데이터 표 (스크린 리더 대체 표)</caption>
        <thead>
          <tr>
            <th scope="col">설비명</th>
            <th scope="col">구분</th>
            <th scope="col">상태</th>
            <th scope="col">출력/부하(MW)</th>
          </tr>
        </thead>
        <tbody>
          {GEN_SOURCES.map((gen) => {
            const state = genState(gen.id);
            if (!state) return null;
            return (
              <tr key={gen.id}>
                <td>{gen.name}</td>
                <td>{GEN_TYPE_LABEL[gen.type]} 발전기</td>
                <td>{state.breaker === "open" ? "차단기 개방" : "차단기 폐로"}</td>
                <td>{state.outputMW}</td>
              </tr>
            );
          })}
          {SUBSTATIONS.map((sub) => {
            const state = subState(sub.id);
            if (!state) return null;
            return (
              <tr key={sub.id}>
                <td>{sub.name}</td>
                <td>변전소 {sub.voltage}</td>
                <td>{LOAD_TIER_LABEL[loadTier((state.loadMW / sub.capacityMW) * 100)]}</td>
                <td>{state.loadMW}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
