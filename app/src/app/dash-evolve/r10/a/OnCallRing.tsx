"use client";

import { useRef, useState } from "react";
import {
  ENGINEERS,
  ESCALATION_POLICY,
  NOW_DAY_INDEX,
  NOW_HOUR,
  ownerForDay,
  round2,
  secondaryFor,
  shiftForHour,
  TODAY_SHIFTS,
  WEEKDAY_LABELS,
  engineerById,
} from "./data";
import { ENGINEER_TONE, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Dot } from "./ui";

export type RingRange = "today" | "week";

/* ------------------------------------------------------------ Geometry */

const SIZE = 340;
const CENTER = 170;
const R_OUTER = 148;
const R_INNER = 96;
const GAP_DEG = 2.2;

function polar(r: number, angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round2(CENTER + r * Math.cos(rad)), y: round2(CENTER + r * Math.sin(rad)) };
}

function donutPath(rOuter: number, rInner: number, startAngle: number, endAngle: number): string {
  const large = endAngle - startAngle > 180 ? 1 : 0;
  const p1 = polar(rOuter, startAngle);
  const p2 = polar(rOuter, endAngle);
  const p3 = polar(rInner, endAngle);
  const p4 = polar(rInner, startAngle);
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

type Segment = {
  index: number;
  startAngle: number;
  endAngle: number;
  engineerId: ReturnType<typeof engineerById>["id"];
  topLabel: string;
  bottomLabel: string;
  readoutLabel: string;
  ariaLabel: string;
};

function buildTodaySegments(): Segment[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  return TODAY_SHIFTS.map((s, i) => {
    const eng = engineerById(s.engineer);
    const start = (s.startHour / 24) * 360;
    const end = (s.endHour / 24) * 360;
    const shortRange = `${pad(s.startHour)}–${pad(s.endHour === 24 ? 0 : s.endHour)}`;
    const fullRange = `${pad(s.startHour)}:00–${pad(s.endHour === 24 ? 0 : s.endHour)}:00`;
    return {
      index: i,
      startAngle: start,
      endAngle: end,
      engineerId: eng.id,
      topLabel: shortRange,
      bottomLabel: eng.name.split(" ")[0],
      readoutLabel: fullRange,
      ariaLabel: `${fullRange}, on call: ${eng.name}, ${eng.role}`,
    };
  });
}

function buildWeekSegments(): Segment[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const eng = engineerById(ownerForDay(i));
    const start = (i / 7) * 360;
    const end = ((i + 1) / 7) * 360;
    return {
      index: i,
      startAngle: start,
      endAngle: end,
      engineerId: eng.id,
      topLabel: day,
      bottomLabel: eng.name.split(" ")[0],
      readoutLabel: day,
      ariaLabel: `${day}, primary owner: ${eng.name}, ${eng.role}`,
    };
  });
}

function escalationLine(engineerId: ReturnType<typeof engineerById>["id"]): string {
  const primary = engineerById(engineerId);
  const secondary = secondaryFor(engineerId);
  const t2 = ESCALATION_POLICY.tiers[1];
  const t3 = ESCALATION_POLICY.tiers[2];
  return `Primary ${primary.name} → Secondary ${secondary.name} (+${t2.waitMinutes}m) → ${t3.label} (+${t3.waitMinutes}m)`;
}

/* --------------------------------------------------------------- Ring */

