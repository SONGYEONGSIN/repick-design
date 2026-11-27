"use client";

import { useRef, type KeyboardEvent } from "react";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  DollarSign,
  ShieldCheck,
  Truck,
  Users,
  RotateCcw,
} from "lucide-react";
import { CRITERIA, RANK_WEIGHTS, DEFAULT_RANK_ORDER, type CriterionId } from "./lib";
import { FOCUS_RING, ACCENT_TINT } from "./ui";

const CRITERION_ICON: Record<CriterionId, typeof DollarSign> = {
  price: DollarSign,
  condition: ShieldCheck,
  speed: Truck,
  trust: Users,
};

interface RankDeviceProps {
  order: CriterionId[];
  onReorder: (next: CriterionId[]) => void;
}

/**
 * The hero's manipulation device: four draggable priority chips. Reorderable
 * three independent ways — mouse drag, visible move-up/move-down buttons,
 * and Arrow Up/Down on a focused chip — so the keyboard path is never a
 * silent, undiscoverable feature.
 */
export default function RankDevice({ order, onReorder }: RankDeviceProps) {
  const dragId = useRef<CriterionId | null>(null);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = order.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next);
  }

  function handleDrop(targetId: CriterionId) {
    const sourceId = dragId.current;
    dragId.current = null;
    if (!sourceId || sourceId === targetId) return;
    const next = order.slice();
    const from = next.indexOf(sourceId);
    const to = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(to, 0, sourceId);
    onReorder(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>, index: number) {
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(index, -1);
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      move(index, 1);
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          Fig. 01 — Drag to reorder your priorities
        </p>
        <button
          type="button"
          onClick={() => onReorder(DEFAULT_RANK_ORDER)}
          className={`inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white ${FOCUS_RING} rounded`}
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Reset order
        </button>
      </div>
      <p id="rank-instructions" className="mt-1 max-w-[360px] text-xs leading-[1.6] text-zinc-400">
        Drag a chip, or focus it and press Arrow Up / Down — or use the move
        buttons below each chip.
      </p>

      <ul aria-describedby="rank-instructions" className="mt-3 flex flex-col gap-2">
        {order.map((critId, index) => {
          const meta = CRITERIA.find((c) => c.id === critId)!;
          const Icon = CRITERION_ICON[critId];
          const weight = RANK_WEIGHTS[index];
          return (
            <li
              key={critId}
              draggable
              onDragStart={() => {
                dragId.current = critId;
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(critId)}
              tabIndex={0}
              onKeyDown={(event) => handleKeyDown(event, index)}
              aria-label={`Rank ${index + 1} of 4: ${meta.label}, weight ${weight.toFixed(1)}. Drag, or press Arrow Up or Arrow Down, to change rank.`}
              className={`group flex min-w-0 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2.5 ${FOCUS_RING} cursor-grab active:cursor-grabbing`}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-sm font-extrabold tabular-nums text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <GripVertical
                className="h-4 w-4 shrink-0 text-zinc-500"
                aria-hidden="true"
              />
              <Icon
                className="h-4 w-4 shrink-0"
                style={{ color: ACCENT_TINT }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                {meta.label}
              </span>
              <span className="shrink-0 text-[11px] font-semibold tracking-[0.12em] tabular-nums text-zinc-400">
                Weight {weight.toFixed(1)}
              </span>
              <span className="flex shrink-0 flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${meta.label} up to rank ${index}`}
                  className={`flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 ${FOCUS_RING}`}
                >
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  aria-label={`Move ${meta.label} down to rank ${index + 2}`}
                  className={`flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 ${FOCUS_RING}`}
                >
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
