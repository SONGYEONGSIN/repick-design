import {
  STATIONS,
  LINE_KM,
  LINE_NAME,
  WINDOW_MIN,
  NOW_T,
  formatClock,
  lerpRange,
  scheduledGhost,
  delayLabel,
  locationLabel,
  packLanes,
  type TrainSnapshot,
} from "./data";
import { AspectDot, LEVEL_TO_ASPECT, DOT_CLASS } from "./aspect-lamp";

const SVG_W = 1080;
const SVG_H = 420;
const PLOT_X1 = 92;
const PLOT_X2 = 1050;
const PLOT_Y1 = 20;
const PLOT_Y2 = 372;

function xt(t: number): number {
  return lerpRange(t, WINDOW_MIN, PLOT_X1, PLOT_X2);
}
function yk(km: number): number {
  return lerpRange(km, LINE_KM, PLOT_Y1, PLOT_Y2);
}

const TIME_TICKS = [0, 30, 60, 90, 120, 150, 180, 210, 240];
const MARKER_MIN_GAP = 34; // 라벨 겹침 방지 최소 수직 간격(px)
const MARKER_STEP = 112; // 겹칠 때 NOW선 기준 좌우로 벌리는 간격(px, 라벨 폭보다 크게)

function columnOffset(col: number): number {
  if (col === 0) return 0;
  const mag = Math.ceil(col / 2) * MARKER_STEP;
  return col % 2 === 1 ? mag : -mag;
}

interface Props {
  snapshot: TrainSnapshot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TrainGraph({ snapshot, selectedId, onSelect }: Props) {
  const columns = packLanes(snapshot, (s) => yk(s.km), MARKER_MIN_GAP);
  return (
    <div role="group" aria-label={`운행선도(시간-거리 다이어그램), ${LINE_NAME}, 06:00부터 10:00까지`}>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-3)]">
        <span className="inline-flex items-center gap-1.5">
          <AspectDot aspect="clear" /> 정시
        </span>
        <span className="inline-flex items-center gap-1.5">
          <AspectDot aspect="caution" /> 경미 지연
        </span>
        <span className="inline-flex items-center gap-1.5">
          <AspectDot aspect="stop" /> 지연
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg aria-hidden="true" width="14" height="2" className="opacity-70">
            <line x1={0} y1={1} x2={14} y2={1} stroke="var(--text-3)" strokeWidth={1.5} strokeDasharray="3 2" />
          </svg>
          계획 대비 지연폭
        </span>
      </div>

