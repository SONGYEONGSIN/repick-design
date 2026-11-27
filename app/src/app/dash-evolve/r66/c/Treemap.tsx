"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Brain, CreditCard, Cpu, Database, HardDrive, Megaphone, MoreHorizontal, Network, Server, Smartphone, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { squarify } from "./treemapLayout";
import {
  CATEGORY_LABEL,
  grandTotal,
  teamName,
  teamTotal,
  usd,
  usdCompact,
  pctFmt,
  findCost,
  type ServiceCategory,
  type TeamCost,
  type TeamId,
} from "./data";
import { CATEGORY_STYLE, FOCUS } from "./ui";

const TEAM_ICON: Record<TeamId, LucideIcon> = {
  platform: Server,
  payments: CreditCard,
  growth: Megaphone,
  "data-ml": Brain,
  mobile: Smartphone,
  "core-api": Terminal,
};

const CATEGORY_ICON: Record<ServiceCategory, LucideIcon> = {
  compute: Cpu,
  database: Database,
  storage: HardDrive,
  network: Network,
  observability: Activity,
  other: MoreHorizontal,
};

const GAP_TEAM = 8;
const GAP_SVC = 5;
const HEADER_H = 32;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface TileLayout {
  teamId: TeamId;
  category: ServiceCategory;
  rect: Rect;
}

interface GroupLayout {
  team: TeamCost;
  frame: Rect;
}

interface ActiveTile {
  teamId: TeamId;
  category: ServiceCategory;
  rect: Rect;
}

export function Treemap({
  teams,
  compareTeams,
  selected,
  onSelect,
}: {
  teams: TeamCost[];
  compareTeams: TeamCost[] | null;
  selected: { teamId: TeamId; category: ServiceCategory } | null;
  onSelect: (teamId: TeamId, category: ServiceCategory) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverTile, setHoverTile] = useState<ActiveTile | null>(null);
  const [focusTile, setFocusTile] = useState<ActiveTile | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const total = useMemo(() => grandTotal(teams), [teams]);

  const { groups, tiles } = useMemo(() => {
    if (size.w <= 0 || size.h <= 0) return { groups: [] as GroupLayout[], tiles: [] as TileLayout[] };
    const teamItems = [...teams]
      .map((t) => ({ id: t.id, value: teamTotal(t) }))
      .sort((a, b) => b.value - a.value);
    const teamRects = squarify(teamItems, 0, 0, size.w, size.h);

    const groups: GroupLayout[] = [];
    const tiles: TileLayout[] = [];
    for (const tr of teamRects) {
      const team = teams.find((t) => t.id === tr.id);
      if (!team) continue;
      const frame: Rect = { x: tr.x + GAP_TEAM / 2, y: tr.y + GAP_TEAM / 2, w: Math.max(tr.w - GAP_TEAM, 0), h: Math.max(tr.h - GAP_TEAM, 0) };
      groups.push({ team, frame });

      const bodyY = frame.y + HEADER_H;
      const bodyH = Math.max(frame.h - HEADER_H, 0);
      const svcItems = [...team.services].map((s) => ({ id: s.category, value: s.cost })).sort((a, b) => b.value - a.value);
      const svcRects = squarify(svcItems, frame.x, bodyY, frame.w, bodyH);
      for (const sr of svcRects) {
        tiles.push({
          teamId: team.id,
          category: sr.id as ServiceCategory,
          rect: { x: sr.x + GAP_SVC / 2, y: sr.y + GAP_SVC / 2, w: Math.max(sr.w - GAP_SVC, 0), h: Math.max(sr.h - GAP_SVC, 0) },
        });
      }
    }
    return { groups, tiles };
  }, [teams, size]);

  const active = focusTile ?? hoverTile;

  return (
    <div ref={containerRef} className="relative h-full w-full min-w-0">
      {size.w <= 0 || size.h <= 0 ? (
        <div className="motion-reduce:animate-none h-full w-full animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
      ) : (
        <>
          {groups.map((g) => {
            const Icon = TEAM_ICON[g.team.id];
            return (
              <div
                key={g.team.id}
                className="absolute overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
                style={{ left: g.frame.x, top: g.frame.y, width: g.frame.w, height: g.frame.h }}
              >
                <div className="flex h-8 min-w-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-2.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-50">{teamName(g.team.id)}</span>
                  <span className="shrink-0 whitespace-nowrap text-[11px] font-normal tabular-nums text-zinc-400">{usdCompact(teamTotal(g.team))}</span>
                </div>
              </div>
            );
          })}

          {tiles.map((tile) => {
            const svc = teams.find((t) => t.id === tile.teamId)!.services.find((s) => s.category === tile.category)!;
            const team = teams.find((t) => t.id === tile.teamId)!;
            const style = CATEGORY_STYLE[tile.category];
            const Icon = CATEGORY_ICON[tile.category];
            const isSelected = selected?.teamId === tile.teamId && selected.category === tile.category;
            const pctOfTeam = (svc.cost / teamTotal(team)) * 100;
            const minDim = Math.min(tile.rect.w, tile.rect.h);
            const valueTextClass = minDim >= 150 ? "text-xl" : minDim >= 100 ? "text-base" : minDim >= 70 ? "text-sm" : "text-xs";
            const showShare = tile.rect.h >= 68 && tile.rect.w >= 90;
            const showIcon = tile.rect.w >= 70;
            const domId = `tile-${tile.teamId}-${tile.category}`;
            const borderClass = isSelected ? "border-2 border-violet-500" : `border ${style.border} ${style.borderHover}`;
            const dashedClass = style.dashed ? "border-dashed" : "";

            return (
              <button
                key={domId}
                id={domId}
                type="button"
                aria-describedby="treemap-tooltip"
                onClick={() => onSelect(tile.teamId, tile.category)}
                onMouseEnter={() => setHoverTile({ teamId: tile.teamId, category: tile.category, rect: tile.rect })}
                onMouseLeave={() => setHoverTile((cur) => (cur?.teamId === tile.teamId && cur.category === tile.category ? null : cur))}
                onFocus={() => setFocusTile({ teamId: tile.teamId, category: tile.category, rect: tile.rect })}
                onBlur={() => setFocusTile((cur) => (cur?.teamId === tile.teamId && cur.category === tile.category ? null : cur))}
                className={`${FOCUS} absolute flex flex-col items-start justify-start gap-0.5 overflow-hidden rounded-md px-2.5 py-2 text-left transition-colors ${style.fill} ${style.text} ${borderClass} ${dashedClass}`}
                style={{ left: tile.rect.x, top: tile.rect.y, width: tile.rect.w, height: tile.rect.h }}
              >
                <span className="flex min-w-0 w-full items-center gap-1">
                  {showIcon && <Icon className="h-3 w-3 shrink-0 opacity-80" aria-hidden="true" />}
                  <span className="min-w-0 flex-1 truncate text-[10px] font-medium uppercase tracking-[0.07em]">{CATEGORY_LABEL[tile.category]}</span>
                </span>
                <span className={`w-full truncate font-semibold tabular-nums ${valueTextClass}`}>{usdCompact(svc.cost)}</span>
                {showShare && <span className="w-full truncate text-[10px] font-normal tabular-nums">{pctFmt(pctOfTeam)} of team</span>}
                {/* Extends, never replaces, the visible text above -- a competing custom aria-label here
                    (full dollar figure, team name, "Press Enter") previously failed label-content-name-mismatch
                    because its wording didn't literally contain the rendered "$182K" / "49.1% of team" strings. */}
                <span className="sr-only">
                  {" "}
                  — {usd(svc.cost)} — {pctFmt(pctOfTeam)} of {teamName(tile.teamId)} team spend. Press Enter to view the breakdown.
                </span>
              </button>
            );
          })}

          <Tooltip active={active} teams={teams} compareTeams={compareTeams} total={total} containerSize={size} />
        </>
      )}
    </div>
  );
}

