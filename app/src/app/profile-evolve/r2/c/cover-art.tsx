import type { ReactElement } from "react";
import { hashString } from "./hash";
import type { Discipline } from "./data";

// Deterministic, discipline-themed SVG cover art — no photo, no remote image host, so content is
// fully controlled (never random-content risk) and never fails to load. All coordinates are rounded
// to 2 decimal places to avoid float-formatting drift between server and client render.
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function StaircaseMotif({ seed }: { seed: string }) {
  const h = hashString(seed);
  const bars = [0, 1, 2, 3].map((i) => {
    const jitter = ((h >> (i * 4)) % 10) / 10;
    return round2(18 + i * 12 + jitter * 4);
  });
  return (
    <g>
      {bars.map((height, i) => (
        <rect
          key={i}
          x={round2(16 + i * 22)}
          y={round2(84 - height)}
          width={16}
          height={height}
          rx={2}
          fill={i === bars.length - 1 ? "#eff6ff" : "#bedbff"}
          fillOpacity={i === bars.length - 1 ? 0.95 : 0.55 + i * 0.1}
        />
      ))}
    </g>
  );
}

function FunnelMotif({ seed }: { seed: string }) {
  const h = hashString(seed);
  const skew = round2(((h % 10) - 5) * 0.6);
  const widths = [86, 62, 40, 22];
  return (
    <g transform={`translate(${round2(52 + skew)} 18)`}>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={round2(-w / 2)}
          y={i * 18}
          width={w}
          height={14}
          rx={2}
          fill="#bedbff"
          fillOpacity={round2(0.4 + i * 0.16)}
        />
      ))}
    </g>
  );
}

function LoopMotif({ seed }: { seed: string }) {
  const h = hashString(seed);
  const r1 = round2(20 + ((h % 8) as number));
  const r2 = round2(30 + (((h >> 6) % 8) as number));
  return (
    <g transform="translate(52 50)">
      <circle r={r2} fill="none" stroke="#eff6ff" strokeOpacity={0.5} strokeWidth={3} strokeDasharray="7 6" />
      <circle r={r1} fill="none" stroke="#bedbff" strokeOpacity={0.7} strokeWidth={4} />
      <circle r={4} fill="#eff6ff" />
    </g>
  );
}

function GridMotif({ seed }: { seed: string }) {
  const h = hashString(seed);
  const cells = Array.from({ length: 16 }, (_, i) => i);
  const highlighted = new Set([h % 16, (h >> 3) % 16, (h >> 6) % 16]);
  return (
    <g transform="translate(20 14)">
      {cells.map((i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const active = highlighted.has(i);
        return (
          <rect
            key={i}
            x={col * 18}
            y={row * 18}
            width={13}
            height={13}
            rx={2}
            fill={active ? "#eff6ff" : "#bedbff"}
            fillOpacity={active ? 0.95 : 0.45}
          />
        );
      })}
    </g>
  );
}

const MOTIF: Record<Discipline, (props: { seed: string }) => ReactElement> = {
  Onboarding: StaircaseMotif,
  Conversion: FunnelMotif,
  Retention: LoopMotif,
  Systems: GridMotif,
};

export default function CoverArt({ seed, discipline }: { seed: string; discipline: Discipline }) {
  const Motif = MOTIF[discipline];
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-blue-800">
      <svg viewBox="0 0 104 104" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="104" height="104" fill="#1447e6" />
        <Motif seed={seed} />
      </svg>
    </div>
  );
}
