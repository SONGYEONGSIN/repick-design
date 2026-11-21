import { ACCENT } from "./theme";
import { type StepId } from "./data";
import { TOTAL_STEPS, trustScoreLabel, trustScoreState } from "./score-math";

const SIZE = 104;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The Trust Score readout: a real derived computation, never a decorative
 * static number. The ring's filled fraction is `inspectedCount / 4` (how
 * much of the pipeline has been opened); the number in the center is the
 * running average of the inspected steps' own scores (see
 * `trustScoreState`). `aria-live="polite"` on the wrapper means a
 * screen-reader user hears both change together as steps are opened.
 */
export default function TrustScoreCard({ inspected }: { inspected: ReadonlySet<StepId> }) {
  const state = trustScoreState(inspected);
  const filledLength = CIRCUMFERENCE * (state.inspectedCount / TOTAL_STEPS);
  const trackLength = CIRCUMFERENCE - filledLength;

  return (
    <div
      aria-live="polite"
      className={`flex flex-col items-center gap-3 rounded-2xl border p-5 text-center ${
        state.resolved ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-zinc-50"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Trust score</p>

      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#E4E4E7" strokeWidth={STROKE} />
          {state.inspectedCount > 0 && (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={ACCENT}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${filledLength} ${trackLength}`}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          )}
        </svg>
        {/* Real HTML text, not SVG — so the score itself is never dependent on how a
            screen reader happens to expose inline SVG <text>, and reads naturally
            alongside the aria-live region's caption below it. */}
        <p
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[22px] font-extrabold tabular-nums text-zinc-950"
          aria-hidden="true"
        >
          {state.score === null ? "—" : `${state.score}%`}
        </p>
      </div>

      <p className="text-xs font-normal leading-[1.5] text-zinc-600">{trustScoreLabel(state)}</p>
    </div>
  );
}
