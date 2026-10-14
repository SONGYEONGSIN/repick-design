'use client';

import { useId, useState } from 'react';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { COLORS } from './data';
import { CHIP_MAP, RANK_WEIGHTS, describeOrder, moveChip, reorderByDrag, type ChipId } from './reorder-math';

interface ReorderDeviceProps {
  order: ChipId[];
  onReorder: (next: ChipId[]) => void;
}

/**
 * Drag-to-reorder device for the four priority chips.
 *
 * Implementation choice: native HTML5 drag-and-drop (`draggable`,
 * `onDragStart`/`onDragOver`/`onDrop`) drives the pointer-drag experience,
 * but it is deliberately NOT the only way to reorder — HTML5 DnD has no
 * built-in keyboard story and is flaky on touch, so every chip also carries
 * an always-visible up/down button pair. The buttons are the accessible
 * primary path (full keyboard reachability, works on touch, nothing to
 * hand-write around pointer capture); drag is the fast path for a mouse.
 * Both call the exact same pure `moveChip` / `reorderByDrag` functions, so
 * the two input methods can never disagree about the resulting order.
 */
export default function ReorderDevice({ order, onReorder }: ReorderDeviceProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const listId = useId();

  const handleDrop = (targetIndex: number) => {
    if (dragIndex !== null) {
      onReorder(reorderByDrag(order, dragIndex, targetIndex));
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div>
      <p id={`${listId}-label`} className="text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: COLORS.accentTint }}>
        Rank your priorities
      </p>
      <p className="mt-1.5 text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
        Drag by the handle, or use the up/down buttons. The cards on this page re-sort as you go.
      </p>

      {/* Screen-reader-only live summary — announces the new rank order after every move,
          since neither drag nor a disabled button communicates the result on its own. */}
      <p className="sr-only" role="status" aria-live="polite">
        Priority order: {describeOrder(order)}.
      </p>

      <ol aria-labelledby={`${listId}-label`} className="mt-4 flex flex-col gap-2">
        {order.map((chipId, index) => {
          const chip = CHIP_MAP[chipId];
          const weight = RANK_WEIGHTS[index];
          const isDragSource = dragIndex === index;
          const isDragTarget = dragOverIndex === index && dragIndex !== null && dragIndex !== index;

          return (
            <li
              key={chipId}
              draggable
              onDragStart={(e) => {
                setDragIndex(index);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(index));
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverIndex !== index) setDragOverIndex(index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(index);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              className="flex items-center gap-2 rounded-xl p-2.5 transition-colors"
              style={{
                backgroundColor: isDragTarget ? COLORS.surfaceLine : COLORS.bg,
                border: `1px solid ${isDragSource ? COLORS.accent : COLORS.surfaceLine}`,
                opacity: isDragSource ? 0.6 : 1,
              }}
            >
              <span aria-hidden="true" className="cursor-grab touch-none" style={{ color: COLORS.muted }}>
                <GripVertical className="h-4 w-4" />
              </span>

              <span
                aria-hidden="true"
                className="tabular-nums flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                style={{ backgroundColor: COLORS.accentFill, color: COLORS.fg }}
              >
                {index + 1}
              </span>

              <div className="flex flex-1 flex-col">
                <span className="text-[14px] font-semibold" style={{ color: COLORS.fg }}>
                  {chip.label}
                </span>
                <span className="text-[11.5px] font-normal leading-[1.4]" style={{ color: COLORS.muted }}>
                  {chip.description}
                </span>
              </div>

              <span
                className="tabular-nums shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ color: COLORS.accentTint, border: `1px solid ${COLORS.surfaceLine}` }}
              >
                {weight}%
              </span>

              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => onReorder(moveChip(order, index, -1))}
                  disabled={index === 0}
                  aria-label={`Move ${chip.label} up, currently priority ${index + 1} of ${order.length}`}
                  className="rounded p-0.5 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-25"
                  style={{ color: COLORS.fg, outlineColor: COLORS.accentTint }}
                >
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onReorder(moveChip(order, index, 1))}
                  disabled={index === order.length - 1}
                  aria-label={`Move ${chip.label} down, currently priority ${index + 1} of ${order.length}`}
                  className="rounded p-0.5 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-25"
                  style={{ color: COLORS.fg, outlineColor: COLORS.accentTint }}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
