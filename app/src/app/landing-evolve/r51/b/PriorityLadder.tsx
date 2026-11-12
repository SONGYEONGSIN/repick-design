"use client";

import { useId, useState } from "react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { CRITERIA, RANK_WEIGHTS, describeOrder, type CriterionId, type RankMap } from "./rank-model";
import { ACCENT_FILL, ACCENT_LARGE, ACCENT_TEXT, ACCENT_TINT_BG, ACCENT_TINT_BORDER, BORDER, GHOST, INK, MUTED } from "./tokens";

/**
 * The drag-to-reorder priority ladder. Implementation choice: real pointer
 * drag-and-drop (native `draggable` + drag events) drives the fast mouse
 * path, but it is deliberately never the ONLY way to reorder — HTML5 DnD
 * has no built-in keyboard story and is unreliable on touch. Every row also
 * carries always-visible, always-focusable up/down buttons, which is the
 * fully keyboard- and screen-reader-operable path. Both call the exact same
 * pure `moveRank` / `reorderByDrag` functions from rank-model.ts, so the two
 * input methods can never disagree about the resulting order.
 */
export default function PriorityLadder({
  rankMap,
  onMove,
  onDragReorder,
}: {
  rankMap: RankMap;
  onMove: (id: CriterionId, direction: -1 | 1) => void;
  onDragReorder: (draggedId: CriterionId, targetId: CriterionId) => void;
}) {
  const [draggedId, setDraggedId] = useState<CriterionId | null>(null);
  const [overId, setOverId] = useState<CriterionId | null>(null);
  const listLabelId = useId();

  const ordered = CRITERIA.slice().sort((a, b) => rankMap[a.id] - rankMap[b.id]);

  return (
    <div>
      <p id={listLabelId} className="text-[12px] font-semibold uppercase" style={{ color: ACCENT_TEXT, letterSpacing: "0.22em" }}>
        Rank your priorities
      </p>
      <p className="mt-1.5 text-[13px] font-normal leading-[1.6]" style={{ color: MUTED }}>
        Drag a row, or use the arrows. Every score on this page re-sorts as you go.
      </p>

      {/* Screen-reader-only live summary. Neither a drag nor a disabled
          button announces its own result, so this is the one place that
          does — and it is derived from rankMap on every render, never a
          string that could drift from the rows above it. */}
      <p className="sr-only" role="status" aria-live="polite">
        Priority order, highest first: {describeOrder(rankMap)}.
      </p>

      <ol aria-labelledby={listLabelId} className="mt-4 flex flex-col gap-2">
        {ordered.map((criterion) => {
          const rank = rankMap[criterion.id];
          const weight = RANK_WEIGHTS[rank - 1];
          const isTop = rank === 1;
          const isDragSource = draggedId === criterion.id;
          const isDragTarget = overId === criterion.id && draggedId !== null && draggedId !== criterion.id;

          return (
            <li
              key={criterion.id}
              draggable
              onDragStart={(e) => {
                setDraggedId(criterion.id);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", criterion.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (overId !== criterion.id) setOverId(criterion.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedId) onDragReorder(draggedId, criterion.id);
                setDraggedId(null);
                setOverId(null);
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setOverId(null);
              }}
              className="flex items-center gap-2.5 rounded-xl p-2.5 transition-colors sm:gap-3 sm:p-3"
              style={{
                backgroundColor: isTop ? ACCENT_TINT_BG : isDragTarget ? "#F4F4F5" : "#FFFFFF",
                border: `1px solid ${isTop ? ACCENT_TINT_BORDER : BORDER}`,
                opacity: isDragSource ? 0.55 : 1,
              }}
            >
              <span aria-hidden="true" className="hidden cursor-grab touch-none sm:block" style={{ color: GHOST }}>
                <GripVertical className="h-4 w-4" />
              </span>

              <span
                aria-hidden="true"
                className="tabular-nums flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                style={{
                  backgroundColor: isTop ? ACCENT_FILL : "#F4F4F5",
                  color: isTop ? "#FFFFFF" : INK,
                }}
              >
                {rank}
              </span>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14px] font-semibold" style={{ color: INK }}>
                  {criterion.label}
                </span>
                <span className="truncate text-[11.5px] font-normal leading-[1.4]" style={{ color: MUTED }}>
                  {criterion.description}
                </span>
              </div>

              <span
                className="tabular-nums shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ color: ACCENT_TEXT, border: `1px solid ${BORDER}` }}
              >
                {weight}%
              </span>

              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => onMove(criterion.id, -1)}
                  disabled={rank === 1}
                  aria-label={`Move ${criterion.label} up, currently priority ${rank} of ${CRITERIA.length}`}
                  className="flex min-h-6 min-w-6 items-center justify-center rounded transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-25"
                  style={{ color: INK, outlineColor: ACCENT_LARGE }}
                >
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(criterion.id, 1)}
                  disabled={rank === CRITERIA.length}
                  aria-label={`Move ${criterion.label} down, currently priority ${rank} of ${CRITERIA.length}`}
                  className="flex min-h-6 min-w-6 items-center justify-center rounded transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-25"
                  style={{ color: INK, outlineColor: ACCENT_LARGE }}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Visible caption — audited per the brief: this is derived from the
          same `describeOrder(rankMap)` call as the sr-only status above,
          never a hand-typed string, so it can never contradict the rows
          it's describing even at the edge ranks. */}
      <p className="mt-3 text-[11.5px] font-normal leading-[1.5]" style={{ color: MUTED }}>
        Ranked by: {describeOrder(rankMap)}.
      </p>
    </div>
  );
}
