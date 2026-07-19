"use client";

import { ArrowUp, Briefcase, ChevronRight, UserPlus2, Users, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ancestorsOf, formatCount, NODE_MAP, STATUS_META, utilizationTrend, type OrgNode } from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, NUM, SURFACE_INSET, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel, Sparkline, StatusBadge } from "./ui";

const KIND_LABEL: Record<string, string> = { company: "회사", division: "부문", team: "팀" };

function StatCell({ Icon, label, value }: { Icon: typeof Briefcase; label: string; value: string }) {
  return (
    <div className={cx("rounded-xl border p-3", BORDER, SURFACE_INSET)}>
      <div className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>
        <Icon size={13} aria-hidden="true" />
        {label}
      </div>
      <p className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}

export default function DetailDrawer({
  node,
  open,
  onClose,
  onSelect,
}: {
  node: OrgNode | null;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!node) return null;

  const status = STATUS_META[node.status];
  const trend = utilizationTrend(node);
  const prior = trend[trend.length - 2] ?? node.utilization;
  const delta = node.utilization - prior;
  const trail = ancestorsOf(node.id);
  const children = node.childIds.map((id) => NODE_MAP[id]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cx(
          "fixed inset-0 z-40 bg-zinc-900/30 motion-safe:transition-opacity motion-reduce:transition-none",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-drawer-heading"
        className={cx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l shadow-xl",
          BORDER,
          "bg-white dark:bg-zinc-950",
          "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className={cx("flex items-start gap-3 border-b p-4", BORDER)}>
          <div className="min-w-0 flex-1">
            {trail.length ? (
              <nav aria-label="조직 경로" className="mb-1.5 flex flex-wrap items-center gap-1 text-[11px]">
                {trail.map((a) => (
                  <span key={a.id} className="inline-flex items-center gap-1">
                    <button type="button" onClick={() => onSelect(a.id)} className={cx("rounded px-0.5 font-medium hover:underline", TEXT_CAPTION, FOCUS_RING)}>
                      {a.name}
                    </button>
                    <ChevronRight size={11} aria-hidden="true" className={TEXT_CAPTION} />
                  </span>
                ))}
              </nav>
            ) : null}
            <EyebrowLabel>{KIND_LABEL[node.kind]}</EyebrowLabel>
            <h2 id="detail-drawer-heading" className={cx("mt-0.5 truncate text-base font-semibold tracking-tight", TEXT_PRIMARY)}>
              {node.name}
            </h2>
            <p className={cx("mt-0.5 truncate text-xs", TEXT_CAPTION)}>
              {node.leadName} · {node.leadTitle}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="상세 패널 닫기"
            className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-lg", TEXT_CAPTION, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:thin]">
          <div className="flex items-center gap-2">
            <StatusBadge status={node.status} />
          </div>

          <div className={cx("mt-3 rounded-xl border p-3.5", BORDER, SURFACE_INSET)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <EyebrowLabel>가동률 추이</EyebrowLabel>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={cx("text-3xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{node.utilization}</span>
                  <span className={cx("text-xs font-normal", TEXT_CAPTION)}>%</span>
                  <span
                    className={cx(
                      "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] font-semibold",
                      status.text,
                      status.bg,
                      status.border,
                      NUM,
                    )}
                  >
                    <ArrowUp size={10} aria-hidden="true" className={delta >= 0 ? "" : "rotate-180"} />
                    {delta >= 0 ? "+" : ""}
                    {delta}
                  </span>
                </div>
              </div>
              <div className="h-11 w-28 shrink-0">
                <Sparkline values={trend} stroke={status.stroke} fill={status.fill} />
              </div>
            </div>
            <p className={cx("mt-2 text-[11px]", TEXT_CAPTION)}>최근 5개 구간 대비 · 직전 대비 {delta >= 0 ? `+${delta}` : delta}%p</p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <StatCell Icon={Users} label="헤드카운트" value={`${formatCount(node.headcount)}명`} />
            <StatCell Icon={UserPlus2} label="채용 요청" value={`${node.openReqs}건`} />
            <StatCell Icon={Briefcase} label="직속 하위 팀" value={children.length ? `${children.length}개` : "없음"} />
            <StatCell Icon={Users} label="리드" value={node.leadName} />
          </div>

          {children.length ? (
            <div className="mt-4">
              <EyebrowLabel>하위 팀</EyebrowLabel>
              <ul className={cx("mt-1.5 divide-y rounded-xl border", BORDER, "divide-zinc-200 dark:divide-zinc-800")}>
                {children.map((c) => {
                  const cStatus = STATUS_META[c.status];
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(c.id)}
                        className={cx("flex w-full items-center gap-2.5 px-3 py-2.5 text-left", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                      >
                        <span aria-hidden="true" className={cx("h-2 w-2 shrink-0 rounded-full", cStatus.dot)} />
                        <span className="min-w-0 flex-1">
                          <span className={cx("block truncate text-xs font-medium", TEXT_PRIMARY)}>{c.name}</span>
                          <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>{c.leadName}</span>
                        </span>
                        <span className={cx("shrink-0 text-xs font-semibold", NUM, TEXT_SECONDARY)}>{formatCount(c.headcount)}명</span>
                        <ChevronRight size={14} aria-hidden="true" className={TEXT_CAPTION} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
