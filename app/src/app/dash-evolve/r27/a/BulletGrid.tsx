"use client";

import { CircleCheck, CircleX, AlertTriangle, Minus, Pin, PinOff, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { KEY_RESULTS, OBJECTIVES, TEAM_LABEL, bandFor, deltaSince, domainPct, formatKrValue, type KeyResult } from "./data";
import { BAND_FILL, BORDER, DISPLAY_STYLE, FOCUS, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, VALUE_BAR_FILL, type BandTone, cx } from "./tokens";
import { Badge, Card, CardHead, Eyebrow, Segmented, Tabs } from "./ui";

export type Period = "latest" | "quarterStart";
const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "latest", label: "Latest check-in" },
  { id: "quarterStart", label: "Quarter start" },
];

type ObjectiveFilter = "all" | (typeof OBJECTIVES)[number]["id"];

const TONE_ICON: Record<BandTone, typeof CircleCheck> = { good: CircleCheck, satisfactory: AlertTriangle, poor: CircleX };

function LegendSwatch({ tone, label }: { tone: BandTone; label: string }) {
  const Icon = TONE_ICON[tone];
  const dot = tone === "good" ? "bg-teal-400" : tone === "satisfactory" ? "bg-amber-400" : "bg-rose-400";
  return (
    <span className={cx("flex items-center gap-1.5", TEXT_MUTED)}>
      <span aria-hidden="true" className={cx("h-2 w-2 rounded-full", dot)} />
      <Icon size={11} aria-hidden="true" />
      {label}
    </span>
  );
}

