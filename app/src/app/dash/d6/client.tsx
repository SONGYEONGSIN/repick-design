"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  MOOD_ORDER,
  MOODS,
  RELATIONSHIPS,
  generateMoodDays,
  layoutSpiral,
  summarizeMoods,
  warmthArcPath,
  WARMTH_TRACK,
  type Trend,
} from "./lib";

const VIEWBOX = 280;
const FULL_DAYS = generateMoodDays(90);

type Period = "week" | "month" | "quarter";

const PERIODS: { key: Period; label: string; days: number }[] = [
  { key: "week", label: "이번 주", days: 7 },
  { key: "month", label: "이번 달", days: 30 },
  { key: "quarter", label: "3개월", days: 90 },
];

function bloomStyle(delayMs: number): CSSProperties {
  return { "--bloom-delay": `${delayMs}ms` } as CSSProperties;
}

/** 표준 막대/선 그래프 대신, 해바라기 씨앗 배열(phyllotaxis)로 하루하루의 결을 피워낸다. */
export function MoodSpiralPanel() {
  const [period, setPeriod] = useState<Period>("month");

  const active = PERIODS.find((p) => p.key === period) ?? PERIODS[1];
  const days = useMemo(() => FULL_DAYS.slice(-active.days), [active.days]);
  const points = useMemo(() => layoutSpiral(days, VIEWBOX), [days]);
  const summary = useMemo(() => summarizeMoods(days), [days]);
  const dominant = MOODS[summary.dominant];

  return (
    <section
      aria-labelledby="d6-spiral-heading"
      className="d6-card d6-card-organic relative overflow-hidden p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="d6-spiral-heading" className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
            감정의 결
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            하루하루의 감정 날씨가 씨앗처럼 피어나요.
          </p>
        </div>

        <div
          role="group"
          aria-label="기간 선택"
          className="flex gap-1 rounded-full border border-[var(--line)] bg-[var(--paper-soft)] p-1"
        >
          {PERIODS.map((p) => {
            const isActive = p.key === period;
            return (
              <button
                key={p.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setPeriod(p.key)}
                className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                  isActive
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "text-[var(--ink-soft)] hover:bg-[var(--paper-card)]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-center">
        <div className="mx-auto w-full max-w-[280px]">
          <svg
            key={period}
            viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
            role="img"
            aria-label={`${active.label} 감정 날씨 씨앗 배열. 총 ${summary.total}일 중 ${dominant.label}이 ${summary.counts[summary.dominant]}일로 가장 많아요.`}
            className="h-auto w-full"
          >
            {points.map((pt, i) => {
              const mood = MOODS[pt.mood];
              return (
                <circle
                  key={pt.index}
                  cx={pt.x}
                  cy={pt.y}
                  r={pt.r}
                  fill={mood.solid}
                  className="d6-bloom-dot"
                  style={bloomStyle(Math.min(i * 4, 420))}
                />
              );
            })}
          </svg>
          <p className="sr-only">
            {MOOD_ORDER.map((key) => `${MOODS[key].label} ${summary.counts[key]}일`).join(", ")}
          </p>
        </div>

        <div>
          <p className="text-lg italic text-[var(--ink)] sm:text-xl">
            &ldquo;{active.label} 가장 많이 핀 결은{" "}
            <span className="not-italic font-semibold" style={{ color: dominant.text }}>
              {dominant.label}
            </span>
            이에요.&rdquo;
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {summary.percents.map(({ key, pct }) => {
              const mood = MOODS[key];
              return (
                <li key={key} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-sm font-medium text-[var(--ink-soft)]">
                    {mood.label}
                  </span>
                  <span
                    className="h-2.5 flex-1 overflow-hidden rounded-full"
                    style={{ backgroundColor: mood.tint }}
                  >
                    <span
                      className="block h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                      style={{ width: `${pct}%`, backgroundColor: mood.solid }}
                    />
                  </span>
                  <span className="d6-tabular w-10 shrink-0 text-right text-sm text-[var(--ink-soft)]">
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

const TREND_META: Record<Trend, { label: string; Icon: typeof TrendingUp; tone: string }> = {
  up: { label: "가까워지는 중", Icon: TrendingUp, tone: "var(--mood-calm-text)" },
  down: { label: "멀어지는 중", Icon: TrendingDown, tone: "var(--clay-text)" },
  flat: { label: "안정적", Icon: Minus, tone: "var(--ink-soft)" },
};

const FILTERS: { key: "all" | Trend; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "up", label: "가까워지는 중" },
  { key: "flat", label: "안정적" },
  { key: "down", label: "멀어지는 중" },
];

function ArcGauge({ value, id }: { value: number; id: string }) {
  const cx = 60;
  const cy = 56;
  const r = 46;
  const gradId = `d6-arc-${id}`;
  return (
    <svg viewBox="0 0 120 68" role="img" aria-label={`관계 온도 ${value}도`} className="h-auto w-28">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--mood-heavy-solid)" />
          <stop offset="50%" stopColor="var(--mood-joy-solid)" />
          <stop offset="100%" stopColor="var(--clay-solid)" />
        </linearGradient>
      </defs>
      <path d={WARMTH_TRACK(cx, cy, r)} fill="none" stroke="var(--line)" strokeWidth="9" strokeLinecap="round" />
      <path
        d={warmthArcPath(cx, cy, r, value)}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        className="d6-tabular"
        style={{
          fill: "var(--ink)",
          fontSize: "22px",
          fontWeight: 600,
          fontFamily: "var(--font-display), serif",
        }}
      >
        {value}
      </text>
    </svg>
  );
}

const rotation = (i: number) => (i % 2 === 0 ? "sm:-rotate-[0.4deg]" : "sm:rotate-[0.5deg]");

/** 관계를 표·목록이 아니라 온도를 가진 카드 콜라주로 보여준다. */
export function RelationshipGrid() {
  const [filter, setFilter] = useState<"all" | Trend>("all");
  const filtered = RELATIONSHIPS.filter((r) => filter === "all" || r.trend === filter);

  return (
    <section aria-labelledby="d6-relationship-heading" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="d6-relationship-heading" className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
            관계 온도
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            요즘 마음이 가까워지고 있는 사람, 멀어지고 있는 사람.
          </p>
        </div>
        <div
          role="group"
          aria-label="관계 상태 필터"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(f.key)}
                className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                  isActive
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--line)] bg-[var(--paper-card)] text-[var(--ink-soft)] hover:border-[var(--line-strong)]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-[var(--line-strong)] p-8 text-center text-sm text-[var(--ink-soft)]">
          해당하는 관계가 아직 없어요.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => {
            const avatar = MOODS[r.avatarHue];
            const trend = TREND_META[r.trend];
            return (
              <li
                key={r.id}
                className={`d6-card p-5 transition-transform motion-reduce:transition-none ${rotation(i)}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold"
                    style={{ backgroundColor: avatar.tint, color: avatar.text }}
                  >
                    {r.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--ink)]">{r.name}</p>
                    <p className="text-xs text-[var(--ink-soft)]">
                      {r.relation} · {r.lastContact}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <ArcGauge value={r.warmth} id={r.id} />
                  <span
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: "var(--paper-soft)", color: trend.tone }}
                  >
                    <trend.Icon aria-hidden="true" size={14} />
                    {r.delta}
                    <span className="sr-only">, {trend.label}</span>
                  </span>
                </div>

                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{r.note}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
