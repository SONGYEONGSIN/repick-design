import { ACCENT } from "./tokens";

/**
 * Fixed pixel geometry shared between the desktop bracket layout and its
 * connector SVGs. The tree's skeleton (who faces whom, structurally) never
 * changes — only the listing occupying each card does, as the priority
 * toggle changes who wins. Every line drawn here is therefore always a
 * "this one advanced" line; losers simply have no outgoing line, exactly
 * as on a printed tournament bracket.
 */
export const TOTAL_H = 680;
export const GAP_W = 40;
export const R1_CENTERS = [76, 252, 428, 604] as const;
export const SEMI_CENTERS = [164, 516] as const;
export const FINAL_CENTER = 340;
export const CHAMPION_CENTER = 340;

const STROKE = 2;

function Seg({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1.toFixed(2)}
      y1={y1.toFixed(2)}
      x2={x2.toFixed(2)}
      y2={y2.toFixed(2)}
      stroke={ACCENT}
      strokeWidth={STROKE}
      strokeLinecap="round"
    />
  );
}

/** Merges two Round-of-8 matchups into one Semifinal slot, twice. */
export function ConnectorRoundToSemi() {
  const mid = GAP_W / 2;
  return (
    <svg
      width={GAP_W}
      height={TOTAL_H}
      viewBox={`0 0 ${GAP_W} ${TOTAL_H}`}
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <Seg x1={0} y1={R1_CENTERS[0]} x2={mid} y2={R1_CENTERS[0]} />
      <Seg x1={0} y1={R1_CENTERS[1]} x2={mid} y2={R1_CENTERS[1]} />
      <Seg x1={mid} y1={R1_CENTERS[0]} x2={mid} y2={R1_CENTERS[1]} />
      <Seg x1={mid} y1={SEMI_CENTERS[0]} x2={GAP_W} y2={SEMI_CENTERS[0]} />

      <Seg x1={0} y1={R1_CENTERS[2]} x2={mid} y2={R1_CENTERS[2]} />
      <Seg x1={0} y1={R1_CENTERS[3]} x2={mid} y2={R1_CENTERS[3]} />
      <Seg x1={mid} y1={R1_CENTERS[2]} x2={mid} y2={R1_CENTERS[3]} />
      <Seg x1={mid} y1={SEMI_CENTERS[1]} x2={GAP_W} y2={SEMI_CENTERS[1]} />
    </svg>
  );
}

/** Merges the two Semifinals into the Final slot. */
export function ConnectorSemiToFinal() {
  const mid = GAP_W / 2;
  return (
    <svg
      width={GAP_W}
      height={TOTAL_H}
      viewBox={`0 0 ${GAP_W} ${TOTAL_H}`}
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <Seg x1={0} y1={SEMI_CENTERS[0]} x2={mid} y2={SEMI_CENTERS[0]} />
      <Seg x1={0} y1={SEMI_CENTERS[1]} x2={mid} y2={SEMI_CENTERS[1]} />
      <Seg x1={mid} y1={SEMI_CENTERS[0]} x2={mid} y2={SEMI_CENTERS[1]} />
      <Seg x1={mid} y1={FINAL_CENTER} x2={GAP_W} y2={FINAL_CENTER} />
    </svg>
  );
}

/** Single straight line from the Final into the Champion leaf. */
export function ConnectorFinalToChampion() {
  return (
    <svg
      width={GAP_W}
      height={TOTAL_H}
      viewBox={`0 0 ${GAP_W} ${TOTAL_H}`}
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <Seg x1={0} y1={FINAL_CENTER} x2={GAP_W} y2={CHAMPION_CENTER} />
      <circle cx={GAP_W} cy={CHAMPION_CENTER} r={3} fill={ACCENT} />
    </svg>
  );
}
