import { Check } from "lucide-react";
import {
  ANGLE_LABELS,
  AUTHENTICITY_MARKERS,
  CONDITION_SUBSCORES,
  FEATURED_ITEM,
  GRADE_LABEL,
  STEP_SCORE,
  type StepId,
} from "./data";
import { discountPercent, formatUsd } from "./score-math";
import { ACCENT } from "./theme";

const RING_SIZE = 72;
const RING_STROKE = 7;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Evidence content for each of the four steps — all fixed, deterministic numbers (see data.ts). */
export default function StepEvidence({ stepId }: { stepId: StepId }) {
  if (stepId === "scan") return <ScanEvidence />;
  if (stepId === "grading") return <GradingEvidence />;
  if (stepId === "authenticity") return <AuthenticityEvidence />;
  return <ListedEvidence />;
}

function ScanEvidence() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true" className="shrink-0">
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke="#E4E4E7" strokeWidth={RING_STROKE} />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={ACCENT}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${RING_CIRCUMFERENCE} 0`}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="fill-zinc-950 text-[15px] font-extrabold tabular-nums">
          6/6
        </text>
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-950">All required angles captured</p>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {ANGLE_LABELS.map((angle) => (
            <li key={angle} className="flex items-center gap-1.5 text-xs font-normal text-zinc-700">
              <Check className="h-3.5 w-3.5 shrink-0 text-blue-800" aria-hidden="true" />
              {angle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GradingEvidence() {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-950">Four sub-scores, rolled into one grade</p>
      <dl className="mt-3 flex flex-col gap-2">
        {CONDITION_SUBSCORES.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-2 text-xs">
            <dt className="font-normal text-zinc-700">{s.label}</dt>
            <dd className="font-semibold tabular-nums text-zinc-950">{s.score}/100</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm font-normal text-zinc-700">
        Overall condition grade:{" "}
        <span className="font-extrabold tabular-nums text-zinc-950">{STEP_SCORE.grading}/100</span>{" "}
        <span className="font-semibold text-blue-800">({GRADE_LABEL(STEP_SCORE.grading)})</span>
      </p>
    </div>
  );
}

function AuthenticityEvidence() {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-950">Every marker checked, none assumed</p>
      <ul className="mt-3 flex flex-col gap-2">
        {AUTHENTICITY_MARKERS.map((marker) => (
          <li key={marker} className="flex items-center justify-between gap-3 text-xs">
            <span className="font-normal text-zinc-700">{marker}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-blue-800">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Matched
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListedEvidence() {
  const discount = discountPercent(FEATURED_ITEM);
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-950">What the first three steps produced</p>
      <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-700">
        Final confidence{" "}
        <span className="font-extrabold tabular-nums text-zinc-950">{STEP_SCORE.listed}%</span> — the
        rounded average of the photo-scan, grading and authenticity scores above, not a fifth,
        separate measurement.
      </p>
      <div className="mt-3 flex flex-wrap items-baseline gap-2 border-t border-zinc-100 pt-3">
        <span className="text-sm font-normal text-zinc-700">{FEATURED_ITEM.title}:</span>
        <span className="text-base font-extrabold tabular-nums text-zinc-950">{formatUsd(FEATURED_ITEM.price)}</span>
        <span className="text-sm font-normal tabular-nums text-zinc-500 line-through">
          {formatUsd(FEATURED_ITEM.originalPrice)}
        </span>
        <span className="text-xs font-semibold tabular-nums text-blue-800">&minus;{discount}%</span>
        <span className="ml-auto text-xs font-semibold text-blue-800">Live in catalog</span>
      </div>
    </div>
  );
}
