"use client";

import { useState } from "react";
import { currency, type ChartPoint } from "./data";
import { NUM, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { r2, useElementWidth } from "./ui";

const HEIGHT = 236;
const PAD = { top: 36, right: 10, bottom: 26, left: 10 };
const ACCENT_CURRENT = "#c2410c"; // orange-700 — the bar matching the hero number's window
const ACCENT_HISTORY = "#fdba74"; // orange-300 — prior windows, decorative-only (3:1 floor)

export default function VolumeChart({ data }: { data: ChartPoint[] }) {
  const { ref, width } = useElementWidth<HTMLDivElement>(640);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const plotW = Math.max(80, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const step = plotW / data.length;
  const barW = Math.max(16, r2(step * 0.46));

  const max = Math.max(...data.map((d) => d.value));
  const yMax = max * 1.18;
  const y = (v: number) => r2(PAD.top + plotH - (v / yMax) * plotH);
  const x = (i: number) => r2(PAD.left + i * step + step / 2);

  const active = activeKey !== null ? data.find((d) => d.key === activeKey) ?? null : null;
  const activeIdx = active ? data.indexOf(active) : -1;
  const lastKey = data[data.length - 1].key;

  const tipW = 108;
  const tipH = 30;
  const tipX = activeIdx >= 0 ? Math.min(Math.max(x(activeIdx) - tipW / 2, PAD.left), width - PAD.right - tipW) : 0;

  return (
    <div>
      <div ref={ref}>
        <svg viewBox={`0 0 ${width} ${HEIGHT}`} width="100%" height={HEIGHT} role="img" aria-label="Payout volume by window, current window highlighted">
          <line x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} stroke="currentColor" strokeOpacity={0.14} className={TEXT_MUTED} />
          <line x1={PAD.left} x2={width - PAD.right} y1={y(yMax)} y2={y(yMax)} stroke="currentColor" strokeOpacity={0.14} className={TEXT_MUTED} />

          {activeIdx >= 0 ? (
            <line x1={x(activeIdx)} x2={x(activeIdx)} y1={PAD.top} y2={y(0)} stroke="#c2410c" strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.55} />
          ) : null}

          {data.map((d, i) => {
            const isCurrent = d.key === lastKey;
            const h = Math.max(2, r2(y(0) - y(d.value)));
            return (
              <g key={d.key}>
                <rect x={r2(x(i) - barW / 2)} y={y(d.value)} width={barW} height={h} rx={4} fill={isCurrent ? ACCENT_CURRENT : ACCENT_HISTORY} />
                <text x={x(i)} y={HEIGHT - 8} textAnchor="middle" fontSize={11} className={TEXT_MUTED} fill="currentColor">
                  {d.label}
                </text>
              </g>
            );
          })}

          {active && activeIdx >= 0 ? (
            <g>
              <rect x={tipX} y={2} width={tipW} height={tipH} rx={7} fill="#18181b" />
              <text x={tipX + tipW / 2} y={2 + tipH / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="#fafafa">
                {currency(active.value)}
              </text>
            </g>
          ) : null}

          {/* Transparent focusable/hoverable hit targets — one per bar, keyboard reachable. Ephemeral: clears on blur/mouseleave, no other widget reacts. */}
          {data.map((d, i) => (
            <rect
              key={`hit-${d.key}`}
              x={r2(x(i) - step / 2)}
              y={0}
              width={r2(step)}
              height={HEIGHT}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${d.sub}: ${currency(d.value)}`}
              onMouseEnter={() => setActiveKey(d.key)}
              onFocus={() => setActiveKey(d.key)}
              onMouseLeave={() => setActiveKey((cur) => (cur === d.key ? null : cur))}
              onBlur={() => setActiveKey((cur) => (cur === d.key ? null : cur))}
              stroke="transparent"
              strokeWidth={2}
              className="outline-none focus-visible:fill-zinc-900/[0.04] focus-visible:stroke-orange-700"
            />
          ))}
        </svg>
      </div>

      <div aria-live="polite" className={cx("mt-2 min-h-[1.75rem] rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-1.5 text-[12px] font-normal", TEXT_MUTED)}>
        {active ? (
          <span className={NUM}>
            <span className={cx("font-semibold", TEXT_PRIMARY)}>{active.sub}</span>
            {` — ${currency(active.value)}`}
          </span>
        ) : (
          "Hover or focus a bar for its exact volume."
        )}
      </div>
      <p className={cx("mt-1.5 text-[11px] font-normal", TEXT_MUTED)}>Darker bar marks the window that matches the hero number above; lighter bars are prior windows.</p>
    </div>
  );
}
