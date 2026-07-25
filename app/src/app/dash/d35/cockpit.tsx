"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  ScanSearch,
  Scale,
  Target,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ANALYST,
  APP_BG,
  BORDER,
  CATEGORY,
  CATEGORY_ORDER,
  DIVIDE,
  FOCUS_RING_INSET,
  HOLDINGS,
  HOVER_ROW,
  NUM,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TILE_TONE,
  TRANSITION,
  AS_OF,
  buildTreemap,
  clamp,
  cx,
  driftPct,
  fmtKRW,
  fmtKRWc,
  fmtPct,
  fmtSignedKRWc,
  fmtSignedPct,
  heroStats,
  holdingValue,
  needsRebalance,
  pnlAmount,
  portfolioWeight,
  round2,
  sparkSeries,
  toneFor,
  type CategoryId,
  type Holding,
  type PeriodId,
  type Tile,
} from "./data";
import { CommandPalette, Sidebar, Topbar } from "./shell";
import {
  Card,
  CardHeader,
  CategoryBadge,
  EyebrowLabel,
  FilterChip,
  SegmentedControl,
  SortableTh,
  Sparkline,
  TargetBar,
  type SortDir,
} from "./ui";

/* ---- P&L color helpers ------------------------------------------------ */
function pnlTextClass(v: number): string {
  return v > 0
    ? "text-emerald-700 dark:text-emerald-400"
    : v < 0
      ? "text-rose-700 dark:text-rose-400"
      : "text-zinc-600 dark:text-zinc-300";
}
function PnlArrow({ v, size = 13 }: { v: number; size?: number }) {
  if (v > 0) return <ArrowUpRight size={size} aria-hidden="true" />;
  if (v < 0) return <ArrowDownRight size={size} aria-hidden="true" />;
  return <Minus size={size} aria-hidden="true" />;
}

const PERIOD_LABEL: Record<PeriodId, string> = { "1D": "1D", "1W": "1W", "1M": "1M", YTD: "YTD" };

/* ==================================================================== */
/* Treemap                                                                */
/* ==================================================================== */

