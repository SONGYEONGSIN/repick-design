"use client";

import { CATEGORY_META, type Category, type Service, TIER_META, tierFromScore, round2 } from "./data";

const VB_W = 440;
const VB_H = 260;
const PAD_L = 48;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 36;

function plotX(blast: number) {
  return round2(PAD_L + (blast / 100) * (VB_W - PAD_L - PAD_R));
}
function plotY(risk: number) {
  return round2(VB_H - PAD_B - (risk / 100) * (VB_H - PAD_T - PAD_B));
}
function bubbleRadius(dep: number) {
  return round2(Math.min(6 + dep * 1.3, 22));
}

const TICKS = [0, 25, 50, 75, 100];

function ShapeGlyph({
  shape,
  cx,
  cy,
  r,
  fill,
}: {
  shape: "circle" | "diamond" | "triangle" | "square";
  cx: number;
  cy: number;
  r: number;
  fill: string;
}) {
  if (shape === "circle") {
    return <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.85} stroke="white" strokeWidth={1.5} />;
  }
  if (shape === "square") {
    const s = round2(r * 1.6);
    return (
      <rect
        x={round2(cx - s / 2)}
        y={round2(cy - s / 2)}
        width={s}
        height={s}
        rx={2}
        fill={fill}
        fillOpacity={0.85}
        stroke="white"
        strokeWidth={1.5}
      />
    );
  }
  if (shape === "diamond") {
    const d = round2(r * 1.15);
    const points = `${cx},${round2(cy - d)} ${round2(cx + d)},${cy} ${cx},${round2(cy + d)} ${round2(cx - d)},${cy}`;
    return <polygon points={points} fill={fill} fillOpacity={0.85} stroke="white" strokeWidth={1.5} />;
  }
  const h = round2(r * 1.3);
  const points = `${cx},${round2(cy - h)} ${round2(cx + h)},${round2(cy + h * 0.8)} ${round2(cx - h)},${round2(cy + h * 0.8)}`;
  return <polygon points={points} fill={fill} fillOpacity={0.85} stroke="white" strokeWidth={1.5} />;
}

function ShapeLegendIcon({ shape }: { shape: "circle" | "diamond" | "triangle" | "square" }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="flex-shrink-0">
      <ShapeGlyph shape={shape} cx={5} cy={5} r={3.2} fill="#71717a" />
    </svg>
  );
}

