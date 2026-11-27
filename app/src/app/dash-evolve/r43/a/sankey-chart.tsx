"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ChannelTotals } from "./data";
import { formatNumber, formatPercent } from "./format";

type NodeId =
  | "signups"
  | "activated"
  | "not-activated"
  | "paid"
  | "trialing"
  | "churned"
  | "expanding"
  | "stable"
  | "contracting";

type Tone = "blue" | "zinc" | "amber" | "rose" | "emerald";

const TONE_VAR: Record<Tone, string> = {
  blue: "var(--color-blue-600)",
  zinc: "var(--color-zinc-400)",
  amber: "var(--color-amber-500)",
  rose: "var(--color-rose-500)",
  emerald: "var(--color-emerald-500)",
};

const TONE_DOT: Record<Tone, string> = {
  blue: "bg-blue-600",
  zinc: "bg-zinc-400",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
};

interface NodeDef {
  id: NodeId;
  label: string;
  col: number;
  tone: Tone;
  getValue: (t: ChannelTotals) => number;
}

// Column order here is the visual top-to-bottom stacking order within each column — the layout
// below derives every slice offset from this single list, so there is nowhere else an order could
// drift out of sync with what is actually drawn.
const NODE_DEFS: NodeDef[] = [
  { id: "signups", label: "New Signups", col: 0, tone: "blue", getValue: (t) => t.signups },
  { id: "activated", label: "Activated", col: 1, tone: "blue", getValue: (t) => t.activated },
  { id: "not-activated", label: "Not Activated", col: 1, tone: "zinc", getValue: (t) => t.notActivated },
  { id: "paid", label: "Converted to Paid", col: 2, tone: "blue", getValue: (t) => t.paidConverted },
  { id: "trialing", label: "Still Trialing", col: 2, tone: "amber", getValue: (t) => t.trialing },
  { id: "churned", label: "Churned", col: 2, tone: "rose", getValue: (t) => t.churned },
  { id: "expanding", label: "Expanding Revenue", col: 3, tone: "emerald", getValue: (t) => t.expanding },
  { id: "stable", label: "Stable Revenue", col: 3, tone: "blue", getValue: (t) => t.stable },
  { id: "contracting", label: "Contracting Revenue", col: 3, tone: "amber", getValue: (t) => t.contracting },
];

interface LinkDef {
  id: string;
  source: NodeId;
  target: NodeId;
  getValue: (t: ChannelTotals) => number;
}

// A link's color always matches its TARGET node's tone — the color answers "where is this flow
// headed", which stays legible even once several links converge into one node (e.g. both
// "Activated" and "Not Activated" feed "Churned", and both links render rose).
const LINK_DEFS: LinkDef[] = [
  { id: "signups-activated", source: "signups", target: "activated", getValue: (t) => t.activated },
  { id: "signups-not-activated", source: "signups", target: "not-activated", getValue: (t) => t.notActivated },
  { id: "activated-paid", source: "activated", target: "paid", getValue: (t) => t.paidConverted },
  { id: "activated-trialing", source: "activated", target: "trialing", getValue: (t) => t.trialing },
  { id: "activated-churned", source: "activated", target: "churned", getValue: (t) => t.churnedInTrial },
  { id: "not-activated-churned", source: "not-activated", target: "churned", getValue: (t) => t.notActivated },
  { id: "paid-expanding", source: "paid", target: "expanding", getValue: (t) => t.expanding },
  { id: "paid-stable", source: "paid", target: "stable", getValue: (t) => t.stable },
  { id: "paid-contracting", source: "paid", target: "contracting", getValue: (t) => t.contracting },
];

const COLUMN_HEADERS = ["Signups", "Activation", "Trial outcome", "Revenue motion"];

const VIEW_W = 960;
const VIEW_H = 400;
const NODE_W = 16;
const PAD_Y = 8;
const GAP_Y = 10;
const COL_X = [16, 320, 624, 928];

const round2 = (n: number) => Math.round(n * 100) / 100;

function computeLayout(totals: ChannelTotals) {
  // Every column's nodes sum to a value <= totals.signups, but a column with more nodes spends
  // more of its vertical space on the gaps between them. Reserving the worst case's gap budget
  // up front keeps every column inside the plot area, including the one with the most nodes.
  const maxGapsInAnyColumn = Math.max(
    ...[0, 1, 2, 3].map((col) => NODE_DEFS.filter((n) => n.col === col).length - 1)
  );
  const plotHeight = VIEW_H - PAD_Y * 2;
  const scale = (plotHeight - maxGapsInAnyColumn * GAP_Y) / totals.signups;

  const nodeRect = new Map<NodeId, { x: number; y0: number; y1: number; value: number }>();
  for (const col of [0, 1, 2, 3]) {
    let cursor = PAD_Y;
    const colNodes = NODE_DEFS.filter((n) => n.col === col);
    for (const node of colNodes) {
      const value = node.getValue(totals);
      const h = value * scale;
      const y0 = cursor;
      const y1 = y0 + h;
      nodeRect.set(node.id, { x: COL_X[col], y0: round2(y0), y1: round2(y1), value });
      cursor = y1 + GAP_Y;
    }
  }

  // Slice offsets: a node's outgoing links consume vertical slices of its own rect, top to
  // bottom, in `LINK_DEFS` order; a node's incoming links consume slices the same way. Because
  // every channel row reconciles (sum of a node's inbound links === sum of its outbound links),
  // these slices always tile the node's full height with no gap and no overlap.
  const outCursor = new Map<NodeId, number>();
  const inCursor = new Map<NodeId, number>();
  for (const node of NODE_DEFS) {
    const rect = nodeRect.get(node.id);
    if (rect) {
      outCursor.set(node.id, rect.y0);
      inCursor.set(node.id, rect.y0);
    }
  }

  const links = LINK_DEFS.map((link) => {
    const value = link.getValue(totals);
    const h = value * scale;
    const sourceRect = nodeRect.get(link.source);
    const targetRect = nodeRect.get(link.target);
    if (!sourceRect || !targetRect) return null;

    const sy0 = outCursor.get(link.source) ?? sourceRect.y0;
    const sy1 = sy0 + h;
    outCursor.set(link.source, sy1);

    const ty0 = inCursor.get(link.target) ?? targetRect.y0;
    const ty1 = ty0 + h;
    inCursor.set(link.target, ty1);

    const sx = round2(sourceRect.x + NODE_W);
    const tx = round2(targetRect.x);
    const midX = round2((sx + tx) / 2);
    const [rsy0, rsy1, rty0, rty1] = [round2(sy0), round2(sy1), round2(ty0), round2(ty1)];

    const tone = NODE_DEFS.find((n) => n.id === link.target)?.tone ?? "blue";
    const d = `M${sx},${rsy0} C${midX},${rsy0} ${midX},${rty0} ${tx},${rty0} L${tx},${rty1} C${midX},${rty1} ${midX},${rsy1} ${sx},${rsy1} Z`;

    return { id: link.id, d, source: link.source, target: link.target, tone, value };
  }).filter((l): l is NonNullable<typeof l> => l !== null);

  return { nodeRect, links };
}

