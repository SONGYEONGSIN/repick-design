"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, CircleCheck, CircleDot } from "lucide-react";
import {
  DEFECTS,
  LEDGER_LINES,
  LOCKED_PRICE,
  PHOTO_SLOTS,
  RUBRIC,
  RUBRIC_AVERAGE,
  gradeFromScore,
  money,
  type Stage,
} from "./data";

function IntakeManifest({ stage }: { stage: Stage }) {
  const rows: { label: string; value: string }[] = [
    { label: "Category", value: "Outerwear — Coats" },
    { label: "Size", value: "EU 48 / US 38" },
    { label: "Self-reported condition", value: "“Gently used” (seller’s words)" },
    { label: "Submitted", value: stage.timestamp },
  ];
  return (
    <dl className="flex flex-col justify-center gap-4">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
          <dt className="text-[12px] font-normal text-zinc-400">{row.label}</dt>
          <dd className="text-right text-[13px] font-semibold text-white">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ContactSheet() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {PHOTO_SLOTS.map((slot) => (
        <div
          key={slot.id}
          className="relative flex flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-4 text-center"
        >
          <Camera className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          <span className="text-[10px] font-semibold leading-tight text-zinc-400">{slot.label}</span>
          <CircleCheck
            className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-[#D9BE84]"
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

function InspectionMap() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <svg
        viewBox="0 0 100 120"
        role="img"
        aria-label="Garment inspection map with three flagged points"
        className="w-full max-w-[150px] justify-self-center"
      >
        <path
          d="M22 12 L38 4 L50 12 L62 4 L78 12 L80 32 L72 36 L74 112 L26 112 L28 36 L20 32 Z"
          fill="#1C1C22"
          stroke="#3F3F46"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <line x1="50" y1="12" x2="50" y2="108" stroke="#3F3F46" strokeWidth="1" />
        {DEFECTS.map((defect, i) => (
          <g key={defect.id}>
            <circle cx={defect.x} cy={defect.y} r="4.5" fill="#7A5F28" stroke="#D9BE84" strokeWidth="1" />
            <text
              x={defect.x}
              y={defect.y + 2.6}
              textAnchor="middle"
              fontSize="6"
              fontWeight={700}
              fill="#ffffff"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <ul className="flex flex-col gap-3">
        {DEFECTS.map((defect, i) => (
          <li key={defect.id} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7A5F28] text-[9px] font-extrabold text-white"
            >
              {i + 1}
            </span>
            <span className="text-[12px] font-normal leading-[1.5] text-zinc-300">
              {defect.label}
              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                {defect.severity}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RubricBars() {
  const grade = gradeFromScore(RUBRIC_AVERAGE);
  return (
    <div className="flex flex-col justify-center gap-2">
      {RUBRIC.map((criterion) => (
        <div key={criterion.id}>
          <div className="mb-1 flex items-center justify-between text-[11px] font-normal text-zinc-400">
            <span>{criterion.label}</span>
            <span className="tabular-nums">
              {criterion.score}/{criterion.max}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#D9BE84]"
              style={{ width: `${(criterion.score / criterion.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
      <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[12px] font-semibold text-white">
          Weighted average <span className="tabular-nums">{RUBRIC_AVERAGE.toFixed(1)}</span> / 10
        </span>
        <span className="rounded-full bg-[#7A5F28] px-2.5 py-1 text-[11px] font-semibold text-white">
          Grade {grade}
        </span>
      </div>
    </div>
  );
}

function PriceLedger() {
  return (
    <div className="flex flex-col justify-center gap-2.5">
      {LEDGER_LINES.map((line) => (
        <div key={line.label} className="flex items-baseline justify-between text-[12px]">
          <span className="font-normal text-zinc-400">{line.label}</span>
          <span className="font-semibold tabular-nums text-white">
            {line.value >= 0 ? money(line.value) : `−${money(Math.abs(line.value))}`}
          </span>
        </div>
      ))}
      <div className="mt-1 flex items-baseline justify-between border-t border-white/10 pt-3">
        <span className="text-[13px] font-semibold text-white">Locked price</span>
        <span className="text-[18px] font-extrabold tabular-nums text-[#D9BE84]">
          {money(LOCKED_PRICE)}
        </span>
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-[11px] font-normal text-zinc-400">
        <CircleDot className="h-3 w-3 shrink-0 text-[#D9BE84]" aria-hidden="true" />
        Seller payout scheduled the same day.
      </p>
    </div>
  );
}

export default function GradingDiagram({ stage }: { stage: Stage }) {
  const reduce = useReducedMotion();
  const content = (
    <>
      {stage.index === 0 && <IntakeManifest stage={stage} />}
      {stage.index === 1 && <ContactSheet />}
      {stage.index === 2 && <InspectionMap />}
      {stage.index === 3 && <RubricBars />}
      {stage.index === 4 && <PriceLedger />}
    </>
  );

  return (
    // No remote asset loads here (pure SVG/CSS), so a hard aspect-ratio isn't needed to guard
    // against a broken-image reflow — a generous min-height plus a content-driven max keeps
    // every one of the five stage layouts (the rubric bars are the tallest) clear of the
    // caption reserved in the bottom padding, at any viewport down to 390px.
    <div className="relative min-h-[300px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111116] p-5 pb-9 sm:p-6 sm:pb-10">
      {reduce ? (
        <div>{content}</div>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      )}
      <p className="pointer-events-none absolute bottom-2.5 left-5 text-[10px] font-normal tracking-[0.1em] text-zinc-400 sm:left-6">
        {stage.evidenceCaption.toUpperCase()}
      </p>
    </div>
  );
}
