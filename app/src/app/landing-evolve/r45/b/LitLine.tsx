"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMounted } from "./useMounted";
import { LINE_DIM, LINE_LIT } from "./tokens";

type Axis = "down" | "left" | "right";

/**
 * One segment of the reasoning tree's spine or branches. The dim line (the tree's full,
 * always-visible shape) is a static layer; the accent line (the path actually taken) is a
 * second layer that animates in on top of it when `lit` turns true, and animates back out if
 * the visitor changes their answer. `axis` sets which direction it "draws" from:
 *  - "down": a vertical trunk/tick, grows downward from its top edge.
 *  - "left": a horizontal half-branch, grows leftward from its right edge (toward a left node).
 *  - "right": a horizontal half-branch, grows rightward from its left edge (toward a right node).
 *
 * Caller supplies sizing + positioning classes (must include a position: relative/absolute
 * utility) via `className`; this component only draws the two layered lines inside that box.
 */
export function LitLine({ axis, lit, className = "" }: { axis: Axis; lit: boolean; className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  const scaleKey = axis === "down" ? "scaleY" : "scaleX";
  const origin = axis === "down" ? "top" : axis === "left" ? "right" : "left";
  const target = lit ? 1 : 0;

  return (
    <span className={`block shrink-0 ${className}`} aria-hidden="true">
      <span className="absolute inset-0 block" style={{ backgroundColor: LINE_DIM }} />
      {!mounted || reduced ? (
        <span
          className="absolute inset-0 block"
          style={{
            backgroundColor: LINE_LIT,
            transformOrigin: origin,
            transform: `${scaleKey}(${target})`,
          }}
        />
      ) : (
        <motion.span
          className="absolute inset-0 block"
          style={{ backgroundColor: LINE_LIT, transformOrigin: origin }}
          animate={{ [scaleKey]: target }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}
    </span>
  );
}
