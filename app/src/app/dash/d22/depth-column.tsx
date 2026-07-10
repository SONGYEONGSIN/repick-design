import { DEPTH_SCALE_MAX, OCEAN_ZONES, STATUS_LABEL, r2, type Dive } from "./data";

const W = 280;
const H = 560;
const TOP = 10;
const BOTTOM = 550;
const BAND_X = 64;
const BAND_W = 116;
const PATH_X0 = 96;
const PATH_X1 = 152;

const depthToY = (d: number) => r2(TOP + (d / DEPTH_SCALE_MAX) * (BOTTOM - TOP));

const TICKS = [0, 1000, 2000, 3000, 4000, 5000, 6000];

export function DepthColumn({ dive }: { dive: Dive }) {
  const maxDepthY = depthToY(dive.maxDepth);
  const pathPoints = dive.depthProfile.map((p) => {
    const x = r2(PATH_X0 + (p.t / dive.durationMin) * (PATH_X1 - PATH_X0));
    const y = depthToY(p.d);
    return { x, y };
  });
  const linePoints = pathPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${PATH_X0},${BOTTOM} ${linePoints} ${PATH_X1},${BOTTOM}`;
  const markerPoint = pathPoints.reduce((max, p) => (p.y > max.y ? p : max), pathPoints[0]);
  const isLive = dive.status === "in-progress";

  return (
    <div className="flex h-full flex-col gap-4">
      <svg
        role="img"
        aria-label={`수심 단면도: ${dive.site}, 최대 수심 ${dive.maxDepth.toLocaleString("ko-KR")}미터, 상태 ${STATUS_LABEL[dive.status]}`}
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto h-full w-full max-w-[280px]"
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <linearGradient id="hadal-depth-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12333a" stopOpacity="0.9" />
            <stop offset="8%" stopColor="#0f2830" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#0a1a20" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#060e12" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020404" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="hadal-path-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 수심 배경 밴드 — 표층 발광에서 심해 암흑으로 */}
        <rect x={BAND_X} y={TOP} width={BAND_W} height={BOTTOM - TOP} fill="url(#hadal-depth-band)" rx={2} />
        <rect x={BAND_X} y={TOP} width={BAND_W} height={BOTTOM - TOP} fill="none" stroke="var(--line)" strokeWidth={1} rx={2} />

        {/* 해양대 구분선 + 라벨 */}
        {OCEAN_ZONES.map((zone) => {
          const yTop = depthToY(zone.min);
          const yBottom = depthToY(zone.max);
          const yLabel = r2((yTop + yBottom) / 2);
          return (
            <g key={zone.label}>
              {zone.min > 0 && (
                <line x1={BAND_X} y1={yTop} x2={BAND_X + BAND_W} y2={yTop} stroke="var(--line-strong)" strokeWidth={1} strokeDasharray="2 3" />
              )}
              <text
                x={BAND_X + BAND_W + 8}
                y={yLabel}
                fill="var(--text-low)"
                fontSize={8.5}
                fontFamily="var(--font-mono)"
                letterSpacing="0.06em"
                dominantBaseline="middle"
              >
                {zone.label}
              </text>
            </g>
          );
        })}
        <text
          x={BAND_X + BAND_W + 8}
          y={r2((depthToY(6000) + depthToY(DEPTH_SCALE_MAX)) / 2) + 4}
          fill="var(--text-low)"
          fontSize={8.5}
          fontFamily="var(--font-mono)"
          letterSpacing="0.06em"
        >
          HADALPELAGIC ↓
        </text>

        {/* 눈금 */}
        {TICKS.map((tick) => (
          <g key={tick}>
            <line x1={BAND_X - 6} y1={depthToY(tick)} x2={BAND_X} y2={depthToY(tick)} stroke="var(--text-low)" strokeWidth={1} />
            <text x={BAND_X - 10} y={depthToY(tick) + 3} fill="var(--text-mid)" fontSize={9.5} fontFamily="var(--font-mono)" textAnchor="end">
              {tick.toLocaleString("ko-KR")}
            </text>
          </g>
        ))}

        {/* 다이브 경로 */}
        <polygon points={areaPoints} fill="url(#hadal-path-fill)" />
        <polyline points={linePoints} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* 최대 수심 마커 */}
        {isLive && <circle cx={markerPoint.x} cy={markerPoint.y} r={4} fill="none" stroke="var(--accent)" strokeWidth={1.5} className="hadal-pulse-ring" />}
        <circle cx={markerPoint.x} cy={markerPoint.y} r={4} fill="var(--accent)" className="hadal-glow-breathe" />
      </svg>

      {/* 접근성: 시각 차트와 동등한 텍스트 대안 */}
      <table className="sr-only">
        <caption>{dive.site} 수심 프로파일 (경과 분, 수심 m)</caption>
        <thead>
          <tr>
            <th scope="col">경과(분)</th>
            <th scope="col">수심(m)</th>
          </tr>
        </thead>
        <tbody>
          {dive.depthProfile.map((p) => (
            <tr key={p.t}>
              <td>{p.t}</td>
              <td>{p.d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