export function BubbleChart({
  services,
  hoveredId,
  onHover,
}: {
  services: Service[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const dangerX = plotX(50);
  const dangerYTop = plotY(100);
  const dangerYBottom = plotY(50);
  const plotW = VB_W - PAD_L - PAD_R;
  const plotH = VB_H - PAD_T - PAD_B;
  const centerY = round2(PAD_T + plotH / 2);
  const hovered = hoveredId ? services.find((s) => s.id === hoveredId) ?? null : null;

  return (
    <div>
      <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full"
          role="img"
          aria-label="Changed services plotted by blast radius and rollback risk; bubble size is dependents touched"
        >
          <rect
            x={dangerX}
            y={dangerYTop}
            width={round2(VB_W - PAD_R - dangerX)}
            height={round2(dangerYBottom - dangerYTop)}
            fill="#fef2f2"
          />
          <text x={round2(VB_W - PAD_R - 4)} y={round2(dangerYTop + 12)} textAnchor="end" className="fill-red-400" style={{ fontSize: 9, fontWeight: 500 }}>
            Elevated zone
          </text>

          {TICKS.map((t) => (
            <g key={`gx-${t}`}>
              <line x1={plotX(t)} y1={PAD_T} x2={plotX(t)} y2={VB_H - PAD_B} stroke="#e4e4e7" strokeWidth={1} strokeDasharray={t === 0 ? undefined : "2 3"} />
              <text x={plotX(t)} y={VB_H - PAD_B + 14} textAnchor="middle" className="fill-zinc-500 tabular-nums" style={{ fontSize: 9 }}>
                {t}
              </text>
            </g>
          ))}
          {TICKS.map((t) => (
            <g key={`gy-${t}`}>
              <line x1={PAD_L} y1={plotY(t)} x2={VB_W - PAD_R} y2={plotY(t)} stroke="#e4e4e7" strokeWidth={1} strokeDasharray={t === 0 ? undefined : "2 3"} />
              <text x={round2(PAD_L - 6)} y={round2(plotY(t) + 3)} textAnchor="end" className="fill-zinc-500 tabular-nums" style={{ fontSize: 9 }}>
                {t}
              </text>
            </g>
          ))}

          <text x={round2(PAD_L + plotW / 2)} y={VB_H - 4} textAnchor="middle" className="fill-zinc-600" style={{ fontSize: 10, fontWeight: 500 }}>
            Blast radius (% of users/services affected) &rarr;
          </text>
          <text
            x={12}
            y={centerY}
            textAnchor="middle"
            transform={`rotate(-90 12 ${centerY})`}
            className="fill-zinc-600"
            style={{ fontSize: 10, fontWeight: 500 }}
          >
            Rollback risk score &uarr;
          </text>

          {services.length === 0 && (
            <text x={round2(PAD_L + plotW / 2)} y={round2(PAD_T + plotH / 2)} textAnchor="middle" className="fill-zinc-600" style={{ fontSize: 11 }}>
              No changed services match this filter.
            </text>
          )}

          {services.map((s) => {
            const tier = tierFromScore(s.riskScore);
            const cx = plotX(s.blastRadiusPct);
            const cy = plotY(s.riskScore);
            const r = bubbleRadius(s.dependentsTouched);
            const dim = hoveredId !== null && hoveredId !== s.id;
            return (
              <g key={s.id} opacity={dim ? 0.35 : 1} style={{ transition: "opacity 200ms ease-out" }}>
                <ShapeGlyph shape={CATEGORY_META[s.category].shape} cx={cx} cy={cy} r={r} fill={TIER_META[tier].dot} />
                {hoveredId === s.id && <circle cx={cx} cy={cy} r={round2(r + 3)} fill="none" stroke="#2563eb" strokeWidth={1.5} />}
              </g>
            );
          })}
        </svg>

        {services.map((s) => {
          const cx = plotX(s.blastRadiusPct);
          const cy = plotY(s.riskScore);
          const r = bubbleRadius(s.dependentsTouched);
          const sizePct = Math.max(round2(((r * 2) / VB_W) * 100), 6);
          return (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(s.id)}
              onBlur={() => onHover(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{
                left: `${round2((cx / VB_W) * 100)}%`,
                top: `${round2((cy / VB_H) * 100)}%`,
                width: `${sizePct}%`,
                aspectRatio: "1 / 1",
              }}
            >
              <span className="sr-only">
                {s.name}, {CATEGORY_META[s.category].label}, blast radius {s.blastRadiusPct}%, risk score {s.riskScore},{" "}
                {s.dependentsTouched} dependent service{s.dependentsTouched === 1 ? "" : "s"}.
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 min-h-[1.25rem] text-xs font-normal text-zinc-600" aria-live="polite">
        {hovered ? (
          <>
            <span className="font-semibold text-zinc-900">{hovered.name}</span> &middot; blast {hovered.blastRadiusPct}% &middot; risk{" "}
            {hovered.riskScore} &middot; {hovered.dependentsTouched} dependent{hovered.dependentsTouched === 1 ? "" : "s"}
          </>
        ) : (
          "Hover or focus a bubble for service detail — the pinned release selection is unaffected."
        )}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-zinc-100 pt-3 text-[11px] font-normal text-zinc-600">
        <span className="font-medium uppercase tracking-[0.04em] text-zinc-500">Shape = category</span>
        {(Object.keys(CATEGORY_META) as Category[]).map((k) => (
          <span key={k} className="flex items-center gap-1.5">
            <ShapeLegendIcon shape={CATEGORY_META[k].shape} />
            {CATEGORY_META[k].label}
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-normal text-zinc-600">
        <span className="font-medium uppercase tracking-[0.04em] text-zinc-500">Color = risk tier</span>
        {(Object.keys(TIER_META) as (keyof typeof TIER_META)[]).map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: TIER_META[t].dot }} aria-hidden="true" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
