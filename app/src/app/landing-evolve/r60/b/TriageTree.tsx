"use client";

import { ArrowLeft } from "lucide-react";
import {
  CONDITION_OPTIONS,
  DEVICE_OPTIONS,
  LEVEL1_X,
  LEVEL1_Y,
  ROOT_POS,
  STEP2_QUESTION,
  TREE_H,
  TREE_W,
  findLeaf,
  formatRange,
  level2Pos,
  offerFor,
  trailFor,
  type DeviceType,
} from "./tree";
import { ACCENT, ACCENT_SOFT_BG, BORDER, BORDER_STRONG, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE, SURFACE_TINT } from "./tokens";

interface TriageTreeProps {
  deviceType: DeviceType | null;
  conditionId: string | null;
  urgent: boolean;
  onSetDevice: (d: DeviceType) => void;
  onSetCondition: (c: string) => void;
  onClearCondition: () => void;
  onClearDevice: () => void;
  onToggleUrgent: () => void;
  /** Compact mode (Hero only): tree + both question groups + the verdict's headline number, no
   * reasoning sentence or trail text — the full explanation lives in the full device below. */
  compact?: boolean;
}

/**
 * The page's one input-manipulation device. Two SEQUENTIAL branching questions (not a fixed
 * linear stepper) — the second question's wording and options genuinely depend on the first
 * answer — drive a live-highlighted path through a fixed, fully pre-laid-out tree. Choosing a
 * new device type clears the condition answer, because the step-2 question itself changes; a
 * "change device" action prunes back to nothing chosen. A third, independent toggle (urgency)
 * swaps which of two channel offers the verdict shows, for every leaf, not just some.
 */
