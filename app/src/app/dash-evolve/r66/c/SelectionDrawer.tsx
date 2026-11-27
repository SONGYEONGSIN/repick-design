"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Brain,
  CreditCard,
  Cpu,
  Database,
  HardDrive,
  Megaphone,
  MoreHorizontal,
  Network,
  Server,
  Smartphone,
  Terminal,
} from "lucide-react";
import {
  CATEGORY_LABEL,
  PERIOD_COMPARE,
  PERIOD_DATA,
  PERIOD_LABEL,
  TEAMS_LAST_MONTH,
  TEAMS_MONTH_BEFORE,
  TEAMS_THIS_MONTH,
  findCost,
  findTeam,
  grandTotal,
  teamName,
  teamTotal,
  usd,
  pctFmt,
  type Period,
  type ServiceCategory,
  type TeamId,
} from "./data";
import { CategoryBadge, FOCUS, Progress, Sparkline, lockBodyScroll, trapTabKey } from "./ui";

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

export interface Selection {
  teamId: TeamId;
  category: ServiceCategory;
}

/**
 * The ephemeral selection overlay. The parent always renders `<SelectionDrawer selection={...}
 * .../>`, but `selection` is only non-null while a tile/row is selected — `<AnimatePresence>`
 * renders nothing to the DOM at all when it is null (no hidden node, no empty detail pane), and
 * plays a real exit transition before the panel's effects (focus restore, scroll unlock) run on
 * unmount. It is deliberately a sibling concern to the treemap/table view toggle, not a merge of
 * the two: opening it never changes which view is showing, and switching views never opens or
 * closes it.
 */
export function SelectionDrawer({
  selection,
  period,
  onClose,
  onJumpToTable,
}: {
  selection: Selection | null;
  period: Period;
  onClose: () => void;
  onJumpToTable: (teamId: TeamId, category: ServiceCategory) => void;
}) {
  return (
    <AnimatePresence>
      {selection && (
        <DrawerBody
          key={`${selection.teamId}:${selection.category}`}
          selection={selection}
          period={period}
          onClose={onClose}
          onJumpToTable={onJumpToTable}
        />
      )}
    </AnimatePresence>
  );
}

function DrawerBody({
  selection,
  period,
  onClose,
  onJumpToTable,
}: {
  selection: Selection;
  period: Period;
  onClose: () => void;
  onJumpToTable: (teamId: TeamId, category: ServiceCategory) => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const unlock = lockBodyScroll();
    return () => {
      unlock();
      previouslyFocused?.focus?.();
    };
  }, []);

  const teams = PERIOD_DATA[period];
  const team = findTeam(teams, selection.teamId);
  const svc = team?.services.find((s) => s.category === selection.category);
  if (!team || !svc) return null;

  const tTotal = teamTotal(team);
  const grand = grandTotal(teams);
  const pctOfTeam = (svc.cost / tTotal) * 100;
  const pctOfGrand = (svc.cost / grand) * 100;

  const compare = PERIOD_COMPARE[period];
  const prevCost = compare ? findCost(compare, selection.teamId, selection.category) : null;
  const delta = prevCost ? ((svc.cost - prevCost) / prevCost) * 100 : null;

  const trend = [TEAMS_MONTH_BEFORE, TEAMS_LAST_MONTH, TEAMS_THIS_MONTH]
    .map((snapshot) => findCost(snapshot, selection.teamId, selection.category))
    .filter((v): v is number => v !== null);

  const siblings = [...team.services].filter((s) => s.category !== selection.category).sort((a, b) => b.cost - a.cost);

  const TeamIcon = TEAM_ICON[team.id];
  const CategoryIcon = CATEGORY_ICON[selection.category];
  const titleId = "drawer-title";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.button
        type="button"
        aria-label="Close breakdown panel"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        className="absolute inset-0 bg-black/60"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            return;
          }
          trapTabKey(e, panelRef.current);
        }}
        initial={{ x: reduceMotion ? 0 : "100%" }}
        animate={{ x: 0 }}
        exit={{ x: reduceMotion ? 0 : "100%" }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
        className="relative z-10 flex h-full w-full max-w-sm min-w-0 flex-col border-l border-white/10 bg-zinc-950 shadow-2xl shadow-black/60"
      >
        <div className="flex h-14 min-w-0 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <TeamIcon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold text-zinc-50">
              {CATEGORY_LABEL[selection.category]} &middot; {teamName(team.id)}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close breakdown panel"
            className={`${FOCUS} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto p-4">
          <div className="flex min-w-0 items-center gap-2">
            <CategoryIcon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <CategoryBadge category={selection.category} />
            <span className="ml-auto shrink-0 text-xs font-normal text-zinc-400">{PERIOD_LABEL[period]}</span>
          </div>

          <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-50">{usd(svc.cost)}</p>
          {delta !== null && (
            <p className="mt-1 text-sm font-normal tabular-nums text-zinc-400">
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)}% vs the prior period
            </p>
          )}

          <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-white/10 pt-4">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Share of {teamName(team.id)}</span>
                <span className="whitespace-nowrap text-xs font-normal tabular-nums text-zinc-400">{pctFmt(pctOfTeam)}</span>
              </div>
              <div className="mt-1.5">
                <Progress value={pctOfTeam} label={`${CATEGORY_LABEL[selection.category]} is ${pctFmt(pctOfTeam)} of ${teamName(team.id)}'s spend`} />
              </div>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-2 text-sm">
              <span className="text-zinc-400">Share of workspace total</span>
              <span className="whitespace-nowrap tabular-nums font-medium text-zinc-50">{pctFmt(pctOfGrand)}</span>
            </div>
          </div>

          {trend.length === 3 && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">3-month trend</span>
                <span className="whitespace-nowrap text-xs font-normal tabular-nums text-zinc-400">
                  {usd(trend[0])} &rarr; {usd(trend[2])}
                </span>
              </div>
              <Sparkline
                values={trend}
                width={248}
                height={40}
                className="mt-2 text-violet-500"
                ariaLabel={`${CATEGORY_LABEL[selection.category]} spend for ${teamName(team.id)} over the last 3 months: from ${usd(trend[0])} to ${usd(trend[2])}.`}
              />
            </div>
          )}

          {siblings.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Other categories in {teamName(team.id)}</span>
              <ul className="mt-2 flex min-w-0 flex-col gap-2.5">
                {siblings.map((s) => (
                  <li key={s.category} className="min-w-0">
                    <div className="flex min-w-0 items-baseline justify-between gap-2">
                      <span className="min-w-0 truncate text-sm font-normal text-zinc-300">{CATEGORY_LABEL[s.category]}</span>
                      <span className="shrink-0 whitespace-nowrap text-sm font-normal tabular-nums text-zinc-400">{usd(s.cost)}</span>
                    </div>
                    <div className="mt-1">
                      <Progress value={(s.cost / tTotal) * 100} label={`${CATEGORY_LABEL[s.category]} is ${pctFmt((s.cost / tTotal) * 100)} of ${teamName(team.id)}'s spend`} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => onJumpToTable(selection.teamId, selection.category)}
            className={`${FOCUS} mt-5 flex h-10 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-zinc-300 hover:text-zinc-50`}
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            View this row in the table
          </button>
        </div>
      </motion.div>
    </div>
  );
}
