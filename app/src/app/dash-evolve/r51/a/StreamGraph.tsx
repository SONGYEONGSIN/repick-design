"use client";

import { useId, useMemo, useState } from "react";
import { type Day, type ProviderId, PROVIDERS, formatLong, r2, rateOf } from "./data";
import { ACCENT_SUBTLE, FOCUS, TEXT_AUX, TEXT_PRIMARY, cx, gradeForRate } from "./tokens";
import { GradeBadge, useElementSize } from "./ui";

/** Catmull-Rom → cubic Bézier, one segment per point after the first — what turns the raw daily
 *  samples into the "smoothly-flowing" ribbon edges the brief asks for, instead of a jagged
 *  polyline. Pure function of its input points, so re-renders at a new width produce the same
 *  shape, just rescaled. */
function catmullRomSegments(pts: { x: number; y: number }[]): string[] {
  const segs: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    segs.push(`C ${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2.x)} ${r2(p2.y)}`);
  }
  return segs;
}

function ribbonPath(topPts: { x: number; y: number }[], botPts: { x: number; y: number }[]): string {
  const botRev = [...botPts].reverse();
  const d = [
    `M ${r2(topPts[0].x)} ${r2(topPts[0].y)}`,
    ...catmullRomSegments(topPts),
    `L ${r2(botRev[0].x)} ${r2(botRev[0].y)}`,
    ...catmullRomSegments(botRev),
    "Z",
  ];
  return d.join(" ");
}

const PAD_X = 10;
const PAD_Y = 22;