export function SankeyChart({ totals }: { totals: ChannelTotals }) {
  const [highlighted, setHighlighted] = useState<NodeId | null>(null);
  const captionId = useId();

  const { nodeRect, links } = useMemo(() => computeLayout(totals), [totals]);

  const connectedLinkIds = useMemo(() => {
    if (!highlighted) return null;
    return new Set(links.filter((l) => l.source === highlighted || l.target === highlighted).map((l) => l.id));
  }, [links, highlighted]);

  const connectedNodeIds = useMemo(() => {
    if (!highlighted) return null;
    const set = new Set<NodeId>([highlighted]);
    for (const l of links) {
      if (l.source === highlighted) set.add(l.target);
      if (l.target === highlighted) set.add(l.source);
    }
    return set;
  }, [links, highlighted]);

  const highlightedNode = highlighted ? NODE_DEFS.find((n) => n.id === highlighted) ?? null : null;
  const highlightedRect = highlighted ? nodeRect.get(highlighted) ?? null : null;
  const caption =
    highlightedNode && highlightedRect
      ? `${highlightedNode.label}: ${formatNumber(Math.round(highlightedRect.value))} accounts, ${formatPercent(
          (highlightedRect.value / totals.signups) * 100
        )} of all signups this period.`
      : "Hover or focus any stage below to trace its connected flows.";

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="Sankey diagram of the customer lifecycle flow, from signup to activation, trial outcome, and revenue motion. Exact figures are listed below the diagram."
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {links.map((link) => {
          const dimmed = connectedLinkIds ? !connectedLinkIds.has(link.id) : false;
          return (
            <path
              key={link.id}
              d={link.d}
              fill={TONE_VAR[link.tone]}
              fillOpacity={dimmed ? 0.08 : 0.32}
              className="motion-safe:transition-[fill-opacity] motion-safe:duration-150"
            />
          );
        })}
        {NODE_DEFS.map((node) => {
          const rect = nodeRect.get(node.id);
          if (!rect) return null;
          const dimmed = connectedNodeIds ? !connectedNodeIds.has(node.id) : false;
          return (
            <rect
              key={node.id}
              x={rect.x}
              y={rect.y0}
              width={NODE_W}
              height={Math.max(round2(rect.y1 - rect.y0), 1)}
              rx={3}
              fill={TONE_VAR[node.tone]}
              fillOpacity={dimmed ? 0.3 : 1}
              className="motion-safe:transition-[fill-opacity] motion-safe:duration-150"
            />
          );
        })}
      </svg>

      <p id={captionId} className="mt-2 min-h-[1.25rem] font-normal text-xs text-zinc-600" aria-live="polite">
        {caption}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">{COLUMN_HEADERS[col]}</p>
              {col < 3 ? <ArrowRight className="hidden h-3 w-3 shrink-0 text-zinc-400 sm:block" aria-hidden="true" /> : null}
            </div>
            <ul className="mt-1.5 space-y-1">
              {NODE_DEFS.filter((n) => n.col === col).map((node) => {
                const rect = nodeRect.get(node.id);
                const value = rect ? Math.round(rect.value) : 0;
                const pct = (value / totals.signups) * 100;
                return (
                  <li key={node.id}>
                    <button
                      type="button"
                      aria-describedby={captionId}
                      onMouseEnter={() => setHighlighted(node.id)}
                      onMouseLeave={() => setHighlighted((cur) => (cur === node.id ? null : cur))}
                      onFocus={() => setHighlighted(node.id)}
                      onBlur={() => setHighlighted((cur) => (cur === node.id ? null : cur))}
                      className={`flex w-full min-w-0 items-center gap-1.5 rounded-lg px-1.5 py-1 text-left motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                        highlighted === node.id ? "bg-blue-50" : "hover:bg-zinc-50"
                      }`}
                    >
                      <span className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[node.tone]}`} aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-900">{node.label}</span>
                      <span className="shrink-0 text-right">
                        <span className="block font-medium text-sm tabular-nums text-zinc-900">{formatNumber(value)}</span>
                        <span className="block font-normal text-[11px] tabular-nums text-zinc-500">{formatPercent(pct)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