/** One shared tooltip element positioned via the currently hovered/focused tile's coordinates,
 *  instead of a per-tile absolutely-positioned node (which would each contribute their full
 *  un-clipped box to `scrollWidth` even while invisible). Supplies strictly additional detail —
 *  the headline cost is already permanent text on every tile, never hover-only. */
function Tooltip({
  active,
  teams,
  compareTeams,
  total,
  containerSize,
}: {
  active: ActiveTile | null;
  teams: TeamCost[];
  compareTeams: TeamCost[] | null;
  total: number;
  containerSize: { w: number; h: number };
}) {
  const info = useMemo(() => {
    if (!active) return null;
    const team = teams.find((t) => t.id === active.teamId);
    const svc = team?.services.find((s) => s.category === active.category);
    if (!team || !svc) return null;
    const prevCost = compareTeams ? findCost(compareTeams, active.teamId, active.category) : null;
    const delta = prevCost ? ((svc.cost - prevCost) / prevCost) * 100 : null;
    return {
      teamName: teamName(team.id),
      category: active.category,
      cost: svc.cost,
      pctOfTeam: (svc.cost / teamTotal(team)) * 100,
      pctOfTotal: (svc.cost / total) * 100,
      delta,
    };
  }, [active, teams, compareTeams, total]);

  const maxWidth = 240;
  let left = 0;
  let top = 0;
  let placeBelow = false;
  if (active) {
    const centerX = active.rect.x + active.rect.w / 2;
    left = Math.min(Math.max(centerX - maxWidth / 2, 8), Math.max(containerSize.w - maxWidth - 8, 8));
    placeBelow = active.rect.y < 96;
    top = placeBelow ? active.rect.y + active.rect.h + 8 : active.rect.y - 8;
  }

  return (
    <div
      id="treemap-tooltip"
      role="status"
      className="pointer-events-none absolute z-20 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-xs shadow-2xl shadow-black/60 transition-opacity motion-reduce:transition-none"
      style={{
        left,
        top,
        width: maxWidth,
        transform: placeBelow ? undefined : "translateY(-100%)",
        opacity: info ? 1 : 0,
      }}
    >
      {info && (
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.07em] text-zinc-400">
            {info.teamName} &middot; {CATEGORY_LABEL[info.category]}
          </p>
          <p className="truncate font-semibold tabular-nums text-zinc-50">{usd(info.cost)}</p>
          <p className="truncate font-normal tabular-nums text-zinc-400">
            {pctFmt(info.pctOfTeam)} of team &middot; {pctFmt(info.pctOfTotal)} of total
          </p>
          {info.delta !== null && (
            <p className={`truncate font-normal tabular-nums ${info.delta >= 0 ? "text-zinc-50" : "text-zinc-400"}`}>
              {info.delta >= 0 ? "+" : ""}
              {info.delta.toFixed(1)}% vs prior period
            </p>
          )}
        </div>
      )}
    </div>
  );
}