function Treemap({
  blocks,
  fullTotal,
  selectedId,
  onSelect,
}: {
  blocks: ReturnType<typeof buildTreemap>["blocks"];
  fullTotal: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const flat = useMemo(() => blocks.flatMap((b) => b.tiles), [blocks]);
  const flatIds = useMemo(() => flat.map((t) => t.holding.id), [flat]);

  const activeId = hoverId ?? focusId;
  const activeTile = activeId ? flat.find((t) => t.holding.id === activeId) ?? null : null;

  function centerOf(id: string) {
    const wrap = wrapRef.current;
    const el = tileRefs.current.get(id);
    if (!wrap || !el) return null;
    const wr = wrap.getBoundingClientRect();
    const tr = el.getBoundingClientRect();
    return {
      x: clamp(((tr.left + tr.width / 2 - wr.left) / wr.width) * 100, 0, 100),
      y: clamp(((tr.top + tr.height / 2 - wr.top) / wr.height) * 100, 0, 100),
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    setPos({
      x: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100),
      y: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100),
    });
  }

  function moveFocus(fromId: string, delta: number) {
    const idx = flatIds.indexOf(fromId);
    if (idx < 0) return;
    const next = clamp(idx + delta, 0, flatIds.length - 1);
    tileRefs.current.get(flatIds[next])?.focus();
  }

  const crosshair = activeTile ? pos : null;

  if (flat.length === 0) {
    return (
      <div className="flex h-[340px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 text-center dark:border-zinc-700 sm:h-[420px]">
        <ScanSearch size={22} aria-hidden="true" className={TEXT_CAPTION} />
        <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>No assets to display</p>
        <p className={cx("text-xs", TEXT_CAPTION)}>Select at least one asset class in the filter above.</p>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label="Portfolio asset treemap. Tile size represents market value, color represents P&L direction and strength."
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        setHoverId(null);
        if (!focusId) setPos(null);
      }}
      className="relative h-[340px] w-full select-none sm:h-[420px] lg:h-[480px]"
    >
      {blocks.map((block) => {
        const meta = CATEGORY[block.cat];
        const blockStyle: CSSProperties = {
          left: `${block.geom.x}%`,
          top: `${block.geom.y}%`,
          width: `${block.geom.w}%`,
          height: `${block.geom.h}%`,
        };
        return (
          <div
            key={block.cat}
            className="absolute flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-white/[0.02]"
            style={blockStyle}
          >
            <div className="flex h-6 shrink-0 items-center gap-1.5 px-2">
              <span className={cx("h-2 w-2 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
              <span className={cx("truncate text-[11px] font-semibold", TEXT_PRIMARY)}>{meta.label}</span>
              <span className={cx("ml-auto shrink-0 text-[11px] font-medium", NUM, TEXT_CAPTION)}>
                {fmtPct(block.weightPct, 1)}
              </span>
            </div>
            <div className="relative min-h-0 flex-1">
              {block.tiles.map((t) => (
                <TreemapTile
                  key={t.holding.id}
                  tile={t}
                  selected={t.holding.id === selectedId}
                  hovered={t.holding.id === hoverId || t.holding.id === focusId}
                  refCb={(el) => {
                    if (el) tileRefs.current.set(t.holding.id, el);
                    else tileRefs.current.delete(t.holding.id);
                  }}
                  onSelect={() => onSelect(t.holding.id)}
                  onEnter={() => setHoverId(t.holding.id)}
                  onLeave={() => setHoverId((cur) => (cur === t.holding.id ? null : cur))}
                  onFocus={() => {
                    setFocusId(t.holding.id);
                    const c = centerOf(t.holding.id);
                    if (c) setPos(c);
                  }}
                  onBlur={() => setFocusId((cur) => (cur === t.holding.id ? null : cur))}
                  onArrow={(delta) => moveFocus(t.holding.id, delta)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {crosshair ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 z-20 h-px bg-zinc-900/20 dark:bg-white/25" style={{ top: `${crosshair.y}%` }} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 z-20 w-px bg-zinc-900/20 dark:bg-white/25" style={{ left: `${crosshair.x}%` }} aria-hidden="true" />
        </>
      ) : null}

      {activeTile && crosshair ? (
        <TreemapTooltip tile={activeTile} fullTotal={fullTotal} x={crosshair.x} y={crosshair.y} />
      ) : null}
    </div>
  );
}

function TreemapTile({
  tile,
  selected,
  hovered,
  refCb,
  onSelect,
  onEnter,
  onLeave,
  onFocus,
  onBlur,
  onArrow,
}: {
  tile: Tile;
  selected: boolean;
  hovered: boolean;
  refCb: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onEnter: () => void;
  onLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onArrow: (delta: number) => void;
}) {
  const meta = CATEGORY[tile.holding.category];
  const tone = TILE_TONE[toneFor(tile.pnlPct)];
  const ring = selected
    ? "z-10 ring-2 ring-violet-500 dark:ring-violet-400"
    : hovered
      ? "z-10 ring-1 ring-zinc-900/30 dark:ring-white/40"
      : tone.ring;
  const style: CSSProperties = {
    left: `${tile.geom.x}%`,
    top: `${tile.geom.y}%`,
    width: `${tile.geom.w}%`,
    height: `${tile.geom.h}%`,
  };
  const label = `${tile.holding.symbol} ${tile.holding.name}, ${meta.label}, weight ${fmtPct(tile.weightPct, 1)}, P&L ${fmtSignedPct(tile.pnlPct)}`;
  return (
    <button
      ref={refCb}
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onSelect}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          onArrow(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          onArrow(-1);
        }
      }}
      style={style}
      className={cx(
        "absolute flex flex-col justify-between overflow-hidden rounded-md border border-black/[0.06] p-1 text-left shadow-sm dark:border-white/[0.08]",
        tone.fill,
        ring,
        TRANSITION,
        FOCUS_RING_INSET,
        "hover:shadow",
      )}
    >
      {tile.detail !== "none" ? (
        <>
          <span className={cx("block truncate text-[10px] font-semibold leading-tight sm:text-[11px]", NUM, TEXT_PRIMARY)}>
            {tile.holding.symbol}
          </span>
          {tile.detail !== "min" ? (
            <span className="mt-auto min-w-0">
              <span className={cx("flex items-center gap-0.5 text-[10px] font-semibold leading-none sm:text-[11px]", NUM, tone.num)}>
                <PnlArrow v={tile.pnlPct} size={10} />
                <span className="truncate">{fmtSignedPct(tile.pnlPct, 1)}</span>
              </span>
              {tile.detail === "full" ? (
                <span className={cx("mt-0.5 block truncate text-[10px] leading-none", NUM, "text-zinc-600 dark:text-zinc-400")}>
                  {fmtPct(tile.weightPct, 1)}
                </span>
              ) : null}
            </span>
          ) : null}
        </>
      ) : null}
    </button>
  );
}

function TreemapTooltip({ tile, fullTotal, x, y }: { tile: Tile; fullTotal: number; x: number; y: number }) {
  const meta = CATEGORY[tile.holding.category];
  const tx = x > 55 ? "calc(-100% - 12px)" : "12px";
  const ty = y > 62 ? "calc(-100% - 12px)" : "12px";
  return (
    <div
      className="pointer-events-none absolute z-30 w-52 rounded-lg border border-zinc-200 bg-white/95 p-2.5 shadow-xl backdrop-blur transition-opacity duration-100 motion-reduce:transition-none dark:border-zinc-700 dark:bg-zinc-900/95"
      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(${tx}, ${ty})` }}
      role="status"
    >
      <div className="flex items-center gap-1.5">
        <span className={cx("h-2 w-2 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
        <span className={cx("truncate text-xs font-semibold", NUM, TEXT_PRIMARY)}>{tile.holding.symbol}</span>
        <span className={cx("truncate text-[11px]", TEXT_CAPTION)}>{tile.holding.name}</span>
      </div>
      <dl className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <dt className={cx("text-[11px]", TEXT_CAPTION)}>Weight</dt>
          <dd className={cx("text-[11px] font-medium", NUM, TEXT_PRIMARY)}>{fmtPct(tile.weightPct, 1)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className={cx("text-[11px]", TEXT_CAPTION)}>Market value</dt>
          <dd className={cx("text-[11px] font-medium", NUM, TEXT_PRIMARY)}>{fmtKRWc(tile.value)}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className={cx("text-[11px]", TEXT_CAPTION)}>P&L</dt>
          <dd className={cx("inline-flex items-center gap-0.5 text-[11px] font-semibold", NUM, pnlTextClass(tile.pnlPct))}>
            <PnlArrow v={tile.pnlPct} size={11} />
            {fmtSignedPct(tile.pnlPct)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ==================================================================== */
/* Hero band                                                            */
/* ==================================================================== */

function AllocationDonut({ period, fullTotal, active }: { period: PeriodId; fullTotal: number; active: ReadonlySet<CategoryId> }) {
  const R = 42;
  const C = round2(2 * Math.PI * R);
  const segs = useMemo(() => {
    let offset = 0;
    return CATEGORY_ORDER.map((cat) => {
      const total = HOLDINGS.filter((h) => h.category === cat).reduce((s, h) => s + holdingValue(h, period), 0);
      const w = fullTotal ? (total / fullTotal) * 100 : 0;
      const dash = round2((w / 100) * C);
      const seg = { cat, w, dash: Math.max(0, dash - 1.5), gap: round2(C - Math.max(0, dash - 1.5)), offset: round2(-offset) };
      offset += dash;
      return seg;
    });
  }, [period, fullTotal, C]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={R} fill="none" strokeWidth="12" className="stroke-zinc-100 dark:stroke-zinc-800" />
          {segs.map((s) => (
            <circle
              key={s.cat}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              strokeWidth="12"
              strokeLinecap="butt"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
              className={cx("stroke-current", CATEGORY[s.cat].arc, active.has(s.cat) ? "opacity-100" : "opacity-20")}
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className={cx("text-[10px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>Mix</span>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-1.5">
        {CATEGORY_ORDER.map((cat) => {
          const total = HOLDINGS.filter((h) => h.category === cat).reduce((s, h) => s + holdingValue(h, period), 0);
          const w = fullTotal ? (total / fullTotal) * 100 : 0;
          const on = active.has(cat);
          return (
            <div key={cat} className={cx("flex items-center gap-2", on ? "" : "opacity-45")}>
              <span className={cx("h-2 w-2 shrink-0 rounded-full", CATEGORY[cat].dot)} aria-hidden="true" />
              <dt className={cx("text-xs", TEXT_SECONDARY)}>{CATEGORY[cat].label}</dt>
              <dd className={cx("ml-auto text-xs font-semibold", NUM, TEXT_PRIMARY)}>{fmtPct(w, 1)}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function HeroBand({
  period,
  onPeriod,
  active,
  onToggle,
  onReset,
  fullTotal,
}: {
  period: PeriodId;
  onPeriod: (p: PeriodId) => void;
  active: ReadonlySet<CategoryId>;
  onToggle: (c: CategoryId) => void;
  onReset: () => void;
  fullTotal: number;
}) {
  const stats = useMemo(() => heroStats(HOLDINGS, period, active), [period, active]);
  const allOn = active.size === CATEGORY_ORDER.length;

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <EyebrowLabel>Total Market Value{allOn ? "" : " · Selected Assets"}</EyebrowLabel>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className={cx("text-3xl font-semibold tracking-tight sm:text-4xl", NUM, TEXT_PRIMARY)}>{fmtKRW(stats.total)}</span>
            <span className={cx("inline-flex items-center gap-1 text-sm font-semibold", NUM, pnlTextClass(stats.pnl))}>
              <PnlArrow v={stats.pnl} />
              {fmtSignedKRWc(stats.pnl)}
              <span className="text-zinc-400 dark:text-zinc-500">·</span>
              {fmtSignedPct(stats.pnlPct)}
            </span>
          </div>

          <dl className="mt-4 flex flex-wrap items-stretch gap-2">
            <StatChip label={`${PERIOD_LABEL[period]} P&L`}>
              <span className={cx("inline-flex items-center gap-1", pnlTextClass(stats.pnl))}>
                <PnlArrow v={stats.pnl} size={12} />
                {fmtSignedPct(stats.pnlPct)}
              </span>
            </StatChip>
            <StatChip label="vs. Prior Day">
              <span className={cx("inline-flex items-center gap-1", pnlTextClass(stats.dayPnl))}>
                <PnlArrow v={stats.dayPnl} size={12} />
                {fmtSignedPct(stats.dayPnlPct)}
              </span>
            </StatChip>
            <StatChip label="Needs Rebalancing">
              <span className={cx("inline-flex items-center gap-1", stats.rebalanceCount > 0 ? "text-amber-700 dark:text-amber-400" : TEXT_SECONDARY)}>
                <Scale size={12} aria-hidden="true" />
                {stats.rebalanceCount} holdings
              </span>
            </StatChip>
            <StatChip label="Holdings">
              <span className={TEXT_SECONDARY}>{stats.holdingCount} holdings</span>
            </StatChip>
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <SegmentedControl<PeriodId>
              ariaLabel="Select period"
              value={period}
              onChange={onPeriod}
              options={[
                { id: "1D", label: "1D" },
                { id: "1W", label: "1W" },
                { id: "1M", label: "1M" },
                { id: "YTD", label: "YTD" },
              ]}
            />
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Asset class filter">
              <FilterChip active={allOn} onClick={onReset}>
                All
              </FilterChip>
              {CATEGORY_ORDER.map((cat) => (
                <FilterChip key={cat} active={active.has(cat)} dot={CATEGORY[cat].dot} onClick={() => onToggle(cat)}>
                  {CATEGORY[cat].label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 border-zinc-200 dark:border-zinc-800">
          <AllocationDonut period={period} fullTotal={fullTotal} active={active} />
        </div>
      </div>
    </Card>
  );
}

function StatChip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={cx("rounded-lg border px-3 py-2", BORDER, "bg-zinc-50/60 dark:bg-white/[0.02]")}>
      <dt className={cx("text-[10px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>{label}</dt>
      <dd className={cx("mt-0.5 text-sm font-semibold", NUM)}>{children}</dd>
    </div>
  );
}

/* ==================================================================== */
/* Detail panel                                                             */
/* ==================================================================== */

function DetailPanel({ holding, period, fullTotal }: { holding: Holding; period: PeriodId; fullTotal: number }) {
  const meta = CATEGORY[holding.category];
  const analyst = ANALYST[holding.category];
  const value = holdingValue(holding, period);
  const pnl = pnlAmount(holding, period);
  const pnlPct = holding.returns[period] * 100;
  const weight = portfolioWeight(holding, period, fullTotal);
  const drift = driftPct(holding, period, fullTotal);
  const rebal = needsRebalance(holding, period, fullTotal);
  const idx = HOLDINGS.findIndex((h) => h.id === holding.id);
  const spark = useMemo(() => sparkSeries(idx, holding.returns["1M"]), [idx, holding]);

  return (
    <Card padded={false} className="flex h-full flex-col overflow-hidden">
      <div className={cx("border-b p-4 sm:p-5", BORDER)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className={cx("text-xl font-semibold tracking-tight", NUM, TEXT_PRIMARY)}>{holding.symbol}</h2>
              <CategoryBadge meta={meta} />
            </div>
            <p className={cx("mt-0.5 truncate text-sm", TEXT_SECONDARY)}>{holding.name}</p>
          </div>
          {rebal ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20">
              <TriangleAlert size={11} aria-hidden="true" />
              Rebalance recommended
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20">
              <Target size={11} aria-hidden="true" />
              Within band
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800">
        <DetailStat label="Market Value" value={fmtKRW(value)} />
        <DetailStat label={`${PERIOD_LABEL[period]} P&L`}>
          <span className={cx("inline-flex items-center gap-1", pnlTextClass(pnl))}>
            <PnlArrow v={pnl} size={13} />
            {fmtSignedPct(pnlPct)}
          </span>
          <span className={cx("mt-0.5 block text-xs font-medium", NUM, pnlTextClass(pnl))}>{fmtSignedKRWc(pnl)}</span>
        </DetailStat>
        <DetailStat label="Cost Basis" value={fmtKRW(holding.cost)} />
        <DetailStat label="Portfolio Weight" value={fmtPct(weight, 1)} />
      </div>

      <div className={cx("border-t p-4 sm:p-5", BORDER)}>
        <div className="flex items-center justify-between">
          <EyebrowLabel>Vs. Target Allocation</EyebrowLabel>
          <span className={cx("text-xs font-semibold", NUM, Math.abs(drift) >= 2 ? "text-amber-700 dark:text-amber-400" : TEXT_SECONDARY)}>
            {fmtSignedPct(drift, 1).replace("%", "")}pp
          </span>
        </div>
        <div className="mt-2">
          <TargetBar actual={weight} target={holding.target} />
        </div>
        <div className={cx("mt-1.5 flex items-center justify-between text-[11px]", NUM, TEXT_CAPTION)}>
          <span>Current {fmtPct(weight, 1)}</span>
          <span>Target {fmtPct(holding.target, 0)}</span>
        </div>
      </div>

      <div className={cx("border-t p-4 sm:p-5", BORDER)}>
        <div className="flex items-center justify-between">
          <EyebrowLabel>20-Day Trend</EyebrowLabel>
          <span className={cx("text-[11px] font-medium", NUM, pnlTextClass(holding.returns["1M"]))}>1M {fmtSignedPct(holding.returns["1M"] * 100, 1)}</span>
        </div>
        <div className="mt-2 h-14">
          <Sparkline values={spark} up={holding.returns["1M"] >= 0} label={`${holding.symbol} 20-day trend`} className="h-full w-full" />
        </div>
      </div>

      <div className={cx("mt-auto flex items-center gap-2.5 border-t p-4", BORDER, "bg-zinc-50/60 dark:bg-white/[0.02]")}>
        <Image
          src={`https://images.unsplash.com/photo-${analyst.avatarId}?auto=format&fit=crop&crop=faces&w=64&h=64&q=80`}
          alt={`${analyst.name} analyst profile photo`}
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full border border-black/5 object-cover dark:border-white/10"
        />
        <div className="min-w-0">
          <p className={cx("truncate text-xs font-medium", TEXT_PRIMARY)}>{analyst.name}</p>
          <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>Coverage · {analyst.role}</p>
        </div>
      </div>
    </Card>
  );
}

function DetailStat({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="bg-white p-3.5 dark:bg-zinc-900">
      <dt className={cx("text-[10px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>{label}</dt>
      <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{value ?? children}</dd>
    </div>
  );
}

/* ==================================================================== */
/* Holdings table                                                       */
/* ==================================================================== */

type SortKey = "symbol" | "weight" | "value" | "pnlPct" | "pnlAmt";

function HoldingsTable({
  holdings,
  period,
  fullTotal,
  selectedId,
  onSelect,
}: {
  holdings: Holding[];
  period: PeriodId;
  fullTotal: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("weight");
  const [dir, setDir] = useState<SortDir>("desc");

  function onSort(key: SortKey) {
    if (key === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDir(key === "symbol" ? "asc" : "desc");
    }
  }

  const rows = useMemo(() => {
    const withVals = holdings.map((h) => ({
      h,
      value: holdingValue(h, period),
      pnlPct: h.returns[period] * 100,
      pnlAmt: pnlAmount(h, period),
      weight: portfolioWeight(h, period, fullTotal),
    }));
    withVals.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "symbol") cmp = a.h.symbol.localeCompare(b.h.symbol);
      else cmp = a[sortKey] - b[sortKey];
      return dir === "asc" ? cmp : -cmp;
    });
    return withVals;
  }, [holdings, period, fullTotal, sortKey, dir]);

  return (
    <Card padded={false}>
      <div className="p-4 sm:p-5">
        <CardHeader
          title="Holdings"
          description={`${rows.length} holdings · ${AS_OF}`}
          action={<span className={cx("hidden text-[11px] sm:inline", TEXT_CAPTION)}>Selecting a row syncs the treemap and detail panel</span>}
        />
      </div>
      <div className="sr-only" aria-live="polite">
        {selectedId ? `${HOLDINGS.find((h) => h.id === selectedId)?.symbol ?? ""} holding selected.` : ""}
      </div>
      <div className={cx("border-t", BORDER)}>
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Holdings with weight, market value, and P&L detail. Sort using the column header buttons.</caption>
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[13%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <SortableTh columnKey="symbol" activeKey={sortKey} dir={dir} onSort={onSort}>
                Holding
              </SortableTh>
              <th scope="col" className="px-3 py-2 text-left">
                <span className={cx("text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>Class</span>
              </th>
              <SortableTh columnKey="weight" activeKey={sortKey} dir={dir} onSort={onSort} align="right">
                Weight
              </SortableTh>
              <SortableTh columnKey="value" activeKey={sortKey} dir={dir} onSort={onSort} align="right">
                Value
              </SortableTh>
              <SortableTh columnKey="pnlPct" activeKey={sortKey} dir={dir} onSort={onSort} align="right">
                P&L %
              </SortableTh>
              <SortableTh columnKey="pnlAmt" activeKey={sortKey} dir={dir} onSort={onSort} align="right">
                P&L Amt
              </SortableTh>
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className={cx("px-4 py-10 text-center text-sm", TEXT_CAPTION)}>
                  No asset classes selected.
                </td>
              </tr>
            ) : (
              rows.map(({ h, value, pnlPct, pnlAmt, weight }) => {
                const meta = CATEGORY[h.category];
                const selected = h.id === selectedId;
                return (
                  <tr
                    key={h.id}
                    onClick={() => onSelect(h.id)}
                    className={cx(
                      "cursor-pointer",
                      TRANSITION,
                      selected ? "bg-violet-50 dark:bg-violet-500/10" : HOVER_ROW,
                    )}
                  >
                    <td className={cx("py-2.5 pl-3 pr-2", selected ? "border-l-2 border-violet-500" : "border-l-2 border-transparent")}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onSelect(h.id)}
                        className={cx("flex w-full min-w-0 items-center gap-2 rounded text-left", FOCUS_RING_INSET)}
                      >
                        <span className={cx("h-2 w-2 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
                        <span className="min-w-0">
                          <span className={cx("block truncate text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>{h.symbol}</span>
                          <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>{h.name}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <CategoryBadge meta={meta} short />
                    </td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-[13px] font-medium", NUM, TEXT_PRIMARY)}>
                      {fmtPct(weight, 1)}
                    </td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-[13px] font-medium", NUM, TEXT_PRIMARY)}>
                      {fmtKRWc(value)}
                    </td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-[13px] font-semibold", NUM, pnlTextClass(pnlPct))}>
                      <span className="inline-flex items-center justify-end gap-0.5">
                        <PnlArrow v={pnlPct} size={12} />
                        {fmtSignedPct(pnlPct, 1)}
                      </span>
                    </td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 pr-3 text-right text-[13px] font-medium", NUM, pnlTextClass(pnlAmt))}>
                      {fmtSignedKRWc(pnlAmt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ==================================================================== */
/* Orchestrator                                                        */
/* ==================================================================== */

export default function Cockpit() {
  const [period, setPeriod] = useState<PeriodId>("1D");
  const [active, setActive] = useState<ReadonlySet<CategoryId>>(() => new Set(CATEGORY_ORDER));
  const [selectedId, setSelectedId] = useState<string>("nvda");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const model = useMemo(() => buildTreemap(HOLDINGS, period, active), [period, active]);
  const activeHoldings = useMemo(() => HOLDINGS.filter((h) => active.has(h.category)), [active]);
  const selected = HOLDINGS.find((h) => h.id === selectedId) ?? HOLDINGS[0];

  function toggleCat(c: CategoryId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }
  function resetCats() {
    setActive(new Set(CATEGORY_ORDER));
  }
  function selectHolding(id: string) {
    const h = HOLDINGS.find((x) => x.id === id);
    if (h && !active.has(h.category)) {
      setActive((prev) => new Set(prev).add(h.category));
    }
    setSelectedId(id);
  }

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", APP_BG, TEXT_PRIMARY)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            <div>
              <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Allocation Cockpit</h1>
              <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Personal Brokerage Account · Asset Allocation Treemap · {AS_OF}</p>
            </div>

            <HeroBand
              period={period}
              onPeriod={setPeriod}
              active={active}
              onToggle={toggleCat}
              onReset={resetCats}
              fullTotal={model.fullTotal}
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
              <div className="min-w-0 xl:col-span-8">
                <Card padded={false} className="flex h-full flex-col">
                  <div className="p-4 sm:p-5">
                    <CardHeader
                      title="Asset Allocation Treemap"
                      description="Tile size is market value, color is P&L direction and strength. Selecting a tile syncs the detail panel and table."
                    />
                  </div>
                  <div className={cx("border-t px-3 pb-3 pt-3 sm:px-4 sm:pb-4", BORDER)}>
                    <Treemap blocks={model.blocks} fullTotal={model.fullTotal} selectedId={selectedId} onSelect={selectHolding} />
                  </div>
                </Card>
              </div>

              <div className="min-w-0 xl:col-span-4">
                <DetailPanel holding={selected} period={period} fullTotal={model.fullTotal} />
              </div>
            </div>

            <HoldingsTable
              holdings={activeHoldings}
              period={period}
              fullTotal={model.fullTotal}
              selectedId={selectedId}
              onSelect={selectHolding}
            />
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectHolding={selectHolding} /> : null}
    </div>
  );
}
