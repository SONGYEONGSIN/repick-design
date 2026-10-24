"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import {
  FACTORS,
  weightsFromOrder,
  weightShare,
  sortedItems,
  moveInOrder,
  reorderTo,
} from "./rank-logic";
import type { FactorId } from "./rank-logic";
import RadarChart from "./RadarChart";
import { FOCUS_RING, MUTED, ROSE_700 } from "./theme";

const LABEL: Record<FactorId, string> = {
  price: "Price",
  condition: "Condition",
  speed: "Speed",
  trust: "Trust",
};

export default function RankShuffle({
  order,
  onOrderChange,
}: {
  order: FactorId[];
  onOrderChange: (next: FactorId[]) => void;
}) {
  const [draggingId, setDraggingId] = useState<FactorId | null>(null);
  const reduced = useReducedMotion();
  const orderRef = useRef(order);
  orderRef.current = order;

  useEffect(() => {
    if (!draggingId) return;

    function handleMove(e: PointerEvent) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const rowEl = el?.closest("[data-rank-id]") as HTMLElement | null;
      const targetId = rowEl?.dataset.rankId as FactorId | undefined;
      if (targetId && targetId !== draggingId) {
        onOrderChange(reorderTo(orderRef.current, draggingId, targetId));
      }
    }
    function handleUp() {
      setDraggingId(null);
    }
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [draggingId, onOrderChange]);

  const weights = weightsFromOrder(order);
  const scored = sortedItems(order);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,340px)]">
      {/* input: draggable + keyboard-operable rank list */}
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500">DRAG TO REORDER</p>
        <ul className="mt-3 space-y-2" aria-label="Priority ranking, most important first">
          {order.map((id, index) => (
            <motion.li
              key={id}
              data-rank-id={id}
              layout={!reduced}
              transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}
              className={`flex select-none items-center gap-3 rounded-xl border bg-white px-3 py-2.5 ${
                draggingId === id ? "border-[#be123c] shadow-md" : "border-zinc-200"
              }`}
            >
              <span
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold tabular-nums"
                style={{ backgroundColor: "#fdecef", color: ROSE_700 }}
              >
                {index + 1}
              </span>
              <span
                onPointerDown={(e) => {
                  e.preventDefault();
                  setDraggingId(id);
                }}
                className="touch-none cursor-grab p-1 text-zinc-400 active:cursor-grabbing"
                aria-hidden="true"
              >
                <GripVertical className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-semibold text-zinc-950">{LABEL[id]}</span>
              <span className="flex flex-shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onOrderChange(moveInOrder(order, id, -1))}
                  disabled={index === 0}
                  aria-label={`Move ${LABEL[id]} up in priority`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors enabled:hover:bg-zinc-100 disabled:opacity-30 ${FOCUS_RING}`}
                >
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onOrderChange(moveInOrder(order, id, 1))}
                  disabled={index === order.length - 1}
                  aria-label={`Move ${LABEL[id]} down in priority`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors enabled:hover:bg-zinc-100 disabled:opacity-30 ${FOCUS_RING}`}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </span>
            </motion.li>
          ))}
        </ul>
        <p className={`mt-3 text-xs font-normal ${MUTED}`}>
          Drag a chip with the grip handle, or use the up / down buttons — both recompute the shape and the list on
          the right.
        </p>
      </div>

      {/* output (a): radar shape */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500">YOUR PRIORITY SHAPE</p>
        <div className="mx-auto mt-2 aspect-square w-full max-w-[220px]">
          <RadarChart weights={weights} />
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1">
          {FACTORS.map((f) => (
            <li key={f.id} className="flex items-center justify-between text-xs font-normal text-zinc-600">
              <span>{f.label}</span>
              <span className="font-semibold tabular-nums text-zinc-950">{weightShare(weights, f.id)}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* output (b): re-sorting match list */}
      <div className="lg:col-span-2">
        <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500">MATCHES, IN YOUR ORDER</p>
        <ul className="mt-3 space-y-2">
          {scored.map((item, index) => (
            <motion.li
              key={item.id}
              layout={!reduced}
              transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <span className="w-5 flex-shrink-0 text-sm font-extrabold tabular-nums text-zinc-400">{index + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-zinc-950">{item.name}</span>
                <span className="block text-xs font-normal text-zinc-600">
                  {item.category} &middot; {item.priceLabel}
                </span>
              </span>
              <span className="flex-shrink-0 text-sm font-extrabold tabular-nums" style={{ color: ROSE_700 }}>
                {item.score}%
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
