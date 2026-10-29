import type { ReactNode } from "react";
import type { ConcernId, Scores } from "./data";
import { round2 } from "./score-math";
import { ACCENT } from "./theme";

interface RingClusterProps {
  concerns: readonly { id: ConcernId; label: string }[];
  scores: Scores;
  selected: ReadonlySet<ConcernId>;
  size?: number;
  center: ReactNode;
}

/**
 * A concentric ring cluster — one ring per concern, nested by radius, NOT
 * a polygon radar chart. Only rings for currently-selected concerns carry
 * a colored score arc; deselected concerns keep their full-circle track
 * but render it dashed and dimmed, so the viewer can see which concerns
 * are *not* being measured right now rather than having them vanish from
 * the layout.
 *
 * The non-color cue is structural, not hue-based: selected tracks are a
 * solid stroke, deselected tracks are dashed (`stroke-dasharray`) at
 * reduced opacity — the same solid/dashed split the concern chips use on
 * their own borders, so the two devices agree without relying on color
 * alone (page-brief-core §2, "색만으로 의미 전달 금지").
 *
 * Purely decorative as far as assistive tech is concerned
 * (`aria-hidden="true"`) — every number it visualizes is also plain,
 * always-visible text in the chip list and the center readout passed in
 * via `center`.
 *
 * All dasharray/circumference numbers are rounded to 2 decimals
 * (page-brief-core §3) so server and client render identical digits.
 */
export default function RingCluster({ concerns, scores, selected, size = 232, center }: RingClusterProps) {
  const mid = size / 2;
  const baseRadius = size * 0.172; // ≈40 at size 232
  const ringGap = size * 0.069; // ≈16 at size 232
  const strokeWidth = size * 0.047; // ≈11 at size 232

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        focusable="false"
        className="block"
      >
        {concerns.map((concern, i) => {
          const r = round2(baseRadius + i * ringGap);
          const circumference = round2(2 * Math.PI * r);
          const isSelected = selected.has(concern.id);
          const score = Math.max(0, Math.min(100, scores[concern.id]));
          const arcLength = round2(circumference * (score / 100));

          return (
            <g key={concern.id}>
              <circle
                cx={mid}
                cy={mid}
                r={r}
                fill="none"
                stroke={isSelected ? "#d4d4d8" : "#a1a1aa"}
                strokeWidth={strokeWidth}
                strokeOpacity={isSelected ? 1 : 0.4}
                strokeDasharray={isSelected ? undefined : "4 6"}
                strokeLinecap="butt"
              />
              {isSelected ? (
                <circle
                  cx={mid}
                  cy={mid}
                  r={r}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  transform={`rotate(-90 ${mid} ${mid})`}
                  className="transition-[stroke-dasharray] duration-300 ease-out motion-reduce:transition-none"
                />
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        {center}
      </div>
    </div>
  );
}