export default function OnCallRing({
  range,
  highlightHour,
  highlightDay,
}: {
  range: RingRange;
  highlightHour: number | null;
  highlightDay: number | null;
}) {
  const segments = range === "today" ? buildTodaySegments() : buildWeekSegments();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const refs = useRef<Array<SVGGElement | null>>([]);
  const activeIdx = hoverIdx ?? focusIdx;

  const nowAngle = range === "today" ? (NOW_HOUR / 24) * 360 : ((NOW_DAY_INDEX + NOW_HOUR / 24) / 7) * 360;
  const nowNeedle = polar(R_OUTER + 16, nowAngle);
  const nowBase = polar(R_INNER - 8, nowAngle);
  const nowDot = polar(R_OUTER + 16, nowAngle);

  const highlightAngle =
    range === "today" ? (highlightHour != null ? (highlightHour / 24) * 360 : null) : highlightDay != null ? ((highlightDay + 0.5) / 7) * 360 : null;
  const highlightPoint = highlightAngle != null ? polar(R_OUTER + 4, highlightAngle) : null;
  const highlightPointInner = highlightAngle != null ? polar(R_INNER - 4, highlightAngle) : null;

  function focusSegment(i: number) {
    refs.current[i]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<SVGGElement>, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusSegment((i + 1) % segments.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusSegment((i - 1 + segments.length) % segments.length);
    }
  }

  const readout = (() => {
    if (activeIdx == null) {
      if (range === "today") {
        const eng = engineerById(shiftForHour(NOW_HOUR).engineer);
        return { title: "Right now", detail: `${eng.name} · ${eng.role}`, escalation: escalationLine(eng.id) };
      }
      const eng = engineerById(ownerForDay(NOW_DAY_INDEX));
      return { title: "Today's owner", detail: `${eng.name} · ${eng.role}`, escalation: escalationLine(eng.id) };
    }
    const seg = segments[activeIdx];
    const eng = engineerById(seg.engineerId);
    return { title: seg.readoutLabel, detail: `${eng.name} · ${eng.role}`, escalation: escalationLine(eng.id) };
  })();

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-6">
      <div className="relative mx-auto shrink-0" style={{ width: SIZE, maxWidth: "100%" }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full" role="group" aria-label={`${range === "today" ? "24-hour" : "7-day"} on-call coverage ring`}>
          {/* base track */}
          <circle cx={CENTER} cy={CENTER} r={(R_OUTER + R_INNER) / 2} fill="none" stroke="#27272a" strokeWidth={R_OUTER - R_INNER} />

          {segments.map((seg) => {
            const tone = ENGINEER_TONE[engineerById(seg.engineerId).tone];
            const isActive = activeIdx === seg.index;
            const path = donutPath(R_OUTER, R_INNER, seg.startAngle + GAP_DEG / 2, seg.endAngle - GAP_DEG / 2);
            const mid = (seg.startAngle + seg.endAngle) / 2;
            const labelPoint = polar((R_OUTER + R_INNER) / 2, mid);
            return (
              <g key={seg.index}>
                <path d={path} className={tone.fill} fillOpacity={isActive ? 0.95 : 0.72} stroke={isActive ? "#f4f4f5" : "transparent"} strokeWidth={isActive ? 2 : 0} />
                <text x={labelPoint.x} y={labelPoint.y - 6} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#fafafa" stroke="#09090b" strokeWidth={2.4} style={{ paintOrder: "stroke" }}>
                  {seg.topLabel}
                </text>
                <text x={labelPoint.x} y={labelPoint.y + 8} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#fafafa" stroke="#09090b" strokeWidth={2.6} style={{ paintOrder: "stroke" }}>
                  {seg.bottomLabel}
                </text>
              </g>
            );
          })}

          {/* focusable + hoverable hit regions, one per segment, kept separate from visual layer for a crisp focus outline */}
          {segments.map((seg, i) => {
            const path = donutPath(R_OUTER + 6, R_INNER - 6, seg.startAngle + GAP_DEG / 2, seg.endAngle - GAP_DEG / 2);
            return (
              <g
                key={`hit-${seg.index}`}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                tabIndex={0}
                role="img"
                aria-label={`${seg.ariaLabel}. Escalation: ${escalationLine(seg.engineerId)}`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx((v) => (v === i ? null : v))}
                onFocus={() => setFocusIdx(i)}
                onBlur={() => setFocusIdx((v) => (v === i ? null : v))}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <path d={path} fill="transparent" />
                {activeIdx === i ? <path d={path} fill="none" stroke="#2dd4bf" strokeWidth={2} /> : null}
              </g>
            );
          })}

          {/* selected-incident hour highlight (independent of engineer arc color) */}
          {highlightPoint && highlightPointInner ? (
            <g aria-hidden="true">
              <line x1={highlightPointInner.x} y1={highlightPointInner.y} x2={highlightPoint.x} y2={highlightPoint.y} stroke="#fbbf24" strokeWidth={2.5} strokeLinecap="round" />
              <circle cx={highlightPoint.x} cy={highlightPoint.y} r={4.5} fill="#fbbf24" className="motion-safe:animate-pulse" />
            </g>
          ) : null}

          {/* now needle */}
          <g aria-hidden="true">
            <line x1={nowBase.x} y1={nowBase.y} x2={nowNeedle.x} y2={nowNeedle.y} stroke="#2dd4bf" strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={nowDot.x} cy={nowDot.y} r={4} fill="#2dd4bf" />
          </g>

          <circle cx={CENTER} cy={CENTER} r={R_INNER - 22} fill="#09090b" stroke="#ffffff1a" strokeWidth={1} />
          <text x={CENTER} y={CENTER - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill="#a1a1aa">
            {range === "today" ? "NOW" : "TODAY"}
          </text>
          <text x={CENTER} y={CENTER + 12} textAnchor="middle" fontSize={13} fontWeight={700} className="tabular-nums" fill="#f4f4f5">
            {range === "today" ? "14:30" : "Wed"}
          </text>
        </svg>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="rounded-xl border border-white/10 bg-zinc-950 p-3" role="status" aria-live="polite">
          <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{activeIdx == null ? "Live reading" : "Hovered segment"}</p>
          <p className={cx("mt-1 text-sm font-semibold", TEXT_PRIMARY)}>{readout.title}</p>
          <p className={cx("mt-0.5 text-xs", TEXT_SECONDARY)}>{readout.detail}</p>
          <p className={cx("mt-1.5 text-[11px] leading-snug", TEXT_CAPTION)}>{readout.escalation}</p>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-1">
          {ENGINEERS.map((eng) => (
            <li key={eng.id} className="flex items-center gap-1.5 text-xs">
              <span aria-hidden="true" className={cx("inline-block size-2 shrink-0 rounded-full", ENGINEER_TONE[eng.tone].fill)} />
              <span className={TEXT_SECONDARY}>{eng.name}</span>
              <span className={cx("truncate", TEXT_CAPTION)}>· {eng.role}</span>
            </li>
          ))}
        </ul>
        <p className={cx("text-[11px] leading-snug", TEXT_CAPTION)}>
          <Dot tone="warn" /> <span className="ml-1">Amber pin marks the hour of the incident selected in the rail, when it falls within this view.</span>
        </p>
      </div>
    </div>
  );
}