export function TriageTree({
  deviceType,
  conditionId,
  urgent,
  onSetDevice,
  onSetCondition,
  onClearCondition,
  onClearDevice,
  onToggleUrgent,
  compact = false,
}: TriageTreeProps) {
  const leaf = deviceType && conditionId ? findLeaf(deviceType, conditionId) : undefined;
  const offer = leaf ? offerFor(leaf, urgent) : undefined;

  const ariaLabel = leaf && offer
    ? `Triage tree. Current path: ${trailFor(deviceType, conditionId)}. Recommended channel: ${offer.channel}, estimated ${formatRange(offer)}.`
    : `Triage tree. ${trailFor(deviceType, conditionId)}`;

  return (
    <div className="rounded-2xl p-4" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      <svg viewBox={`0 0 ${TREE_W} ${TREE_H}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
        {/* Edges: root -> level1 */}
        {DEVICE_OPTIONS.map((device) => {
          const active = deviceType === device.id;
          return (
            <line
              key={`edge-root-${device.id}`}
              x1={ROOT_POS.x}
              y1={ROOT_POS.y}
              x2={LEVEL1_X[device.id]}
              y2={LEVEL1_Y}
              stroke={active ? ACCENT : BORDER_STRONG}
              strokeWidth={active ? 2.5 : 1.5}
              opacity={active ? 1 : 0.6}
            />
          );
        })}

        {/* Edges: level1 -> level2, all 9 always drawn so the full tree shape is visible from the start */}
        {DEVICE_OPTIONS.flatMap((device) =>
          CONDITION_OPTIONS[device.id].map((condition) => {
            const active = deviceType === device.id && conditionId === condition.id;
            const pos = level2Pos(device.id, condition.id);
            return (
              <line
                key={`edge-${device.id}-${condition.id}`}
                x1={LEVEL1_X[device.id]}
                y1={LEVEL1_Y}
                x2={pos.x}
                y2={pos.y}
                stroke={active ? ACCENT : BORDER_STRONG}
                strokeWidth={active ? 2.5 : 1}
                opacity={active ? 1 : 0.35}
              />
            );
          }),
        )}

        {/* Level 2 nodes: dots for every leaf, labels only for the currently chosen device's three */}
        {DEVICE_OPTIONS.flatMap((device) =>
          CONDITION_OPTIONS[device.id].map((condition) => {
            const pos = level2Pos(device.id, condition.id);
            const active = deviceType === device.id && conditionId === condition.id;
            const belongsToChosenDevice = deviceType === device.id;
            return (
              <g key={`node-${device.id}-${condition.id}`}>
                <circle cx={pos.x} cy={pos.y} r={active ? 7 : 4.5} fill={active ? ACCENT : SURFACE_TINT} stroke={active ? ON_ACCENT_TEXT : BORDER_STRONG} strokeWidth={1} />
                {belongsToChosenDevice && (
                  <text x={pos.x} y={pos.y + 20} textAnchor="middle" fontSize={9} fontWeight={active ? 600 : 400} fill={active ? FG : MUTED}>
                    {condition.id}
                  </text>
                )}
              </g>
            );
          }),
        )}

        {/* Level 1 nodes: always labeled */}
        {DEVICE_OPTIONS.map((device) => {
          const active = deviceType === device.id;
          return (
            <g key={`node-${device.id}`}>
              <circle cx={LEVEL1_X[device.id]} cy={LEVEL1_Y} r={active ? 10 : 7} fill={active ? ACCENT : SURFACE_TINT} stroke={active ? ON_ACCENT_TEXT : BORDER_STRONG} strokeWidth={1.5} />
              <text x={LEVEL1_X[device.id]} y={LEVEL1_Y - 16} textAnchor="middle" fontSize={11} fontWeight={active ? 600 : 400} fill={active ? FG : MUTED}>
                {device.label}
              </text>
            </g>
          );
        })}

        {/* Root node */}
        <circle cx={ROOT_POS.x} cy={ROOT_POS.y} r={8} fill={SURFACE_TINT} stroke={BORDER_STRONG} strokeWidth={1.5} />
        <text x={ROOT_POS.x} y={ROOT_POS.y + 22} textAnchor="middle" fontSize={11} fontWeight={600} fill={MUTED}>
          Trade-in
        </text>
      </svg>

      <div className="mt-3" role="group" aria-label="What are you trading in?">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          What are you trading in?
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {DEVICE_OPTIONS.map((device) => {
            const active = deviceType === device.id;
            return (
              <button
                key={device.id}
                type="button"
                aria-pressed={active}
                onClick={() => onSetDevice(device.id)}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${FOCUS_RING}`}
                style={{ backgroundColor: active ? ACCENT : SURFACE_TINT, color: active ? ON_ACCENT_TEXT : MUTED }}
              >
                {device.label}
              </button>
            );
          })}
        </div>
      </div>

      {deviceType && (
        <div className="mt-3" role="group" aria-label={STEP2_QUESTION[deviceType]}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            {STEP2_QUESTION[deviceType]}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {CONDITION_OPTIONS[deviceType].map((condition) => {
              const active = conditionId === condition.id;
              return (
                <button
                  key={condition.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSetCondition(condition.id)}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${FOCUS_RING}`}
                  style={{ backgroundColor: active ? ACCENT : SURFACE_TINT, color: active ? ON_ACCENT_TEXT : MUTED }}
                >
                  {condition.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {leaf && offer && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="tabular-nums">
            <span className="text-[20px] font-extrabold" style={{ color: FG }}>
              {formatRange(offer)}
            </span>
            <span className="ml-1.5 text-[12px] font-semibold" style={{ color: ACCENT }}>
              {offer.channel}
            </span>
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={urgent}
            onClick={onToggleUrgent}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: urgent ? ACCENT : SURFACE_TINT, color: urgent ? ON_ACCENT_TEXT : MUTED }}
          >
            {urgent ? "Need it today" : "Can wait"}
          </button>
        </div>
      )}

      {!compact && leaf && (
        <>
          <p className="mt-3 rounded-lg p-2.5 text-[13px] font-normal leading-[1.5]" style={{ backgroundColor: ACCENT_SOFT_BG, color: FG }}>
            {leaf.reasoning}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClearCondition}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${FOCUS_RING}`}
              style={{ backgroundColor: SURFACE_TINT, color: MUTED }}
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Change condition
            </button>
            <button
              type="button"
              onClick={onClearDevice}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${FOCUS_RING}`}
              style={{ backgroundColor: SURFACE_TINT, color: MUTED }}
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Different device
            </button>
          </div>
        </>
      )}
    </div>
  );
}
