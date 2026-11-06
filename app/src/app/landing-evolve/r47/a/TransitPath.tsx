"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS, FOCUS_RING } from "./tokens";
import { formatUsd, type DerivedSpeed } from "./data";

type NodeId = "seller" | "hub" | "buyer";

type NodeDef = {
  id: NodeId;
  title: string;
  detail: string;
};

const NODE_DEFS: readonly NodeDef[] = [
  {
    id: "seller",
    title: "Seller",
    detail:
      "Seller ships from home. The AI pre-fills weight and dimensions from the listing photos, so the label prints in one tap.",
  },
  {
    id: "hub",
    title: "Verification hub",
    detail:
      "Every item is authenticated against 40+ reference points, graded, and photographed before it moves on to the buyer.",
  },
  {
    id: "buyer",
    title: "Buyer",
    detail:
      "Delivered with the full verification report attached: serial match, condition grade, and the seller's payout receipt.",
  },
];

function metricFor(nodeId: NodeId, derived: DerivedSpeed): { time: string; cost: string } {
  if (nodeId === "seller") {
    return { time: `${derived.sellerToHubLabel} to hub`, cost: formatUsd(derived.legCost[0]) };
  }
  if (nodeId === "hub") {
    return { time: `${derived.hubProcessingLabel} to verify`, cost: formatUsd(derived.legCost[1]) };
  }
  return { time: `${derived.hubToBuyerLabel} to buyer`, cost: formatUsd(derived.legCost[2]) };
}

export default function TransitPath({ derived }: { derived: DerivedSpeed }) {
  const [activeNode, setActiveNode] = useState<NodeId | null>(null);
  const reduced = useReducedMotion();
  const uid = useId();

  return (
    <div
      className="w-full rounded-2xl border p-3 sm:p-4"
      style={{ borderColor: COLORS.line, backgroundColor: COLORS.bg }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-2">
        {NODE_DEFS.map((node, index) => {
          const metric = metricFor(node.id, derived);
          const isActive = activeNode === node.id;
          const tooltipId = `${uid}-${node.id}-detail`;

          return (
            <div key={node.id} className="flex min-w-0 flex-1 items-start sm:items-stretch">
              <div className="relative flex min-w-0 flex-1 flex-col items-center">
                <button
                  type="button"
                  className={`group flex w-full flex-col items-center gap-1 rounded-xl border bg-white px-2 py-2.5 text-center transition-colors ${FOCUS_RING}`}
                  style={{ borderColor: isActive ? COLORS.accent : COLORS.line }}
                  aria-expanded={isActive}
                  aria-describedby={tooltipId}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode((cur) => (cur === node.id ? null : cur))}
                  onFocus={() => setActiveNode(node.id)}
                  onBlur={() => setActiveNode((cur) => (cur === node.id ? null : cur))}
                >
                  <span
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                    style={{ backgroundColor: COLORS.accent, fontFamily: "var(--font-display-grotesk)" }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="text-[13px] font-semibold" style={{ color: COLORS.fg }}>
                    {node.title}
                  </span>
                  <motion.span
                    key={reduced ? "static" : `${derived.id}-${node.id}-time`}
                    initial={reduced ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="block text-[12px] font-normal leading-[1.4]"
                    style={{ color: COLORS.muted }}
                  >
                    {metric.time}
                  </motion.span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums"
                    style={{ backgroundColor: COLORS.bgTintStrong, color: COLORS.accentStrong }}
                  >
                    {metric.cost}
                  </span>
                </button>

                <div
                  id={tooltipId}
                  role="status"
                  className={`absolute top-full z-20 mt-2 w-[230px] rounded-xl border bg-white p-3 text-left text-[12px] font-normal leading-[1.5] shadow-lg ${
                    isActive ? "block" : "hidden"
                  } ${index === 0 ? "left-0" : index === NODE_DEFS.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                  style={{ borderColor: COLORS.line, color: COLORS.fg }}
                >
                  {node.detail}
                </div>
              </div>

              {index < NODE_DEFS.length - 1 && (
                <div className="mt-4 flex w-6 flex-none items-center sm:w-full sm:px-1" aria-hidden="true">
                  <div
                    className="h-[3px] w-full overflow-hidden rounded-full sm:h-[3px]"
                    style={{ backgroundColor: COLORS.line }}
                  >
                    <motion.div
                      key={reduced ? "static-edge" : `${derived.id}-edge-${index}`}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS.accent, transformOrigin: "left" }}
                      initial={reduced ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
