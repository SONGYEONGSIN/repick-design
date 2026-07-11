import { CONTACT_TYPE_LABEL, r2, type ContactType, type Dive } from "./data";

const CX = 150;
const CY = 150;
const R_MAX = 130;
const RANGE_MAX = 400;

function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: r2(CX + radius * Math.cos(rad)), y: r2(CY + radius * Math.sin(rad)) };
}

const RING_STEPS = [1, 2, 3, 4];
const SPOKES = [0, 45, 90, 135, 180, 225, 270, 315];

const SHAPE_LEGEND: { type: ContactType; glyph: string }[] = [
  { type: "biological", glyph: "●" },
  { type: "geological", glyph: "▲" },
  { type: "anthropogenic", glyph: "■" },
  { type: "sample-site", glyph: "◆" },
];

function ContactMark({ type, cx, cy, pulse }: { type: ContactType; cx: number; cy: number; pulse: boolean }) {
  const common = { fill: "var(--accent)" } as const;
  const shape = (() => {
    switch (type) {
      case "biological":
        return <circle cx={cx} cy={cy} r={3.4} {...common} />;
      case "geological":
        return <polygon points={`${cx},${r2(cy - 4)} ${r2(cx + 3.8)},${r2(cy + 3.2)} ${r2(cx - 3.8)},${r2(cy + 3.2)}`} fill="var(--warn)" />;
      case "anthropogenic":
        return <rect x={r2(cx - 3.2)} y={r2(cy - 3.2)} width={6.4} height={6.4} fill="var(--text-mid)" />;
      case "sample-site":
        return (
          <polygon
            points={`${cx},${r2(cy - 4.2)} ${r2(cx + 4.2)},${cy} ${cx},${r2(cy + 4.2)} ${r2(cx - 4.2)},${cy}`}
            {...common}
          />
        );
    }
  })();
  return (
    <g>
      {pulse && <circle cx={cx} cy={cy} r={4} fill="none" stroke="var(--accent)" strokeWidth={1.2} className="hadal-pulse-ring" />}
      {shape}
    </g>
  );
}

export function SonarSweep({ dive }: { dive: Dive }) {
  const wedgeA = polar(-24, R_MAX);
  const wedgeB = polar(24, R_MAX);
  const isLive = dive.status === "in-progress";

  return (
    <div className="flex h-full flex-col gap-4">
      <svg
        role="img"
        aria-label={`소나 스윕: ${dive.site} 반경 400m 내 접촉 ${dive.sonarContacts.length}건`}
        viewBox="0 0 300 300"
        className="mx-auto aspect-square w-full max-w-[300px] shrink-0"
      >
        {RING_STEPS.map((step) => (
          <circle key={step} cx={CX} cy={CY} r={r2((R_MAX / 4) * step)} fill="none" stroke="var(--line)" strokeWidth={1} />
        ))}
        {SPOKES.map((deg) => {
          const p = polar(deg, R_MAX);
          return <line key={deg} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="var(--line)" strokeWidth={1} />;
        })}
        {RING_STEPS.map((step) => {
          const label = polar(45, r2((R_MAX / 4) * step));
          return (
            <text key={step} x={r2(label.x + 4)} y={r2(label.y)} fill="var(--text-low)" fontSize={7.5} fontFamily="var(--font-mono)">
              {step * 100}m
            </text>
          );
        })}
        {["N", "E", "S", "W"].map((dir, i) => {
          const p = polar(i * 90, R_MAX + 14);
          return (
            <text key={dir} x={p.x} y={r2(p.y + 3)} fill="var(--text-mid)" fontSize={9} fontFamily="var(--font-mono)" textAnchor="middle">
              {dir}
            </text>
          );
        })}

        {isLive && (
          <g className="hadal-sweep-beam">
            <path d={`M${CX},${CY} L${wedgeA.x},${wedgeA.y} A${R_MAX},${R_MAX} 0 0 1 ${wedgeB.x},${wedgeB.y} Z`} fill="var(--accent)" opacity={0.12} />
            <line x1={CX} y1={CY} x2={wedgeB.x} y2={wedgeB.y} stroke="var(--accent)" strokeWidth={1.6} className="hadal-glow-breathe" />
          </g>
        )}

        <circle cx={CX} cy={CY} r={2.5} fill="var(--text-hi)" />

        {dive.sonarContacts.map((c) => {
          const p = polar(c.angle, r2((c.range / RANGE_MAX) * R_MAX));
          return (
            <g key={c.label}>
              <ContactMark type={c.type} cx={p.x} cy={p.y} pulse={c.type === "sample-site"} />
              <text x={r2(p.x + 7)} y={r2(p.y + 2.5)} fill="var(--text-mid)" fontSize={7.5} fontFamily="var(--font-sans)">
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="flex shrink-0 flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--line)] pt-3" aria-label="접촉 유형 범례">
        {SHAPE_LEGEND.map((item) => (
          <li key={item.type} className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-mid)]">
            <span aria-hidden className="font-mono text-[var(--accent-dim)]">
              {item.glyph}
            </span>
            {CONTACT_TYPE_LABEL[item.type]}
          </li>
        ))}
      </ul>

      <div className="flex min-h-0 flex-1 flex-col border-t border-[var(--line)] pt-3">
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-low)]">
          접촉 로그 · {dive.sonarContacts.length}건
        </p>
        <ul className="flex flex-1 flex-col justify-around gap-1.5 py-1.5">
          {dive.sonarContacts.map((c) => (
            <li key={c.label} className="flex items-center justify-between gap-3 font-mono text-[10px]">
              <span className="truncate text-[var(--text-hi)]">{c.label}</span>
              <span className="shrink-0 text-[var(--text-low)]">
                {CONTACT_TYPE_LABEL[c.type]} · {c.angle}° · {c.range}m
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