function BulletRow({
  kr,
  value,
  pinned,
  hovered,
  onHover,
  onLeave,
  onTogglePin,
}: {
  kr: KeyResult;
  value: number;
  pinned: boolean;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onTogglePin: () => void;
}) {
  const tone = bandFor(kr, value);
  const ToneIcon = TONE_ICON[tone];
  const valuePct = domainPct(kr, value);
  const targetPct = domainPct(kr, kr.target);
  const delta = deltaSince(kr);
  const DeltaIcon = delta.diff === 0 ? Minus : delta.improved ? TrendingUp : TrendingDown;

  return (
    <li className={cx("border-b last:border-b-0", BORDER, pinned && "bg-teal-500/[0.06]")}>
      <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-start sm:gap-4">
        <button
          type="button"
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onFocus={onHover}
          onBlur={onLeave}
          className={cx("min-w-0 flex-1 rounded-lg px-1 py-0.5 text-left", TRANSITION, FOCUS)}
          aria-describedby={`kr-detail-${kr.id}`}
        >
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{kr.name}</span>
            <span className={cx("shrink-0 font-mono text-[10px] font-normal", TEXT_AUX)}>{kr.code}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Image
              src={`https://images.unsplash.com/photo-${kr.owner.avatarId}?w=40&h=40&fit=crop&crop=faces`}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 shrink-0 rounded-full bg-white/10 object-cover"
            />
            <span className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{kr.owner.name}</span>
          </div>

          <div className="relative mt-2.5 h-8 w-full overflow-hidden rounded-md border border-white/10 bg-white/[0.02]">
            {kr.segments.map((seg) => {
              const left = domainPct(kr, seg.from);
              const width = Math.max(0, r2(domainPct(kr, seg.to) - left));
              return <span key={seg.tone} aria-hidden="true" className={cx("absolute inset-y-0", BAND_FILL[seg.tone])} style={{ left: `${left}%`, width: `${width}%` }} />;
            })}
            <span aria-hidden="true" className={cx("absolute inset-y-2 left-0 rounded-sm", VALUE_BAR_FILL[tone])} style={{ width: `${valuePct}%` }} />
            <span aria-hidden="true" className="absolute inset-y-0 w-[2px] bg-zinc-50/85" style={{ left: `${targetPct}%` }} />
          </div>

          <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className={cx("text-base font-semibold leading-none tabular-nums", TEXT_PRIMARY)}>{formatKrValue(kr, value)}</span>
            <span className={cx("text-[11px] font-normal tabular-nums", TEXT_AUX)}>{`Target ${formatKrValue(kr, kr.target)}`}</span>
          </div>

          <div id={`kr-detail-${kr.id}`} className={cx("grid transition-[grid-template-rows] duration-150 motion-reduce:transition-none", hovered ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <p className={cx("mt-2 flex items-center gap-1.5 text-[11px] font-medium", delta.diff === 0 ? TEXT_MUTED : delta.improved ? "text-teal-300" : "text-rose-300")}>
                <DeltaIcon size={12} aria-hidden="true" />
                {delta.text}
              </p>
              <p className={cx("mt-1 text-[11px] font-normal leading-relaxed", TEXT_AUX)}>{kr.note}</p>
            </div>
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
          <Badge className={STATUS_BADGE[tone]} Icon={ToneIcon}>
            {STATUS_LABEL[tone]}
          </Badge>
          <button
            type="button"
            aria-pressed={pinned}
            onClick={onTogglePin}
            className={cx("grid h-9 w-9 place-items-center rounded-lg border", TRANSITION, FOCUS, pinned ? "border-teal-700/60 bg-teal-950/40 text-teal-300" : cx(BORDER, "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08]"))}
          >
            {pinned ? <PinOff size={14} aria-hidden="true" /> : <Pin size={14} aria-hidden="true" />}
            <span className="sr-only">{pinned ? `Unpin ${kr.name} from the focus card` : `Pin ${kr.name} to the focus card`}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export default function BulletGrid({ pinnedId, onTogglePin }: { pinnedId: string | null; onTogglePin: (id: string) => void }) {
  const [period, setPeriod] = useState<Period>("latest");
  const [objectiveFilter, setObjectiveFilter] = useState<ObjectiveFilter>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const groups = useMemo(() => {
    return OBJECTIVES.filter((o) => objectiveFilter === "all" || o.id === objectiveFilter).map((o) => ({
      objective: o,
      krs: KEY_RESULTS.filter((kr) => kr.objectiveId === o.id),
    }));
  }, [objectiveFilter]);

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <CardHead
          title="Key results"
          hint="Every bar shows its value against target and qualitative range at first glance — hover or focus a row for its trend since quarter start."
          action={<Segmented options={PERIOD_OPTIONS} value={period} onChange={setPeriod} ariaLabel="Checkpoint" />}
        />
        <div className="mt-3">
          <Tabs<ObjectiveFilter>
            ariaLabel="Filter by objective"
            value={objectiveFilter}
            onChange={setObjectiveFilter}
            options={[{ id: "all", label: `All objectives (${KEY_RESULTS.length})` }, ...OBJECTIVES.map((o) => ({ id: o.id, label: `${o.code} · ${TEAM_LABEL[o.team]}` }))]}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <LegendSwatch tone="poor" label="Off track" />
          <LegendSwatch tone="satisfactory" label="At risk" />
          <LegendSwatch tone="good" label="On track" />
          <span className={cx("flex items-center gap-1.5", TEXT_MUTED)}>
            <span aria-hidden="true" className="h-3 w-[2px] bg-zinc-50/85" />
            Target
          </span>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.objective.id}>
          <div className={cx("flex items-center gap-2 border-y px-4 py-2 sm:px-5", BORDER, "bg-white/[0.02]")}>
            <group.objective.Icon size={14} aria-hidden="true" className={TEXT_AUX} />
            <h3 className={cx("text-xs font-semibold", TEXT_PRIMARY)} style={DISPLAY_STYLE}>
              {group.objective.code} — {group.objective.name}
            </h3>
            <Eyebrow className="ml-auto">{TEAM_LABEL[group.objective.team]}</Eyebrow>
          </div>
          <ul>
            {group.krs.map((kr) => (
              <BulletRow
                key={kr.id}
                kr={kr}
                value={period === "latest" ? kr.latest : kr.quarterStart}
                pinned={pinnedId === kr.id}
                hovered={hoveredId === kr.id}
                onHover={() => setHoveredId(kr.id)}
                onLeave={() => setHoveredId((cur) => (cur === kr.id ? null : cur))}
                onTogglePin={() => onTogglePin(kr.id)}
              />
            ))}
          </ul>
        </div>
      ))}
    </Card>
  );
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
