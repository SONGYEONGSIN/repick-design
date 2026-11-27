"use client";

import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import type { RefObject } from "react";
import { EDGES, NODE_BY_ID, RELATIONSHIP_LABEL, TIER_LABEL, type PositionedNode, type ServiceEdge } from "./data";
import { BORDER, CODE, FOCUS, NUM, PANEL_BG, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge } from "./ui";

/**
 * The non-persistent, dismissible inspector the brief asks for: a fixed-position popover (not a
 * sidebar), positioned from the trigger's own `getBoundingClientRect()` so it works identically
 * whether the trigger was a table row's "View" button (far down the page) or a graph node's
 * pointer-only mark (inside the hero). It closes on Escape, on an outside pointerdown, or on the
 * explicit X button, and the client component returns focus to whatever triggered it — see
 * fluxgraph-client.tsx's closeInspector. Nothing else on the page reads this popover's open
 * state: the incident timeline below stays on its own independent data, by design.
 */
export default function NodeInspector({
  node,
  left,
  top,
  onClose,
  closeBtnRef,
  dialogRef,
}: {
  node: PositionedNode;
  left: number;
  top: number;
  onClose: () => void;
  closeBtnRef: RefObject<HTMLButtonElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;
}) {
  const outbound = EDGES.filter((e) => e.source === node.id);
  const inbound = EDGES.filter((e) => e.target === node.id);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label={`${node.name} details`}
      className={cx("fixed z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border p-4 shadow-2xl shadow-black/50", BORDER, PANEL_BG)}
      style={{
        left: `clamp(8px, ${left}px, calc(100vw - 8px))`,
        top: `clamp(8px, ${top}px, calc(100vh - 8px))`,
        transform: "translate(-50%, 0)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{node.name}</p>
          <p className={cx("mt-0.5 truncate", CODE, TEXT_AUX)} title={node.hostname}>
            {node.hostname}
          </p>
        </div>
        <button type="button" ref={closeBtnRef} onClick={onClose} className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-zinc-50", FOCUS, TRANSITION)}>
          <X size={15} aria-hidden="true" />
          <span className="sr-only">Close details for {node.name}</span>
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge className={STATUS_BADGE[node.status]}>{STATUS_LABEL[node.status]}</Badge>
        <Badge>{TIER_LABEL[node.tier]} tier</Badge>
        <Badge>{node.team}</Badge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
        <Metric label="p50 latency" value={`${node.selfLatencyMs}ms`} />
        <Metric label="p99 latency" value={`${node.p99LatencyMs}ms`} />
        <Metric label="Uptime" value={`${node.uptimePct}%`} />
        <Metric label="Traffic" value={`${node.trafficRpm.toLocaleString("en-US")} rpm`} />
      </dl>

      <div className="mt-3 border-t border-white/10 pt-3">
        <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Dependencies</p>
        <ul className="mt-2 flex max-h-40 flex-col gap-1.5 overflow-y-auto [scrollbar-width:thin]">
          {outbound.map((e) => (
            <DepRow key={e.id} edge={e} direction="out" otherId={e.target} />
          ))}
          {inbound.map((e) => (
            <DepRow key={e.id} edge={e} direction="in" otherId={e.source} />
          ))}
          {outbound.length === 0 && inbound.length === 0 ? <li className={cx("text-xs font-normal", TEXT_AUX)}>No direct dependencies.</li> : null}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{label}</dt>
      <dd className={cx("text-base font-semibold", NUM, TEXT_PRIMARY)}>{value}</dd>
    </div>
  );
}

function DepRow({ edge, direction, otherId }: { edge: ServiceEdge; direction: "in" | "out"; otherId: string }) {
  const other = NODE_BY_ID.get(otherId);
  const Icon = direction === "out" ? ArrowUpRight : ArrowDownRight;
  return (
    <li className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5 text-xs">
      <Icon size={13} aria-hidden="true" className={direction === "out" ? "text-amber-400" : "text-sky-400"} />
      <span className={cx("min-w-0 flex-1 truncate font-medium", TEXT_PRIMARY)}>{other?.name ?? otherId}</span>
      <span className={cx("shrink-0", TEXT_AUX)}>{RELATIONSHIP_LABEL[edge.relationship]}</span>
      <span className={cx("shrink-0", NUM, TEXT_AUX)}>{edge.latencyMs}ms</span>
    </li>
  );
}
