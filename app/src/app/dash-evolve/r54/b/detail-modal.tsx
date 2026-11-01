"use client";

import { Bookmark, BookmarkCheck, Check, ShieldAlert, ShieldCheck, Timer, TriangleAlert, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { Deployment, RiskLevel, StageId } from "./data";
import { STAGES } from "./data";
import { BORDER, FOCUS_RING, NUM, PANEL_BG, RISK_LABEL, RISK_TONE, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, MoveMenu, Pill } from "./ui";

const RISK_ICON: Record<RiskLevel, typeof ShieldCheck> = {
  low: ShieldCheck,
  medium: TriangleAlert,
  high: ShieldAlert,
};

export default function DetailModal({
  deployment,
  onClose,
  onMove,
  watched,
  onToggleWatch,
  onToggleChecklistItem,
}: {
  deployment: Deployment;
  onClose: () => void;
  onMove: (id: string, stage: StageId) => void;
  watched: boolean;
  onToggleWatch: (id: string) => void;
  onToggleChecklistItem: (id: string, index: number) => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const tone = RISK_TONE[deployment.riskLevel];
  const RiskIcon = RISK_ICON[deployment.riskLevel];
  const stageLabel = STAGES.find((s) => s.id === deployment.stage)?.label ?? deployment.stage;
  const doneCount = deployment.checklist.filter((c) => c.done).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 sm:items-center" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-xl overflow-hidden rounded-2xl border shadow-xl shadow-black/50", BORDER, PANEL_BG)}
      >
        <div className={cx("flex items-start justify-between gap-3 border-b px-5 py-4", BORDER)}>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 id={titleId} className={cx("min-w-0 truncate text-base font-semibold tracking-tight", TEXT_PRIMARY)}>
                {deployment.modelName}
              </h2>
              <span className={cx("shrink-0 text-xs", TEXT_CAPTION)}>{deployment.version}</span>
            </div>
            <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
              {deployment.team} &middot; Stage: <span className="font-medium text-zinc-50">{stageLabel}</span>
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close deployment details"
            className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg", TEXT_CAPTION, "hover:bg-white/5", TRANSITION, FOCUS_RING)}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={tone} Icon={RiskIcon}>
              {RISK_LABEL[deployment.riskLevel]}
            </Pill>
            {deployment.tags.map((tag) => (
              <span key={tag} className={cx("rounded-md border px-1.5 py-0.5 text-[11px] font-medium", BORDER, "bg-white/5", TEXT_CAPTION)}>
                {tag}
              </span>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className={cx("text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>Owner</dt>
              <dd className="mt-1 flex items-center gap-1.5">
                <Avatar initials={deployment.owner.initials} name={deployment.owner.name} size={20} />
                <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{deployment.owner.name}</span>
              </dd>
            </div>
            <div>
              <dt className={cx("text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>Environment</dt>
              <dd className={cx("mt-1 text-sm font-semibold", TEXT_PRIMARY)}>{deployment.environment}</dd>
            </div>
            <div>
              <dt className={cx("text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>p99 latency</dt>
              <dd className={cx("mt-1 flex items-center gap-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>
                <Timer size={13} aria-hidden="true" className={TEXT_CAPTION} />
                {deployment.latencyP99Ms}ms
              </dd>
            </div>
            <div>
              <dt className={cx("text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>Requested</dt>
              <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{deployment.requestedOn}</dd>
            </div>
          </dl>

          <div>
            <h3 className={cx("text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>
              Approval checklist &middot; <span className={cx(NUM, "font-semibold text-zinc-50")}>{doneCount}/{deployment.checklist.length}</span> complete
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {deployment.checklist.map((item, idx) => (
                <li key={item.label}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.done}
                    onClick={() => onToggleChecklistItem(deployment.id, idx)}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm",
                      BORDER,
                      "hover:bg-white/5",
                      TRANSITION,
                      FOCUS_RING,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border",
                        item.done ? "border-cyan-400 bg-cyan-400/20" : cx(BORDER, "bg-transparent"),
                      )}
                    >
                      {item.done ? <Check size={11} className="text-cyan-300" /> : null}
                    </span>
                    <span className={cx(item.done ? TEXT_PRIMARY : TEXT_CAPTION, "font-medium")}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cx("flex items-center justify-between gap-3 border-t px-5 py-4", BORDER)}>
          <MoveMenu deployment={deployment} onMove={onMove} align="left" />
          <button
            type="button"
            aria-pressed={watched}
            onClick={() => onToggleWatch(deployment.id)}
            className={cx(
              "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium",
              BORDER,
              watched ? "text-cyan-300" : TEXT_CAPTION,
              "hover:bg-white/5",
              TRANSITION,
              FOCUS_RING,
            )}
          >
            {watched ? <BookmarkCheck size={14} aria-hidden="true" /> : <Bookmark size={14} aria-hidden="true" />}
            {watched ? "Watching" : "Watch this deployment"}
          </button>
        </div>
      </div>
    </div>
  );
}
