"use client";

import { useState } from "react";
import { PinOff, ShieldAlert } from "lucide-react";
import {
  buildEgoNetwork, getNode, EVENT_TYPE_META,
  type SecurityEvent, type EdgeKind, type Severity,
} from "./data";
import { Card, SectionLabel, AccountGlyph, ServiceGlyph, NODE_KIND_LABEL, FOCUS_RING, FOCUS_RING_FULL } from "./ui";

const EDGE_KIND_LABEL: Record<EdgeKind | "flagged", string> = {
  admin: "Admin access",
  access: "Routine access",
  peer: "Peer relationship",
  escalation: "Escalation target",
  flagged: "Flagged in this event",
};

const SEVERITY_STROKE: Record<Severity, string> = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#d97706",
  low: "#71717a",
};

const CX = 160;
const CY = 122;
const RADIUS = 84;

export function NetworkGraphCard({
  focusEvent, pinned, onClearPin, headingId,
}: { focusEvent: SecurityEvent; pinned: boolean; onClearPin: () => void; headingId: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const ego = buildEgoNetwork(focusEvent);
  const focal = getNode(ego.focalId);
  const neighbors = ego.neighborIds.map((id) => getNode(id));
  const n = Math.max(neighbors.length, 1);

  const positions = neighbors.map((_, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const x = Math.round((CX + RADIUS * Math.cos(angle)) * 100) / 100;
    const y = Math.round((CY + RADIUS * Math.sin(angle)) * 100) / 100;
    return { x, y };
  });

  function relationshipFor(id: string): { kind: EdgeKind | "flagged"; since: string } {
    const known = ego.knownEdges.find((k) => k.otherId === id);
    if (known) return { kind: known.edge.kind, since: known.edge.since };
    return { kind: "flagged", since: "First seen in this event" };
  }

  const hovered = hoveredId ? { node: getNode(hoveredId), rel: relationshipFor(hoveredId) } : null;
  const severityColor = SEVERITY_STROKE[focusEvent.severity];

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <SectionLabel as="h2">
          <span id={headingId}>Access Graph</span>
        </SectionLabel>
        {pinned ? (
          <button
            type="button"
            onClick={onClearPin}
            className={`flex h-8 items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 ${FOCUS_RING_FULL}`}
          >
            <PinOff aria-hidden="true" className="h-3.5 w-3.5" />
            Clear pin
          </button>
        ) : (
          <span className="flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 text-[11px] font-medium text-zinc-500">
            Auto-focus
          </span>
        )}
      </div>

      <p className="mt-1 text-sm font-bold text-zinc-900">{focal.name}</p>
      <p className="text-xs font-normal text-zinc-500">
        {pinned ? "Pinned from the feed" : "Most recent critical event"} — {EVENT_TYPE_META[focusEvent.type].label}
      </p>

      <svg
        viewBox="0 0 320 244"
        aria-hidden="true"
        focusable="false"
        className="mx-auto mt-3 aspect-[320/244] w-full max-w-[280px]"
      >
        {neighbors.map((node, i) => {
          const pos = positions[i];
          const rel = relationshipFor(node.id);
          const isFlagged = rel.kind === "flagged";
          return (
            <line
              key={`edge-${node.id}`}
              x1={CX} y1={CY} x2={pos.x} y2={pos.y}
              stroke={isFlagged ? severityColor : "#a1a1aa"}
              strokeWidth={isFlagged ? 2.25 : 1.5}
              strokeDasharray={isFlagged ? "5 3" : rel.kind === "peer" ? "2 3" : undefined}
              opacity={hoveredId && hoveredId !== node.id ? 0.35 : 1}
            />
          );
        })}

        {/* Focal node */}
        <g>
          <circle cx={CX} cy={CY} r={20} fill="#ecfdf5" stroke="#047857" strokeWidth={2.5} />
          <foreignObject x={CX - 10} y={CY - 10} width={20} height={20}>
            <AccountGlyph className="h-5 w-5 text-emerald-800" />
          </foreignObject>
        </g>

        {neighbors.map((node, i) => {
          const pos = positions[i];
          const rel = relationshipFor(node.id);
          const isFlagged = rel.kind === "flagged";
          const isHovered = hoveredId === node.id;
          const dim = hoveredId && !isHovered;
          const fill = isFlagged ? "#fef2f2" : "#f4f4f5";
          const stroke = isFlagged ? severityColor : "#71717a";
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId((v) => (v === node.id ? null : v))}
              className="cursor-pointer"
              opacity={dim ? 0.45 : 1}
            >
              <title>{`${node.name} — ${EDGE_KIND_LABEL[rel.kind]}`}</title>
              {node.kind === "account" ? (
                <circle cx={pos.x} cy={pos.y} r={15} fill={fill} stroke={stroke} strokeWidth={isHovered ? 2.5 : 1.5} />
              ) : (
                <rect x={pos.x - 15} y={pos.y - 15} width={30} height={30} rx={7} fill={fill} stroke={stroke} strokeWidth={isHovered ? 2.5 : 1.5} />
              )}
              <foreignObject x={pos.x - 8} y={pos.y - 8} width={16} height={16}>
                {node.kind === "account" ? (
                  <AccountGlyph className="h-4 w-4 text-zinc-700" />
                ) : (
                  <ServiceGlyph className="h-4 w-4 text-zinc-700" />
                )}
              </foreignObject>
              <text x={pos.x} y={pos.y + 28} textAnchor="middle" className="fill-zinc-600 text-[10px] font-medium">
                {truncateLabel(node.name)}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        role="status"
        aria-live="polite"
        className="mt-2 min-h-[52px] rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5"
      >
        {hovered ? (
          <div>
            <p className="text-xs font-bold text-zinc-900">{hovered.node.name}</p>
            <p className="text-xs font-normal text-zinc-600">
              {NODE_KIND_LABEL[hovered.node.kind]} · {EDGE_KIND_LABEL[hovered.rel.kind]} · {hovered.rel.since}
            </p>
          </div>
        ) : (
          <p className="text-xs font-normal text-zinc-500">
            Hover a node above to see its exact relationship to {focal.name}. Everything shown here is also in the table below.
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-normal text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <AccountGlyph className="h-3 w-3" /> Account
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ServiceGlyph className="h-3 w-3" /> Service
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldAlert aria-hidden="true" className="h-3 w-3" style={{ color: severityColor }} /> Flagged in this event
        </span>
      </div>

      <details className="mt-4 border-t border-zinc-200 pt-3">
        <summary className={`cursor-pointer text-xs font-medium text-emerald-700 ${FOCUS_RING}`}>
          View adjacency as a table
        </summary>
        <div className="mt-3">
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <caption className="sr-only">
              Accounts and services connected to {focal.name} for the {pinned ? "pinned" : "auto-focused"} event, {EVENT_TYPE_META[focusEvent.type].label}.
            </caption>
            <colgroup>
              <col className="w-[38%]" />
              <col className="w-[16%]" />
              <col className="w-[27%]" />
              <col className="w-[19%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                <th scope="col" className="py-2 pr-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Node</th>
                <th scope="col" className="py-2 pr-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Type</th>
                <th scope="col" className="py-2 pr-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Relationship</th>
                <th scope="col" className="py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Since</th>
              </tr>
            </thead>
            <tbody>
              {neighbors.map((node) => {
                const rel = relationshipFor(node.id);
                return (
                  <tr key={node.id} className="border-b border-zinc-100 last:border-b-0">
                    <td className="py-2 pr-2 font-medium text-zinc-800">{node.name}</td>
                    <td className="py-2 pr-2 font-normal text-zinc-600">{NODE_KIND_LABEL[node.kind]}</td>
                    <td className="py-2 pr-2 font-normal text-zinc-600">{EDGE_KIND_LABEL[rel.kind]}</td>
                    <td className="py-2 font-normal text-zinc-500">{rel.since}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </Card>
  );
}

function truncateLabel(name: string): string {
  const first = name.split(" ")[0];
  return first.length > 10 ? `${first.slice(0, 9)}…` : first;
}
