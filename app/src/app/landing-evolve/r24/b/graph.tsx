"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, History, Lock, Package, ScanSearch, User, UserCheck, type LucideIcon } from "lucide-react";
import { EDGES, isEdgeActive, isNodeActive, LAYERS, NODES, VIEW_H, VIEW_W, type LayerId, type NodeId } from "./data";

// Accent contrast math (against bg #0B0B0F) is recorded in candidates/b.md — the short version:
// ACCENT_FILL alone is 5.52:1, and the bright ACCENT_TINT reserved for small text/icons is 11.65:1.
const ACCENT_FILL = "#EA580C";
const ACCENT_TINT = "#FDBA74";
const EDGE_OFF = "#3F3F46"; // zinc-700, non-text decorative line — no AA text requirement
const NODE_ICON: Record<NodeId, LucideIcon> = {
  seller: User,
  item: Package,
  aiScan: ScanSearch,
  inspection: ClipboardCheck,
  sellerHistory: History,
  escrowHold: Lock,
  buyer: UserCheck,
};

function pct(value: number, total: number): string {
  return `${((value / total) * 100).toFixed(2)}%`;
}

export default function TrustGraph({ active, reduce }: { active: Set<LayerId>; reduce: boolean }) {
  const activeLabels = LAYERS.filter((l) => active.has(l.id)).map((l) => l.label);
  const summary =
    activeLabels.length === 0
      ? "no verification layers are active yet — only the base seller-to-buyer connection is lit"
      : `${activeLabels.length} of ${LAYERS.length} verification layers active: ${activeLabels.join(", ")}`;

  return (
    <div
      role="img"
      aria-label={`Trust verification graph. Right now ${summary}.`}
      className="relative aspect-[38/21] w-full"
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {EDGES.map((edge) => {
          const from = NODES.find((n) => n.id === edge.from);
          const to = NODES.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          const on = isEdgeActive(edge, active);
          return (
            <motion.line
              key={edge.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              strokeLinecap="round"
              stroke={on ? ACCENT_FILL : EDGE_OFF}
              strokeWidth={on ? 3 : 1.5}
              strokeDasharray={on ? undefined : "5 6"}
              initial={false}
              animate={{ opacity: on ? 1 : 0.6 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </svg>

      {NODES.map((node) => {
        const Icon = NODE_ICON[node.id];
        const on = isNodeActive(node, active);
        return (
          <div
            key={node.id}
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: pct(node.x, VIEW_W), top: pct(node.y, VIEW_H) }}
          >
            {on && (
              <motion.span
                aria-hidden="true"
                className="absolute h-12 w-12 rounded-full sm:h-16 sm:w-16"
                style={{ background: ACCENT_FILL }}
                initial={false}
                animate={{ opacity: 0.16 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              />
            )}
            <span
              aria-hidden="true"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 sm:h-11 sm:w-11"
              style={{
                borderColor: on ? ACCENT_FILL : "rgba(255,255,255,0.18)",
                background: on ? ACCENT_FILL : "#0B0B0F",
              }}
            >
              <Icon
                className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]"
                style={{ color: on ? "#0B0B0F" : "#A1A1AA" }}
              />
            </span>
            <span
              aria-hidden="true"
              className="whitespace-nowrap text-[8px] font-semibold tracking-[0.08em] sm:text-[10px]"
              style={{ color: on ? ACCENT_TINT : "#A1A1AA" }}
            >
              {node.label.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