export default function StreamGraph({
  days,
  pinnedId,
  explicitPin,
  onPinProvider,
}: {
  days: Day[];
  pinnedId: ProviderId;
  explicitPin: boolean;
  onPinProvider: (id: ProviderId) => void;
}) {
  const uid = useId();
  const { ref, width, height } = useElementSize<HTMLDivElement>(900, 360);
  const [mouseIdx, setMouseIdx] = useState<number | null>(null);
  const [kbIdx, setKbIdx] = useState<number | null>(null);
  const [focusedId, setFocusedId] = useState<ProviderId | null>(null);
  const n = days.length;
  const activeIdx = mouseIdx ?? kbIdx;

  const plotW = Math.max(40, width - PAD_X * 2);
  const plotH = Math.max(40, height - PAD_Y * 2);
  const xFor = (i: number) => r2(PAD_X + (n <= 1 ? plotW / 2 : (i * plotW) / (n - 1)));
  const centerY = PAD_Y + plotH / 2;

  const geometry = useMemo(() => {
    const totals = days.map((d) => d.totalHits);
    const maxHalf = Math.max(1, ...totals) / 2;
    const pxPerUnit = plotH / 2 / maxHalf;
    // bandY[providerIndex][dayIndex] = { top, bottom } in pixel space.
    const bandY: { top: number; bottom: number }[][] = PROVIDERS.map(() => []);
    for (let i = 0; i < n; i++) {
      let cum = -days[i].totalHits / 2;
      for (let pi = 0; pi < PROVIDERS.length; pi++) {
        const val = days[i].byProvider[PROVIDERS[pi].id].inboxHits;
        const bottomVal = cum;
        const topVal = cum + val;
        bandY[pi].push({ top: r2(centerY - topVal * pxPerUnit), bottom: r2(centerY - bottomVal * pxPerUnit) });
        cum = topVal;
      }
    }
    return bandY;
  }, [days, n, plotH, centerY]);

  const ribbons = PROVIDERS.map((p, pi) => {
    const topPts = days.map((_, i) => ({ x: xFor(i), y: geometry[pi][i].top }));
    const botPts = days.map((_, i) => ({ x: xFor(i), y: geometry[pi][i].bottom }));
    return { provider: p, d: ribbonPath(topPts, botPts), topPts };
  });

  // Four evenly spaced date ticks under the rail — labels, not one per sample (n can be up to 90).
  const tickCount = n >= 30 ? 5 : n >= 7 ? 4 : n;
  const tickIdxs = Array.from({ length: tickCount }, (_, k) => Math.round((k * (n - 1)) / Math.max(1, tickCount - 1)));

  function indexFromClientX(clientX: number, railEl: HTMLElement): number {
    const rect = railEl.getBoundingClientRect();
    const t = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    return Math.max(0, Math.min(n - 1, Math.round(t * (n - 1))));
  }

  function moveKb(delta: number | "home" | "end") {
    setKbIdx((cur) => {
      const base = cur ?? n - 1;
      if (delta === "home") return 0;
      if (delta === "end") return n - 1;
      return Math.max(0, Math.min(n - 1, base + delta));
    });
  }

  const day = activeIdx != null ? days[activeIdx] : null;
  const tipWidth = 236;
  const tipLeft = activeIdx != null ? Math.min(Math.max(xFor(activeIdx) - tipWidth / 2, 0), Math.max(0, width - tipWidth)) : 0;

  return (
    <div>
      {/* ---------------------------------------------------------- persistent legend-with-values */}
      <ul className="flex flex-wrap items-center gap-2" aria-label="Current inbox placement rate by provider">
        {PROVIDERS.map((p, pi) => {
          const latest = days[days.length - 1]?.byProvider[p.id];
          const rate = latest ? rateOf(latest) : 0;
          const grade = gradeForRate(rate);
          const isPinned = explicitPin && pinnedId === p.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onPinProvider(p.id)}
                aria-pressed={isPinned}
                className={cx(
                  "flex h-9 items-center gap-2 rounded-xl border px-2.5 text-xs",
                  FOCUS,
                  "transition-colors duration-150 motion-reduce:transition-none",
                  isPinned ? ACCENT_SUBTLE : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
                )}
              >
                <PatternSwatch providerIndex={pi} fillHex={p.fillHex} uid={uid} />
                <span className={cx("font-medium", isPinned ? "text-lime-300" : TEXT_PRIMARY)}>{p.label}</span>
                <span className={cx("font-semibold tabular-nums", isPinned ? "text-lime-300" : TEXT_PRIMARY)}>{rate}%</span>
                <GradeBadge grade={grade} />
              </button>
            </li>
          );
        })}
      </ul>

      {/* ------------------------------------------------------------------------------- chart */}
      <div className="relative mt-3">
        <div ref={ref} className="relative h-[300px] w-full sm:h-[380px] lg:h-[460px] xl:h-[540px]">
          {/* No `role="img"` here on purpose: it contains four real focusable ribbon buttons, and
              `role="img"` would mark the whole tree atomic and prune them from the a11y tree. */}
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-label="Streamgraph of daily inbox placement volume by mailbox provider. Four providers, each focusable to pin its detail card.">
            <defs>
              {PROVIDERS.map((p, pi) => (
                <pattern
                  key={p.id}
                  id={`${uid}-hatch-${pi}`}
                  width={p.patternAngle === 90 || p.patternAngle === 0 ? 6 : 7}
                  height={p.patternAngle === 90 || p.patternAngle === 0 ? 6 : 7}
                  patternUnits="userSpaceOnUse"
                  patternTransform={`rotate(${p.patternAngle})`}
                >
                  <rect width="100%" height="100%" fill={p.fillHex} opacity={0.16} />
                  <line x1="0" y1="0" x2="0" y2="6" stroke={p.fillHex} strokeWidth={1.3} strokeOpacity={0.6} strokeDasharray={p.patternDash} />
                </pattern>
              ))}
            </defs>

            {ribbons.map(({ provider, d }, pi) => {
              const isPinned = explicitPin && pinnedId === provider.id;
              const isFocused = focusedId === provider.id;
              return (
                <path
                  key={provider.id}
                  d={d}
                  fill={`url(#${uid}-hatch-${pi})`}
                  stroke={provider.strokeHex}
                  strokeWidth={isPinned || isFocused ? 2.5 : 1.25}
                  strokeDasharray={provider.edgeDash}
                  strokeLinejoin="round"
                  opacity={!explicitPin || isPinned ? 1 : 0.45}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isPinned}
                  aria-label={`${provider.label} ribbon — pin its detail card`}
                  onClick={() => onPinProvider(provider.id)}
                  onFocus={() => setFocusedId(provider.id)}
                  onBlur={() => setFocusedId((cur) => (cur === provider.id ? null : cur))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPinProvider(provider.id);
                    }
                  }}
                  className={cx("cursor-pointer transition-[opacity,stroke-width] duration-150 motion-reduce:transition-none", FOCUS)}
                />
              );
            })}

            {activeIdx != null ? (
              <g aria-hidden="true">
                <line x1={xFor(activeIdx)} x2={xFor(activeIdx)} y1={PAD_Y - 6} y2={height - PAD_Y + 6} stroke="#a3e635" strokeOpacity={0.55} strokeWidth={1} strokeDasharray="2 3" />
                {ribbons.map(({ provider }, pi) => (
                  <circle key={provider.id} cx={xFor(activeIdx)} cy={geometry[pi][activeIdx].top} r={2.6} fill={provider.strokeHex} />
                ))}
              </g>
            ) : null}
          </svg>

          {day ? (
            // `aria-hidden`: purely a sighted-mouse convenience. The accessible equivalent is the
            // rail's own `role="slider"` + `aria-valuetext` below, which AT already announces on
            // focus/arrow-key — a second live region here would just double-announce it.
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1 rounded-xl border border-white/10 bg-zinc-950/95 p-2.5 shadow-xl shadow-black/50"
              style={{ left: tipLeft, width: tipWidth }}
            >
              <p className={cx("text-[11px] font-semibold", TEXT_PRIMARY)}>{formatLong(day.offset)}</p>
              <ul className="mt-1.5 space-y-1">
                {PROVIDERS.map((p) => {
                  const dp = day.byProvider[p.id];
                  const rate = rateOf(dp);
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-2 text-[11px]">
                      <span className={cx("flex items-center gap-1.5", TEXT_AUX)}>
                        <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: p.strokeHex }} />
                        {p.label}
                      </span>
                      <span className={cx("font-medium tabular-nums", TEXT_PRIMARY)}>{`${rate}% · ${dp.inboxHits.toLocaleString("en-US")}`}</span>
                    </li>
                  );
                })}
              </ul>
              <p className={cx("mt-1.5 border-t border-white/10 pt-1.5 text-[10px]", TEXT_AUX)}>{`${day.totalHits.toLocaleString("en-US")} inbox placements that day`}</p>
            </div>
          ) : null}
        </div>

        {/* ----------------------------------------------------------------- scrub rail (ticks) */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Scrub inbox placement trend by day"
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={activeIdx ?? n - 1}
          aria-valuetext={day ? `${formatLong(day.offset)}, ${day.totalHits.toLocaleString("en-US")} inbox placements` : formatLong(days[n - 1].offset)}
          className={cx("relative mt-2 h-7 cursor-crosshair rounded-lg", FOCUS)}
          onMouseMove={(e) => setMouseIdx(indexFromClientX(e.clientX, e.currentTarget))}
          onMouseLeave={() => setMouseIdx(null)}
          onClick={(e) => setKbIdx(indexFromClientX(e.clientX, e.currentTarget))}
          onFocus={() => setKbIdx((cur) => cur ?? n - 1)}
          onBlur={() => setKbIdx(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              moveKb(-1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              moveKb(1);
            } else if (e.key === "Home") {
              e.preventDefault();
              moveKb("home");
            } else if (e.key === "End") {
              e.preventDefault();
              moveKb("end");
            }
          }}
        >
          <div className="absolute inset-x-0 top-1 h-px bg-white/10" aria-hidden="true" />
          {tickIdxs.map((idx) => (
            <span key={idx} aria-hidden="true" className={cx("absolute top-2.5 -translate-x-1/2 whitespace-nowrap text-[10px]", TEXT_AUX)} style={{ left: xFor(idx) }}>
              {formatLong(days[idx].offset).split(",").slice(0, 2).join(",")}
            </span>
          ))}
          {activeIdx != null ? (
            <span aria-hidden="true" className="absolute top-0 h-2 w-0.5 -translate-x-1/2 rounded-full bg-lime-400" style={{ left: xFor(activeIdx) }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PatternSwatch({ providerIndex, fillHex, uid }: { providerIndex: number; fillHex: string; uid: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 rounded-[2px]">
      <rect width="14" height="14" fill={fillHex} opacity={0.22} />
      <rect width="14" height="14" fill={`url(#${uid}-hatch-${providerIndex})`} />
      <rect width="14" height="14" fill="none" stroke={fillHex} strokeOpacity={0.8} strokeWidth={1} />
    </svg>
  );
}
