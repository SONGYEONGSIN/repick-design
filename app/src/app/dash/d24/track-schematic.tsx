import {
  STATIONS,
  LINE_KM,
  LINE_NAME,
  NOW_T,
  formatClock,
  lerpRange,
  locationLabel,
  delayLabel,
  stationName,
  packLanes,
  type SignalState,
  type TrainSnapshot,
} from "./data";
import { AspectBadge, AspectDot, LEVEL_TO_ASPECT, DOT_CLASS } from "./aspect-lamp";

const SVG_W = 1200;
const SVG_H = 360;
const TRACK_X1 = 110;
const TRACK_X2 = 1120;
const BASE_Y = 176;
const TICK_TOP = 164;
const TICK_BOTTOM = 188;
const SIGNAL_Y = 130;
const SIGNAL_H = 22;
const STATION_LABEL_Y = 196;
const STATION_LABEL_H = 50;

const LANE_H = 26;
const LANE_GAP = 6;
const LANE_STEP = LANE_H + LANE_GAP;
const UP_ZONE_BOTTOM = 124; // 상행 마커 영역 하단(신호 라벨 위)
const DOWN_ZONE_TOP = 258; // 하행 마커 영역 상단(역명 라벨 아래)
const MARKER_W = 100;
const MIN_GAP = 108; // 마커 겹침 방지 최소 간격(px)

function x(km: number): number {
  return lerpRange(km, LINE_KM, TRACK_X1, TRACK_X2);
}

function upLaneTop(lane: number): number {
  return UP_ZONE_BOTTOM - LANE_H - lane * LANE_STEP;
}

function downLaneTop(lane: number): number {
  return DOWN_ZONE_TOP + lane * LANE_STEP;
}

