'use client';

import { CRITERIA, MAX_WEIGHT, MIN_WEIGHT, WEIGHT_STEP, radiusForWeight, orbitPosition, scoreTier } from './orbit-math';
import { COLORS } from './data';

interface OrbitDeviceProps {
  weights: number[];
  score: number;
  leading: number;
  onAdjust: (index: number, value: number) => void;
}

/**
 * The Priority Orbit: a central hub holding the live composite score,
 * surrounded by five criteria on concentric rings. Orbit radius encodes
 * each criterion's current weight — closer to the hub means more
 * influence right now, not a bar and not an arc. Moving one slider
 * renormalizes all five against the fixed 100-point budget (see
 * orbit-math.ts); the visualization below is a decorative, aria-hidden
 * mirror of the same numbers the accessible sliders and hub already state.
 */
export default function OrbitDevice({ weights, score, leading, onAdjust }: OrbitDeviceProps) {
  const leadingCriterion = CRITERIA[leading];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] sm:items-center">
      {/* Visual: rings + hub + orbiting nodes. Decorative — every number it
          shows is also stated accessibly by the hub text and the sliders. */}
      <div className="relative mx-auto aspect-square w-full max-w-[360px]">
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {CRITERIA.map((c, i) => {
            const r = radiusForWeight(weights[i]);
            return (
              <circle
                key={`ring-${c.id}`}
                cx={200}
                cy={200}
                r={r}
                fill="none"
                stroke={i === leading ? COLORS.accentTint : COLORS.surfaceLine}
                strokeWidth={i === leading ? 1.5 : 1}
                className="orbit-r33a-anim-ring"
              />
            );
          })}

          <circle cx={200} cy={200} r={74} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={2} />

          {CRITERIA.map((c, i) => {
            const r = radiusForWeight(weights[i]);
            const { x, y } = orbitPosition(i, r);
            const nodeR = 6 + ((weights[i] - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT)) * 9;
            const isLead = i === leading;
            return (
              <g
                key={c.id}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className="orbit-r33a-anim-node"
              >
                <circle
                  r={nodeR}
                  fill={isLead ? COLORS.accent : COLORS.surface}
                  stroke={isLead ? COLORS.accent : COLORS.accentTint}
                  strokeWidth={1.5}
                  className="orbit-r33a-anim-ring"
                />
                <text
                  y={nodeR + 16}
                  textAnchor="middle"
                  fill={isLead ? COLORS.fg : COLORS.muted}
                  fontSize={13}
                  fontFamily="var(--font-sans)"
                  className="orbit-r33a-anim-fill"
                >
                  {c.short}
                </text>
                <text
                  y={nodeR + 32}
                  textAnchor="middle"
                  fill={isLead ? COLORS.accentTint : COLORS.muted}
                  fontSize={12}
                  fontFamily="var(--font-sans)"
                  className="orbit-r33a-anim-fill"
                >
                  {weights[i]}%
                </text>
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-[148px] w-[148px] flex-col items-center justify-center rounded-full text-center"
            style={{ background: COLORS.surface, border: `2px solid ${COLORS.accent}` }}
          >
            <span className="text-[11px] font-normal uppercase tracking-[0.08em]" style={{ color: COLORS.muted }}>
              Match score
            </span>
            <span
              className="tabular-nums text-[42px] font-extrabold leading-none tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
            >
              {score}
            </span>
            <span className="text-[11px] font-semibold" style={{ color: COLORS.accentTint }}>
              {leadingCriterion.short}-led
            </span>
          </div>
        </div>
      </div>

      {/* Controls: five real sliders, each a renormalizing weight control. */}
      <div className="flex flex-col gap-4">
        <p className="text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
          Weight budget: 100 points total, always. Raise one criterion and the rest give way,
          in proportion to their own standing share.
        </p>
        <ul className="flex flex-col gap-3">
          {CRITERIA.map((c, i) => (
            <li key={c.id} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`orbit-weight-${c.id}`} className="text-[14px] font-semibold" style={{ color: COLORS.fg }}>
                  {c.label}
                </label>
                <span className="tabular-nums text-[14px] font-semibold" style={{ color: i === leading ? COLORS.accentTint : COLORS.muted }}>
                  {weights[i]}%
                </span>
              </div>
              <input
                id={`orbit-weight-${c.id}`}
                type="range"
                min={MIN_WEIGHT}
                max={MAX_WEIGHT}
                step={WEIGHT_STEP}
                value={weights[i]}
                onChange={(e) => onAdjust(i, Number(e.target.value))}
                aria-label={`${c.label} weight, currently ${weights[i]} percent of the 100-point budget`}
                className="orbit-r33a-range focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: COLORS.accentTint }}
              />
            </li>
          ))}
        </ul>
        <p className="text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
          Current tier: <span className="font-semibold" style={{ color: COLORS.fg }}>{scoreTier(score)}</span>
        </p>
      </div>

      <style>{`
        .orbit-r33a-anim-node { transition: transform 500ms ease-out; }
        .orbit-r33a-anim-ring { transition: r 500ms ease-out, stroke 500ms ease-out, fill 500ms ease-out; }
        .orbit-r33a-anim-fill { transition: fill 500ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .orbit-r33a-anim-node,
          .orbit-r33a-anim-ring,
          .orbit-r33a-anim-fill {
            transition: none;
          }
        }
        .orbit-r33a-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: ${COLORS.surfaceLine};
          outline-offset: 2px;
        }
        .orbit-r33a-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${COLORS.accent};
          border: 2px solid ${COLORS.bg};
          cursor: pointer;
        }
        .orbit-r33a-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${COLORS.accent};
          border: 2px solid ${COLORS.bg};
          cursor: pointer;
        }
        .orbit-r33a-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: ${COLORS.surfaceLine};
        }
      `}</style>
    </div>
  );
}
