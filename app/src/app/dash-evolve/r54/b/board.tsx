"use client";

import {
  Bookmark,
  BookmarkCheck,
  CircleCheckBig,
  Inbox,
  ListChecks,
  Rocket,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Timer,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { STAGES, type Deployment, type RiskLevel, type StageId } from "./data";
import { BORDER, FOCUS_RING, NUM, PANEL_BG, RISK_TONE, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, MoveMenu, Pill } from "./ui";

const STAGE_ICON: Record<StageId, LucideIcon> = {
  requested: Inbox,
  review: SearchCheck,
  approved: CircleCheckBig,
  canary: Rocket,
  live: ShieldCheck,
};

const RISK_ICON: Record<RiskLevel, LucideIcon> = {
  low: ShieldCheck,
  medium: TriangleAlert,
  high: ShieldAlert,
};

const RISK_SHORT: Record<RiskLevel, string> = { low: "Low", medium: "Med", high: "High" };

export default function Board({
  deployments,
  onMove,
  onOpenCard,
  watchedIds,
  onToggleWatch,
}: {
  deployments: Deployment[];
  onMove: (id: string, stage: StageId) => void;
  onOpenCard: (id: string, trigger: HTMLElement) => void;
  watchedIds: Set<string>;
  onToggleWatch: (id: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start">
      {STAGES.map((stage) => {
        const cards = deployments.filter((d) => d.stage === stage.id);
        const Icon = STAGE_ICON[stage.id];
        return (
          <section
            key={stage.id}
            aria-labelledby={`col-${stage.id}`}
            className={cx("flex min-w-0 w-full flex-col rounded-2xl border lg:min-w-[180px] lg:max-w-[360px] lg:flex-1", BORDER, PANEL_BG)}
          >
            <div className={cx("flex items-center gap-2 border-b px-3.5 py-3", BORDER)}>
              <Icon size={14} aria-hidden="true" className="shrink-0 text-cyan-400" />
              <h2 id={`col-${stage.id}`} className={cx("min-w-0 flex-1 truncate text-sm font-semibold", TEXT_PRIMARY)}>
                {stage.label}
              </h2>
              <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold", NUM, "bg-white/5 text-zinc-50")}>{cards.length}</span>
            </div>
            <p className={cx("px-3.5 pb-2 pt-2 text-[11px]", TEXT_CAPTION)}>{stage.description}</p>

            <ul className="flex min-h-[80px] flex-col gap-2.5 overflow-y-auto px-2.5 pb-3 [scrollbar-width:thin]" style={{ maxHeight: "560px" }}>
              {cards.length === 0 ? (
                <li className={cx("rounded-xl border border-dashed px-3 py-6 text-center text-xs", BORDER, TEXT_CAPTION)}>No deployments match the current filters.</li>
              ) : (
                cards.map((d) => {
                  const doneCount = d.checklist.filter((c) => c.done).length;
                  const tone = RISK_TONE[d.riskLevel];
                  const RiskIcon = RISK_ICON[d.riskLevel];
                  const watched = watchedIds.has(d.id);
                  return (
                    <li key={d.id} className={cx("rounded-xl border p-2.5", BORDER, "bg-zinc-950/40")}>
                      <button
                        type="button"
                        onClick={(e) => onOpenCard(d.id, e.currentTarget)}
                        className={cx("-m-1 flex w-full flex-col gap-2 rounded-lg p-1 text-left", FOCUS_RING, TRANSITION, "hover:bg-white/5")}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cx("min-w-0 truncate text-[13px] font-medium", TEXT_PRIMARY)}>{d.modelName}</h3>
                          <Pill tone={tone} Icon={RiskIcon}>
                            {RISK_SHORT[d.riskLevel]}
                          </Pill>
                        </div>
                        <p className={cx("truncate text-xs", TEXT_CAPTION)}>
                          {d.version} &middot; {d.team}
                        </p>
                        <div className="flex flex-wrap items-center gap-1">
                          {d.tags.map((tag) => (
                            <span key={tag} className={cx("rounded-md border px-1.5 py-0.5 text-[10px] font-medium", BORDER, "bg-white/5", TEXT_CAPTION)}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className={cx("flex items-center gap-3 text-[11px]", TEXT_CAPTION)}>
                          <span className="flex items-center gap-1">
                            <ListChecks size={12} aria-hidden="true" />
                            <span className={NUM}>
                              {doneCount}/{d.checklist.length}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer size={12} aria-hidden="true" />
                            <span className={NUM}>p99 {d.latencyP99Ms}ms</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span className={cx("flex min-w-0 items-center gap-1.5 text-[11px]", TEXT_CAPTION)}>
                            <Avatar initials={d.owner.initials} name={d.owner.name} size={18} />
                            <span className="truncate">{d.owner.name}</span>
                          </span>
                          <span className={cx("shrink-0 text-[11px]", TEXT_CAPTION)}>{d.requestedOn}</span>
                        </div>
                      </button>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <MoveMenu deployment={d} onMove={onMove} />
                        <button
                          type="button"
                          aria-pressed={watched}
                          onClick={() => onToggleWatch(d.id)}
                          className={cx(
                            "flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-medium",
                            BORDER,
                            watched ? "text-cyan-300" : TEXT_CAPTION,
                            "hover:bg-white/5",
                            TRANSITION,
                            FOCUS_RING,
                          )}
                        >
                          {watched ? <BookmarkCheck size={12} aria-hidden="true" /> : <Bookmark size={12} aria-hidden="true" />}
                          <span className="sr-only relative">{watched ? `Stop watching ${d.modelName}` : `Watch ${d.modelName}`}</span>
                          {watched ? "Watching" : "Watch"}
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
