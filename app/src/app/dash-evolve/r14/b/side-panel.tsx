"use client";

import { ArrowDownRight, ArrowUpRight, CircleDashed, ListChecks, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import { useId, useState } from "react";
import { QUEUE_DEPTH_TREND } from "./data";
import { BORDER, DISPLAY, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader } from "./ui";
import type { FeedEvent } from "./types";

/* ------------------------------------------------------------- At a glance */

export function AtAGlanceCard({ events }: { events: FeedEvent[] }) {
  const total = events.length;
  const escalated = events.filter((e) => e.status === "escalated").length;
  const unassigned = events.filter((e) => e.status === "unassigned").length;

  const stats = [
    { label: "Actions logged", value: total, Icon: ListChecks },
    { label: "Escalated", value: escalated, Icon: ShieldAlert },
    { label: "Unassigned", value: unassigned, Icon: CircleDashed },
  ];

  return (
    <Card>
      <CardHeader title="At a glance" description="Counted live from the activity feed below." />
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-zinc-950 px-2.5 py-3 text-center">
            <dt className="flex items-center justify-center gap-1">
              <s.Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
              <span className={cx("text-[10px] leading-tight font-medium tracking-wide uppercase", TEXT_CAPTION)}>{s.label}</span>
            </dt>
            <dd className={cx("mt-1 text-lg font-semibold", TEXT_PRIMARY, NUM)} style={DISPLAY}>
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

/* ---------------------------------------------------------------- Sparkline */

const CHART_W = 260;
const CHART_H = 88;
const PAD_X = 10;
const PAD_TOP = 12;
const PAD_BOTTOM = 10;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function QueueTrendCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();

  const values = QUEUE_DEPTH_TREND.map((d) => d.depth);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const plotW = CHART_W - PAD_X * 2;
  const plotH = CHART_H - PAD_TOP - PAD_BOTTOM;
  const stepX = QUEUE_DEPTH_TREND.length > 1 ? plotW / (QUEUE_DEPTH_TREND.length - 1) : 0;

  const points = QUEUE_DEPTH_TREND.map((d, i) => {
    const x = round2(PAD_X + i * stepX);
    const y = round2(PAD_TOP + ((max - d.depth) / range) * plotH);
    return { ...d, x, y };
  });

  const latest = points[points.length - 1];
  const first = points[0];
  const delta = latest.depth - first.depth;
  const deltaPct = round2((delta / first.depth) * 100);
  const draining = delta <= 0;
  const peak = points.reduce((a, b) => (b.depth > a.depth ? b : a), points[0]);

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const active = activeIndex !== null ? points[activeIndex] : null;
  const tooltipX = active ? Math.min(Math.max(active.x, 28), CHART_W - 28) : 0;

  return (
    <Card id="queue-trend" className="scroll-mt-20">
      <CardHeader titleId={titleId} title="Queue depth trend" description="Backlog size at 2-hour checkpoints, last 12 hours." />

      <div className="mt-3 flex items-baseline gap-2">
        <span className={cx("text-2xl font-semibold", TEXT_PRIMARY, NUM)} style={DISPLAY}>
          {latest.depth.toLocaleString("en-US")}
        </span>
        <span className={cx("text-xs", TEXT_CAPTION)}>items backlog now</span>
        <span className={cx("ml-auto inline-flex items-center gap-1 text-xs font-medium", draining ? "text-emerald-300" : "text-amber-300")}>
          {draining ? <TrendingDown size={13} aria-hidden="true" /> : <TrendingUp size={13} aria-hidden="true" />}
          <span className={NUM} style={DISPLAY}>
            {delta > 0 ? "+" : ""}
            {delta} ({deltaPct > 0 ? "+" : ""}
            {deltaPct.toFixed(1)}%)
          </span>
        </span>
      </div>

      <div className="relative mt-7">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          width="100%"
          height={CHART_H}
          role="img"
          aria-label={`Queue backlog depth across 7 checkpoints over the last 12 hours, from ${first.depth} to ${latest.depth} items`}
          className="block overflow-visible"
        >
          <polyline points={polyline} fill="none" strokeWidth={1.75} className="stroke-emerald-400" strokeLinecap="round" strokeLinejoin="round" />
          {active ? <line x1={active.x} x2={active.x} y1={PAD_TOP - 4} y2={CHART_H - PAD_BOTTOM + 4} strokeWidth={1} className="stroke-white/20" /> : null}
          {points.map((p, i) => (
            <circle
              key={p.hour}
              cx={p.x}
              cy={p.y}
              r={i === activeIndex ? 3 : p.hour === peak.hour ? 2.25 : 1.75}
              className={i === activeIndex ? "fill-zinc-50" : p.hour === peak.hour ? "fill-amber-300" : "fill-emerald-400"}
            />
          ))}
        </svg>

        {active ? (
          <div
            role="status"
            style={{ left: `${(tooltipX / CHART_W) * 100}%` }}
            className={cx("pointer-events-none absolute -top-1.5 z-10 -translate-x-1/2 -translate-y-full rounded-md border px-2 py-1 text-[11px] whitespace-nowrap shadow-lg", BORDER, "bg-zinc-950")}
          >
            <span className={cx("font-semibold", TEXT_PRIMARY, NUM)} style={DISPLAY}>
              {active.depth}
            </span>{" "}
            <span className={TEXT_CAPTION}>at {active.hour} UTC</span>
          </div>
        ) : null}

        {/* Keyboard- and pointer-accessible crosshair targets, one per checkpoint. Equal-width flex
            columns (not svg-coordinate-matched) so every hit target clears the 24px a11y floor. */}
        <div className="absolute inset-0 flex">
          {points.map((p, i) => (
            <button
              key={p.hour}
              type="button"
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex((v) => (v === i ? null : v))}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex((v) => (v === i ? null : v))}
              aria-label={`${p.hour} UTC: ${p.depth} items in backlog`}
              className="h-full min-w-7 flex-1 rounded focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-400"
            />
          ))}
        </div>
      </div>

      <p className={cx("mt-2 flex items-center gap-1 text-[11px]", TEXT_CAPTION)}>
        {draining ? <ArrowDownRight size={12} aria-hidden="true" /> : <ArrowUpRight size={12} aria-hidden="true" />}
        Peak {peak.depth} at {peak.hour} UTC · Tab through checkpoints for exact values.
      </p>
    </Card>
  );
}