      <div className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--bg-inset)]">
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="block">
          <title>{`${LINE_NAME} 운행선도 — x축 시각, y축 거리(km). 열차를 선택해 상세정보를 확인할 수 있습니다.`}</title>

          {/* 역 그리드라인 + y축 라벨 */}
          {STATIONS.map((s) => {
            const y = yk(s.km);
            return (
              <g key={`gy-${s.id}`}>
                <line aria-hidden="true" x1={PLOT_X1} y1={y} x2={PLOT_X2} y2={y} stroke="var(--border)" strokeWidth={1} />
                <foreignObject x={0} y={y - 9} width={PLOT_X1 - 6} height={18}>
                  <div className="flex h-full items-center justify-end pr-1.5">
                    <span className="font-mono text-[10px] font-semibold tracking-wide text-[var(--text-3)]">{s.id}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* 시간 그리드라인 + x축 라벨 */}
          {TIME_TICKS.map((t) => {
            const xp = xt(t);
            return (
              <g key={`gx-${t}`}>
                <line aria-hidden="true" x1={xp} y1={PLOT_Y1} x2={xp} y2={PLOT_Y2} stroke="var(--border)" strokeWidth={1} />
                <foreignObject x={xp - 24} y={PLOT_Y2 + 6} width={48} height={18}>
                  <div className="flex h-full items-center justify-center">
                    <span className="font-mono text-[10px] tabular-nums text-[var(--text-3)]">{formatClock(t)}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* NOW 기준선 */}
          <line
            aria-hidden="true"
            x1={xt(NOW_T)}
            y1={PLOT_Y1}
            x2={xt(NOW_T)}
            y2={PLOT_Y2}
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <foreignObject x={xt(NOW_T) + 6} y={PLOT_Y1} width={90} height={18}>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              NOW {formatClock(NOW_T)}
            </span>
          </foreignObject>

          {/* 계획(지연 이전) 고스트 라인 */}
          {snapshot.map(({ train }) => {
            const ghost = scheduledGhost(train);
            if (!ghost) return null;
            const points = ghost.map((w) => `${xt(w.t)},${yk(w.km)}`).join(" ");
            const dim = selectedId !== null && selectedId !== train.id;
            return (
              <polyline
                key={`ghost-${train.id}`}
                aria-hidden="true"
                points={points}
                fill="none"
                stroke="var(--text-3)"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={dim ? 0.12 : 0.45}
              />
            );
          })}

          {/* 실적 라인 */}
          {snapshot.map(({ train, level }) => {
            const points = train.waypoints.map((w) => `${xt(w.t)},${yk(w.km)}`).join(" ");
            const aspect = LEVEL_TO_ASPECT[level];
            const selected = selectedId === train.id;
            const dim = selectedId !== null && !selected;
            return (
              <polyline
                key={`line-${train.id}`}
                aria-hidden="true"
                points={points}
                fill="none"
                stroke={`var(--${aspect})`}
                strokeWidth={selected ? 3 : 1.75}
                opacity={dim ? 0.2 : 1}
              />
            );
          })}

          {/* 실제 위치점 */}
          {snapshot.map((snap) => {
            const { train, km, level } = snap;
            const cy = yk(km);
            const aspect = LEVEL_TO_ASPECT[level];
            const dim = selectedId !== null && selectedId !== train.id;
            return (
              <circle
                key={`dot-${train.id}`}
                aria-hidden="true"
                cx={xt(NOW_T)}
                cy={cy}
                r={selectedId === train.id ? 4 : 3}
                fill={`var(--${aspect})`}
                opacity={dim ? 0.3 : 1}
              />
            );
          })}

          {/* 현재 위치 마커(겹침 시 NOW선 좌우로 분산, 실제 위치점과 리더선으로 연결) */}
          {snapshot.map((snap) => {
            const { train, km, level } = snap;
            const cy = yk(km);
            const offset = columnOffset(columns.get(snap) ?? 0);
            const cx = xt(NOW_T) + offset;
            const selected = selectedId === train.id;
            const aspect = LEVEL_TO_ASPECT[level];
            const dim = selectedId !== null && !selected;
            return (
              <g key={`pt-${train.id}`} opacity={dim ? 0.35 : 1}>
                {offset !== 0 && (
                  <line aria-hidden="true" x1={xt(NOW_T)} y1={cy} x2={cx} y2={cy} stroke="var(--border-strong)" strokeWidth={1} strokeDasharray="2 2" />
                )}
                <foreignObject x={cx - 44 + (offset > 0 ? 12 : offset < 0 ? -12 : 0)} y={cy - 12} width={128} height={24}>
                  <div className={`flex h-6 ${offset > 0 ? "justify-start" : offset < 0 ? "justify-end" : "justify-center"}`}>
                    <button
                      type="button"
                      onClick={() => onSelect(train.id)}
                      aria-pressed={selected}
                      aria-label={`${train.id}, ${locationLabel(train, NOW_T)}, ${delayLabel(train.delayMin)}. 선택하여 상세정보 보기`}
                      className={`flex h-6 items-center gap-1 rounded-full border pl-1 pr-2 font-mono text-[10px] font-semibold tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-inset)] ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)]"
                          : "border-[var(--border-strong)] bg-[var(--panel)] text-[var(--text-2)] hover:border-[var(--text-3)] hover:text-[var(--text)]"
                      }`}
                    >
                      <span aria-hidden="true" className={`inline-block size-1.5 shrink-0 rounded-full ${DOT_CLASS[aspect]}`} />
                      {train.id}
                    </button>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-[11px] text-[var(--text-3)]">
        기울기는 속도, 수평 구간은 정차를 의미합니다. 점선은 지연 발생 전 계획선이며 실적선과의 간격이 지연폭입니다. 실제 현재 위치는 원형 점이며, 라벨이 몰릴 경우 점선 리더선을 따라 좌우로 이동해 표시됩니다.
      </p>
      <span className="sr-only">
        {snapshot
          .map(
            (s) =>
              `${s.train.id}: ${locationLabel(s.train, NOW_T)}, ${delayLabel(s.train.delayMin)}`,
          )
          .join(". ")}
      </span>
    </div>
  );
}
