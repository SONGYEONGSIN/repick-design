import type { Player, Shot } from "./data";

type CourtDiagramProps = {
  shots: Shot[];
  selectedPlayer: Player | null;
};

/**
 * 하프코트 슛차트 다이어그램. 순수 SVG(경로 직접 작성), 외부 이미지 없음.
 * 성공(●)/실패(✕)를 색상 + 도형 이중 부호화 (색맹 사용자 대비).
 */
export default function CourtDiagram({ shots, selectedPlayer }: CourtDiagramProps) {
  return (
    <svg
      viewBox="0 0 500 460"
      role="img"
      aria-label={`슛 차트: 표시된 슛 ${shots.length}개${
        selectedPlayer ? `, ${selectedPlayer.name} 강조 표시` : ""
      }`}
      className="w-full h-auto"
    >
      {/* 코트 외곽 */}
      <rect x={10} y={10} width={480} height={440} fill="none" stroke="var(--bo-ink)" strokeWidth={4} />
      {/* 하프코트 라인(상단 경계) 라벨 */}
      <text x={250} y={34} textAnchor="middle" className="fill-[var(--bo-ink)]" fontSize={13} fontWeight={800} letterSpacing="0.08em">
        HALF COURT LINE →
      </text>

      {/* 3점 라인 */}
      <path
        d="M34,450 L34,300 A216,216 0 0 1 466,300 L466,450"
        fill="none"
        stroke="var(--bo-ink)"
        strokeWidth={4}
      />

      {/* 키(페인트존) */}
      <rect x={170} y={170} width={160} height={280} fill="none" stroke="var(--bo-ink)" strokeWidth={3.5} />

      {/* 자유투 서클 */}
      <circle cx={250} cy={170} r={60} fill="none" stroke="var(--bo-ink)" strokeWidth={3} strokeDasharray="10 6" />

      {/* 제한구역(노차지 아크) */}
      <path d="M210,401 A40,40 0 0 1 290,401" fill="none" stroke="var(--bo-ink)" strokeWidth={2.5} />

      {/* 백보드 + 림 */}
      <line x1={222} y1={414} x2={278} y2={414} stroke="var(--bo-ink)" strokeWidth={6} strokeLinecap="square" />
      <circle cx={250} cy={401} r={9} fill="none" stroke="var(--bo-orange)" strokeWidth={4} />

      {/* 슛 마커 */}
      {shots.map((s, i) => {
        const isSelected = selectedPlayer ? s.playerId === selectedPlayer.id : false;
        const dimmed = selectedPlayer ? !isSelected : false;
        const r = isSelected ? 7.5 : 5.5;
        const opacity = dimmed ? 0.16 : 1;
        if (s.made) {
          return (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={r}
              fill="var(--bo-orange)"
              stroke="var(--bo-ink)"
              strokeWidth={isSelected ? 2 : 1.25}
              opacity={opacity}
            />
          );
        }
        const d = r * 0.72;
        return (
          <g key={i} opacity={opacity} stroke="var(--bo-red)" strokeWidth={isSelected ? 3 : 2.25} strokeLinecap="round">
            <line x1={s.x - d} y1={s.y - d} x2={s.x + d} y2={s.y + d} />
            <line x1={s.x - d} y1={s.y + d} x2={s.x + d} y2={s.y - d} />
          </g>
        );
      })}
    </svg>
  );
}
