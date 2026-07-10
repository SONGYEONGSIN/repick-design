import styles from "./deco.module.css";

interface RadialWheelProps {
  monthLabels: string[];
  counts: number[];
  selectedMonth: number | null;
  onSelectMonth: (month: number | null) => void;
}

const MARKER_POS = [
  styles.m0, styles.m1, styles.m2, styles.m3, styles.m4, styles.m5,
  styles.m6, styles.m7, styles.m8, styles.m9, styles.m10, styles.m11,
];

/** 12방향 좌표 (반경 42%, 12시 방향부터 시계방향, 결정론적 사전계산) */
const ANGLE_STEP = (2 * Math.PI) / 12;

// 서버/클라이언트 JS 엔진 간 삼각함수 마지막 자리 오차(1ULP)로 인한
// 하이드레이션 불일치를 막기 위해 소수 둘째 자리로 고정한다.
function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function rayEnd(index: number, radius: number) {
  const angle = -Math.PI / 2 + index * ANGLE_STEP;
  return {
    x: round2(50 + radius * Math.cos(angle)),
    y: round2(50 + radius * Math.sin(angle)),
  };
}

/** 월별 갱신·기한 관제 — 방사형 도킷 휠. 시각화는 SVG(장식), 상호작용은 원형 버튼(HTML)으로 분리. */
export default function RadialWheel({ monthLabels, counts, selectedMonth, onSelectMonth }: RadialWheelProps) {
  const maxCount = Math.max(...counts, 1);
  const total = counts.reduce((sum, c) => sum + c, 0);

  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className={`relative mx-auto size-[240px] sm:size-[300px] ${styles.wheelFace}`}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx={50} cy={50} r={36} fill="none" stroke="var(--navy-800)" strokeWidth={0.5} />
          <circle cx={50} cy={50} r={22} fill="none" stroke="var(--navy-800)" strokeWidth={0.5} />
          {counts.map((count, i) => {
            const bucket = count === 0 ? 0 : Math.max(1, Math.ceil((count / maxCount) * 5));
            const radius = 10 + bucket * 5.2;
            const end = rayEnd(i, radius);
            const isSelected = selectedMonth === i + 1;
            return (
              <line
                key={monthLabels[i]}
                x1={50}
                y1={50}
                x2={end.x}
                y2={end.y}
                stroke={isSelected ? "var(--gold-300)" : "var(--gold-800)"}
                strokeWidth={isSelected ? 2.4 : 1.6}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {monthLabels.map((label, i) => {
          const monthNum = i + 1;
          const isSelected = selectedMonth === monthNum;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelectMonth(isSelected ? null : monthNum)}
              aria-pressed={isSelected}
              className={`${styles.marker} ${MARKER_POS[i]} ${styles.monthBtn} ${isSelected ? styles.monthBtnActive : ""} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-300)]`}
            >
              <span aria-hidden="true">{monthNum}</span>
              <span className="sr-only">
                {label} 마감 {counts[i]}건{isSelected ? " · 선택됨, 다시 누르면 선택 해제" : ", 선택하여 목록 필터링"}
              </span>
            </button>
          );
        })}

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-[family-name:var(--font-deco-latin)] text-3xl leading-none text-[var(--ivory)]">
            {selectedMonth ? counts[selectedMonth - 1] : total}
          </span>
          <span className="mt-1 text-[11px] tracking-wide text-[var(--slate)]">
            {selectedMonth ? `${monthLabels[selectedMonth - 1]} 마감 건수` : "연간 마감 총계"}
          </span>
        </div>
      </div>

      {selectedMonth ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => onSelectMonth(null)}
            className="rounded-full border border-[var(--gold-800)] px-3 py-1.5 text-xs text-[var(--slate)] transition-colors hover:border-[var(--gold-500)] hover:text-[var(--ivory)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-300)] motion-reduce:transition-none"
          >
            {monthLabels[selectedMonth - 1]} 선택 해제
          </button>
        </div>
      ) : null}
    </div>
  );
}