interface Props {
  snapshot: TrainSnapshot[];
  signals: SignalState[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TrackSchematic({ snapshot, signals, selectedId, onSelect }: Props) {
  const blockOccupant = STATIONS.slice(0, -1).map((_, i) =>
    snapshot.find((s) => s.location.type === "block" && s.location.blockIndex === i),
  );

  const upItems = snapshot.filter((s) => s.train.direction === "up");
  const downItems = snapshot.filter((s) => s.train.direction === "down");
  const upLanes = packLanes(upItems, (s) => x(s.km), MIN_GAP);
  const downLanes = packLanes(downItems, (s) => x(s.km), MIN_GAP);

  function laneTopFor(snap: TrainSnapshot): number {
    return snap.train.direction === "up" ? upLaneTop(upLanes.get(snap) ?? 0) : downLaneTop(downLanes.get(snap) ?? 0);
  }

  return (
    <div role="group" aria-label={`선로 계통도, ${LINE_NAME}, ${formatClock(NOW_T)} 스냅샷 기준 재선 열차 위치`}>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-3)]">
        <span className="inline-flex items-center gap-1.5">
          <AspectDot aspect="clear" /> 진행
        </span>
        <span className="inline-flex items-center gap-1.5">
          <AspectDot aspect="caution" /> 경계
        </span>
        <span className="inline-flex items-center gap-1.5">
          <AspectDot aspect="stop" /> 정지
        </span>
        <span className="inline-flex items-center gap-1.5">
          <AspectDot aspect="restrict" /> 제한
        </span>
        <span className="ms-auto">상행 위 · 하행 아래 · 단선 + 교행대피선</span>
      </div>

      <div className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--bg-inset)]">
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="block">
          <title>{`${LINE_NAME} 선로 계통도 — 열차 마커를 선택해 상세정보를 확인할 수 있습니다.`}</title>

          {/* 폐색 구간 점유 대역 */}
          {STATIONS.slice(0, -1).map((s, i) => {
            const occ = blockOccupant[i];
            const x1 = x(s.km);
            const x2 = x(STATIONS[i + 1].km);
            const aspect = occ ? LEVEL_TO_ASPECT[occ.level] : null;
            const colorVar = aspect ? `var(--${aspect})` : "var(--border)";
            return (
              <rect
                key={`blk-${s.id}`}
                aria-hidden="true"
                x={x1}
                y={BASE_Y - 5}
                width={x2 - x1}
                height={10}
                fill={colorVar}
                fillOpacity={aspect ? 0.22 : 0.5}
                stroke={colorVar}
                strokeOpacity={aspect ? 0.85 : 0.6}
                strokeWidth={1.5}
              />
            );
          })}

          {/* 본선 */}
          <line aria-hidden="true" x1={TRACK_X1} y1={BASE_Y} x2={TRACK_X2} y2={BASE_Y} stroke="var(--border-strong)" strokeWidth={2} />

          {/* 역 표 + 교행대피선 */}
          {STATIONS.map((s) => {
            const sx = x(s.km);
            return (
              <g key={s.id} aria-hidden="true">
                <line x1={sx} y1={TICK_TOP} x2={sx} y2={TICK_BOTTOM} stroke="var(--border-strong)" strokeWidth={2} />
                <path
                  d={`M ${sx - 16} ${TICK_BOTTOM} Q ${sx} ${TICK_BOTTOM + 12} ${sx + 16} ${TICK_BOTTOM}`}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
                <line x1={sx} y1={SIGNAL_Y + SIGNAL_H} x2={sx} y2={TICK_TOP} stroke="var(--border)" strokeWidth={1} strokeDasharray="2 3" />
              </g>
            );
          })}

          {/* 신호기 현시 */}
          {signals.map((sig) => {
            const s = STATIONS.find((st) => st.id === sig.stationId)!;
            const sx = x(s.km);
            return (
              <foreignObject key={`sig-${sig.stationId}`} x={sx - 70} y={SIGNAL_Y} width={140} height={SIGNAL_H}>
                <div className="flex h-full items-center justify-center">
                  <AspectBadge aspect={sig.aspect} dense />
                </div>
              </foreignObject>
            );
          })}

          {/* 역명 라벨 */}
          {STATIONS.map((s) => {
            const sx = x(s.km);
            return (
              <foreignObject key={`lbl-${s.id}`} x={sx - 75} y={STATION_LABEL_Y} width={150} height={STATION_LABEL_H}>
                <div className="flex h-full flex-col items-center justify-start text-center leading-tight">
                  <span className="font-mono text-[13px] font-bold tracking-wide text-[var(--text)]">{s.id}</span>
                  <span className="text-[10px] text-[var(--text-3)]">{s.name}</span>
                  <span className="font-mono text-[10px] tabular-nums text-[var(--text-3)]">km {s.km.toFixed(1)}</span>
                </div>
              </foreignObject>
            );
          })}

          {/* 열차 리더선 */}
          {snapshot.map((snap) => {
            const { train, km } = snap;
            const sx = x(km);
            const isUp = train.direction === "up";
            const laneTop = laneTopFor(snap);
            return (
              <line
                key={`lead-${train.id}`}
                aria-hidden="true"
                x1={sx}
                y1={isUp ? laneTop + LANE_H : BASE_Y}
                x2={sx}
                y2={isUp ? BASE_Y : laneTop}
                stroke={selectedId === train.id ? "var(--accent)" : "var(--border-strong)"}
                strokeWidth={selectedId === train.id ? 2 : 1}
              />
            );
          })}

          {/* 열차 마커 */}
          {snapshot.map((snap) => {
            const { train, km, level } = snap;
            const sx = x(km);
            const isUp = train.direction === "up";
            const selected = selectedId === train.id;
            const aspect = LEVEL_TO_ASPECT[level];
            const laneTop = laneTopFor(snap);
            return (
              <foreignObject key={`mk-${train.id}`} x={sx - MARKER_W / 2} y={laneTop} width={MARKER_W} height={LANE_H}>
                <button
                  type="button"
                  onClick={() => onSelect(train.id)}
                  aria-pressed={selected}
                  aria-label={`${train.id}, ${isUp ? "상행" : "하행"}, ${locationLabel(train, NOW_T)}, ${delayLabel(train.delayMin)}. 선택하여 상세정보 보기`}
                  className={`flex h-full w-full items-center justify-center gap-1.5 rounded-sm border px-1.5 font-mono text-[11px] font-semibold tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-inset)] ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)]"
                      : "border-[var(--border-strong)] bg-[var(--panel)] text-[var(--text-2)] hover:border-[var(--text-3)] hover:text-[var(--text)]"
                  }`}
                >
                  <span aria-hidden="true" className={`inline-block size-1.5 shrink-0 rounded-full ${DOT_CLASS[aspect]}`} />
                  {train.id}
                </button>
              </foreignObject>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-[11px] text-[var(--text-3)]">
        점유 구간은 지연도로 채색됩니다(진행 · 경계 · 정지). 열차를 선택하면 운행선도와 상세정보, 현황표가 함께 갱신됩니다. 전체 수치는{" "}
        <a href="#roster" className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--text)]">
          열차 현황표
        </a>
        를 참고하세요.
      </p>
      <span className="sr-only">
        {STATIONS.map((s) => stationName(s.id)).join(", ")} 역을 지나는 {LINE_NAME} 상의 열차 {snapshot.length}편성 표시 중.
      </span>
    </div>
  );
}
