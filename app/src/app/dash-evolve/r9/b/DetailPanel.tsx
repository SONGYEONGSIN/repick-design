"use client";

import { ArrowDownRight, ArrowUpRight, Boxes, Radio, X } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  formatMs,
  formatPercent,
  formatVolume,
  LATENCY_META,
  LAYER_META,
  NODE_MAP,
  RELIABILITY_META,
  requestVolumeTrend,
  type ServiceNode,
} from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, NUM, SURFACE_INSET, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel, Sparkline, StatusBadge } from "./ui";

function StatCell({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className={cx("rounded-xl border p-3", BORDER, SURFACE_INSET)}>
      <p className={cx("text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>{label}</p>
      <p className={cx("mt-1 text-sm font-semibold", NUM, valueClass ?? TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}

function NeighborList({
  title,
  Icon,
  ids,
  onSelect,
}: {
  title: string;
  Icon: typeof ArrowUpRight;
  ids: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className={cx("flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>
        <Icon size={13} aria-hidden="true" />
        {title} ({ids.length})
      </div>
      {ids.length === 0 ? (
        <p className={cx("mt-1.5 text-xs", TEXT_CAPTION)}>없음</p>
      ) : (
        <ul className={cx("mt-1.5 divide-y rounded-xl border", BORDER, "divide-zinc-200 dark:divide-zinc-800")}>
          {ids.map((id) => {
            const n = NODE_MAP[id];
            if (!n) return null;
            const status = RELIABILITY_META[n.reliability];
            return (
              <li key={id}>
                <button type="button" onClick={() => onSelect(id)} className={cx("flex w-full items-center gap-2.5 px-3 py-2.5 text-left", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
                  <span aria-hidden="true" className={cx("h-2 w-2 shrink-0 rounded-full", status.dot)} />
                  <span className="min-w-0 flex-1">
                    <span className={cx("block truncate text-xs font-medium", TEXT_PRIMARY)}>{n.name}</span>
                    <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>{n.owner}</span>
                  </span>
                  <span className={cx("shrink-0 text-xs font-semibold", NUM, TEXT_SECONDARY)}>{formatVolume(n.requestVolume)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function DetailPanel({
  node,
  open,
  onClose,
  onSelect,
}: {
  node: ServiceNode | null;
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

  const reliability = RELIABILITY_META[node.reliability];
  const latency = LATENCY_META[node.latency];
  const trend = requestVolumeTrend(node);
  const prior = trend[trend.length - 2] ?? node.requestVolume;
  const delta = node.requestVolume - prior;
  const deltaPct = prior > 0 ? Math.round((delta / prior) * 1000) / 10 : 0;
  const LayerIcon = LAYER_META[node.layer].Icon;

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
        aria-labelledby="detail-panel-heading"
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
            <div className={cx("mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>
              <LayerIcon size={12} aria-hidden="true" />
              {LAYER_META[node.layer].label}
            </div>
            <h2 id="detail-panel-heading" className={cx("truncate text-base font-semibold tracking-tight", NUM, TEXT_PRIMARY)}>
              {node.name}
            </h2>
            <p className={cx("mt-0.5 truncate text-xs", TEXT_CAPTION)}>
              {node.owner} · {node.version}
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
          <p className={cx("text-sm leading-relaxed", TEXT_SECONDARY)}>{node.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge meta={reliability} />
            <StatusBadge meta={latency} />
          </div>

          <div className={cx("mt-3 rounded-xl border p-3.5", BORDER, SURFACE_INSET)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <EyebrowLabel>요청량 추이</EyebrowLabel>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={cx("text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{formatVolume(node.requestVolume)}</span>
                  <span
                    className={cx(
                      "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] font-semibold",
                      delta >= 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/12 dark:text-emerald-300" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/12 dark:text-rose-300",
                      NUM,
                    )}
                  >
                    {delta >= 0 ? <ArrowUpRight size={10} aria-hidden="true" /> : <ArrowDownRight size={10} aria-hidden="true" />}
                    {deltaPct >= 0 ? "+" : ""}
                    {deltaPct}%
                  </span>
                </div>
              </div>
              <div className="h-11 w-28 shrink-0">
                <Sparkline values={trend} stroke={reliability.stroke} fill={reliability.fill} />
              </div>
            </div>
            <p className={cx("mt-2 text-[11px]", TEXT_CAPTION)}>최근 5개 구간 대비 · 직전 구간 대비 {deltaPct >= 0 ? `+${deltaPct}` : deltaPct}%</p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <StatCell label="오류율" value={formatPercent(node.errorRate)} valueClass={reliability.text} />
            <StatCell label="P99 지연" value={formatMs(node.p99)} valueClass={latency.text} />
            <StatCell label="가동률" value={`${node.uptime}%`} />
            <StatCell label="버전" value={node.version} />
          </div>

          <NeighborList title="상류 (호출하는 서비스)" Icon={ArrowUpRight} ids={node.upstreamIds} onSelect={onSelect} />
          <NeighborList title="하류 (호출 대상)" Icon={ArrowDownRight} ids={node.downstreamIds} onSelect={onSelect} />

          <div className={cx("mt-4 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px]", BORDER, TEXT_CAPTION)}>
            <Radio size={12} aria-hidden="true" />
            <span>실선 = 동기 HTTP 호출 · 점선 = 비동기 이벤트(메시지 버스)</span>
          </div>
          <div className={cx("mt-2 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px]", BORDER, TEXT_CAPTION)}>
            <Boxes size={12} aria-hidden="true" />
            <span>{LAYER_META[node.layer].label} 계층 · Bramwell Commerce 워크스페이스</span>
          </div>
        </div>
      </div>
    </>
  );
}
