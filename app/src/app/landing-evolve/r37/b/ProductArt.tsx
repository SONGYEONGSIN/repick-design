import { ACCENT } from "./theme";
import type { ProductArtKind } from "./data";

/**
 * Hand-built flat vector illustrations — one per product category, no raster
 * images anywhere on this route. Deterministic markup (no randomness), flat
 * fills only (no gradients), a single accent highlight per illustration so
 * the accent hue stays visually present without turning decorative.
 * Purely decorative relative to the card's own visible title text, so each
 * root `<svg>` is `aria-hidden`.
 */
export default function ProductArt({ kind }: { kind: ProductArtKind }) {
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
      {kind === "jacket" && <JacketArt />}
      {kind === "tote" && <ToteArt />}
      {kind === "lamp" && <LampArt />}
      {kind === "boots" && <BootsArt />}
    </svg>
  );
}

function JacketArt() {
  return (
    <g>
      <path d="M70 55 L130 55 L148 190 L52 190 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth={2} />
      <path d="M70 55 L38 60 L20 135 L50 145 L64 90 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth={2} />
      <path d="M130 55 L162 60 L180 135 L150 145 L136 90 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth={2} />
      <path d="M84 55 L100 78 L116 55" fill="none" stroke="#64748B" strokeWidth={2} />
      <line x1={100} y1={80} x2={100} y2={186} stroke={ACCENT} strokeWidth={3} />
      <circle cx={100} cy={104} r={3.5} fill={ACCENT} />
      <circle cx={100} cy={132} r={3.5} fill={ACCENT} />
      <circle cx={100} cy={160} r={3.5} fill={ACCENT} />
    </g>
  );
}

function ToteArt() {
  return (
    <g>
      <path
        d="M78 88 C78 55 92 48 100 48 C108 48 122 55 122 88"
        fill="none"
        stroke="#64748B"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <rect x={52} y={86} width={96} height={92} rx={12} fill="#CBD5E1" stroke="#64748B" strokeWidth={2} />
      <line x1={64} y1={104} x2={136} y2={104} stroke={ACCENT} strokeWidth={3} strokeDasharray="6 5" />
      <rect x={92} y={128} width={16} height={12} rx={2} fill="#64748B" />
    </g>
  );
}

function LampArt() {
  return (
    <g>
      <ellipse cx={100} cy={188} rx={38} ry={8} fill="#CBD5E1" stroke="#64748B" strokeWidth={2} />
      <rect x={97} y={110} width={6} height={78} fill="#94A3B8" />
      <path d="M68 62 L132 62 L152 110 L48 110 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth={2} />
      <line x1={68} y1={62} x2={132} y2={62} stroke={ACCENT} strokeWidth={3} />
    </g>
  );
}

function BootsArt() {
  return (
    <g>
      <path
        d="M42 188 L42 130 Q42 112 60 112 L74 112 L74 92 L94 92 L94 150 L112 150 L112 178 Q112 188 100 188 Z"
        fill="#CBD5E1"
        stroke="#64748B"
        strokeWidth={2}
      />
      <rect x={38} y={184} width={78} height={10} rx={4} fill={ACCENT} />
      <line x1={78} y1={102} x2={90} y2={112} stroke="#64748B" strokeWidth={2} />
      <line x1={78} y1={118} x2={90} y2={128} stroke="#64748B" strokeWidth={2} />

      <path
        d="M126 188 L126 130 Q126 112 144 112 L158 112 L158 92 L178 92 L178 150 L196 150 L196 178 Q196 188 184 188 Z"
        fill="#CBD5E1"
        stroke="#64748B"
        strokeWidth={2}
      />
      <rect x={122} y={184} width={78} height={10} rx={4} fill={ACCENT} />
      <line x1={162} y1={102} x2={174} y2={112} stroke="#64748B" strokeWidth={2} />
      <line x1={162} y1={118} x2={174} y2={128} stroke="#64748B" strokeWidth={2} />
    </g>
  );
}
