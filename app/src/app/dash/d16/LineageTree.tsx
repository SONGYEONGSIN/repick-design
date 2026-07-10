import { lineageParents, lineageF1, lineageF2, lineageTimeline, type LineageNode } from "./data";

const NODE_W = 210;
const NODE_H = 66;

const parentA = { x: 30, y: 10 };
const parentB = { x: 370, y: 10 };
const f1 = { x: 200, y: 142 };
const f2a = { x: 30, y: 274 };
const f2b = { x: 370, y: 274 };

const centerX = (n: { x: number }) => n.x + NODE_W / 2;
const bottomY = (n: { y: number }) => n.y + NODE_H;

function Node({ pos, node }: { pos: { x: number; y: number }; node: LineageNode }) {
  return (
    <g>
      <rect
        x={pos.x}
        y={pos.y}
        width={NODE_W}
        height={NODE_H}
        fill="var(--lin-card)"
        stroke="var(--lin-sepia)"
        strokeWidth="1"
      />
      <rect x={pos.x + 6} y={pos.y + 6} width={NODE_W - 12} height={NODE_H - 12} fill="none" stroke="var(--lin-border)" strokeWidth="1" />
      <polygon
        points={`${pos.x + 14},${pos.y + 12} ${pos.x + 20},${pos.y + 18} ${pos.x + 14},${pos.y + 24} ${pos.x + 8},${pos.y + 18}`}
        fill="var(--lin-sage-deep)"
      />
      <text x={pos.x + 30} y={pos.y + 24} fontSize="12" fontStyle="italic" fill="var(--lin-ink)">
        {node.name.length > 26 ? node.name.slice(0, 25) + "…" : node.name}
      </text>
      <text x={pos.x + 14} y={pos.y + 40} fontSize="10" fill="var(--lin-ink-muted)">
        {node.accession}
      </text>
      <text x={pos.x + 14} y={pos.y + 54} fontSize="9.5" fill="var(--lin-ink-muted)">
        {node.role}
      </text>
      <title>
        {node.name} ({node.accession}) — {node.role}
      </title>
    </g>
  );
}

/** Two points merge into one (e.g. both parents into an F1 node). */
function Merge({ from1, from2, to }: { from1: { x: number; y: number }; from2: { x: number; y: number }; to: { x: number; y: number } }) {
  const midY = (from1.y + to.y) / 2;
  return (
    <g stroke="var(--lin-sepia)" strokeWidth="1.2" fill="none">
      <line x1={from1.x} y1={from1.y} x2={from1.x} y2={midY} />
      <line x1={from2.x} y1={from2.y} x2={from2.x} y2={midY} />
      <line x1={from1.x} y1={midY} x2={from2.x} y2={midY} />
      <line x1={to.x} y1={midY} x2={to.x} y2={to.y} />
    </g>
  );
}

/** One point splits into two (e.g. F1 into two F2 selections). */
function Split({ from, to1, to2 }: { from: { x: number; y: number }; to1: { x: number; y: number }; to2: { x: number; y: number } }) {
  const midY = (from.y + to1.y) / 2;
  return (
    <g stroke="var(--lin-sepia)" strokeWidth="1.2" fill="none">
      <line x1={from.x} y1={from.y} x2={from.x} y2={midY} />
      <line x1={to1.x} y1={midY} x2={to2.x} y2={midY} />
      <line x1={to1.x} y1={midY} x2={to1.x} y2={to1.y} />
      <line x1={to2.x} y1={midY} x2={to2.x} y2={to2.y} />
    </g>
  );
}

export default function LineageTree() {
  const p1 = { x: centerX(parentA), y: bottomY(parentA) };
  const p2 = { x: centerX(parentB), y: bottomY(parentB) };
  const f1Top = { x: centerX(f1), y: f1.y };
  const f1Bottom = { x: centerX(f1), y: bottomY(f1) };
  const c1 = { x: centerX(f2a), y: f2a.y };
  const c2 = { x: centerX(f2b), y: f2b.y };

  const description = `${lineageParents[0].name}와(과) ${lineageParents[1].name}의 교배로 ${lineageF1.name}(${lineageF1.accession})이 등록되었고, 그 F2 세대에서 ${lineageF2[0].name}, ${lineageF2[1].name} 두 계통이 선발되었습니다.`;

  return (
    <figure className="m-0">
      <div className="lin-scroll-x overflow-x-auto">
        <svg viewBox="0 0 610 360" role="img" aria-label={description} className="h-auto w-full min-w-[520px]">
          <Merge from1={p1} from2={p2} to={f1Top} />
          <Split from={f1Bottom} to1={c1} to2={c2} />

          <Node pos={parentA} node={lineageParents[0]} />
          <Node pos={parentB} node={lineageParents[1]} />
          <Node pos={f1} node={lineageF1} />
          <Node pos={f2a} node={lineageF2[0]} />
          <Node pos={f2b} node={lineageF2[1]} />
        </svg>
      </div>
      <figcaption className="mt-3 text-xs text-[var(--lin-ink-muted)]">{lineageTimeline}</figcaption>
    </figure>
  );
}
