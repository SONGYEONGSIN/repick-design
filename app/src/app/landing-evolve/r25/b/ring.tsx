"use client";

// The Authentication Confidence Ring: a multi-segment radial arc, NOT a single gauge/dial.
// Each verification method owns a fixed angular slot (weight / 100 * 360deg), in a fixed order,
// separated by a real numeric gap (not a rounded-cap illusion — see b.md for why butt caps were
// chosen over round ones). Toggling a method swaps its slot between the accent color (active) and
// the neutral track color (inactive); nothing is renormalized, so the ring's total colored sweep
// is always exactly equal to the confidence percentage shown at its center.

import { useMemo } from "react";
import type { Method, MethodId } from "./data";

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 92;
const STROKE = 22;
const GAP_DEG = 5.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Slot = { id: MethodId; startDeg: number; endDeg: number };

function buildSlots(methods: Method[]): Slot[] {
  let cursor = 0;
  return methods.map((m) => {
    const width = (m.weight / 100) * 360;
    const slot: Slot = { id: m.id, startDeg: cursor, endDeg: cursor + width };
    cursor += width;
    return slot;
  });
}

export default function ConfidenceRing({
  methods,
  active,
  accent,
  track,
}: {
  methods: Method[];
  active: Set<MethodId>;
  accent: string;
  track: string;
}) {
  const slots = useMemo(() => buildSlots(methods), [methods]);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
        {slots.map((slot) => {
          const renderStart = slot.startDeg + GAP_DEG / 2;
          const renderWidth = Math.max(slot.endDeg - slot.startDeg - GAP_DEG, 0);
          const arcLen = (renderWidth / 360) * CIRCUMFERENCE;
          const startLen = (renderStart / 360) * CIRCUMFERENCE;
          const on = active.has(slot.id);
          return (
            <circle
              key={slot.id}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={on ? accent : track}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              strokeDasharray={`${arcLen} ${CIRCUMFERENCE - arcLen}`}
              strokeDashoffset={-startLen}
              style={{ transition: "stroke 260ms ease" }}
            />
          );
        })}
      </g>
    </svg>
  );
}
