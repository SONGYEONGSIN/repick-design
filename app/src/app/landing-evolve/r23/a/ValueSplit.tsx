"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CAPTION, EYEBROW, FOCUS, STAGES, money, rangeWidth, type Stage } from "./data";

type CompareMode = "baseline" | "live";

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Column({
  label,
  value,
  unit,
  otherModeLabel,
  otherValue,
}: {
  label: string;
  value: string;
  unit?: string;
  otherModeLabel: string;
  otherValue: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#111116] p-6">
      <p className={CAPTION}>{label}</p>
      <p className="text-[34px] font-extrabold leading-none tabular-nums text-white">
        {value}
        {unit && <span className="ml-1 text-[16px] font-semibold text-zinc-400">{unit}</span>}
      </p>
      <p className="mt-1 text-[12px] font-normal leading-[1.5] text-zinc-400">
        {otherModeLabel}: <span className="font-semibold tabular-nums text-zinc-300">{otherValue}</span>
      </p>
    </div>
  );
}

export default function ValueSplit({ stageIndex }: { stageIndex: number }) {
  const [mode, setMode] = useState<CompareMode>("baseline");
  const baseline: Stage = STAGES[0];
  const live: Stage = STAGES[stageIndex];
  const current = mode === "baseline" ? baseline : live;
  const other = mode === "baseline" ? live : baseline;
  const otherLabel = mode === "baseline" ? `At stage ${live.index + 1} (${live.label})` : "Self-reported, no inspection";

  const confidenceOf = (s: Stage) => `${s.confidence}%`;
  const widthOf = (s: Stage) => (rangeWidth(s) === 0 ? "Exact" : money(rangeWidth(s)));
  const defectsOf = (s: Stage) => `${s.defectsLogged}`;

  return (
    <section id="value" className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1240px]">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={EYEBROW}>WHAT GRADING ACTUALLY BUYS YOU</p>
              <h2
                className="mt-4 max-w-[560px] text-[clamp(1.7rem,3.6vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-white"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                Compare this listing against itself.
              </h2>
            </div>
            <div role="group" aria-label="Compare mode" className="flex gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
              {(["baseline", "live"] as CompareMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${FOCUS} ${
                    mode === m ? "bg-[#7A5F28] text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {m === "baseline" ? "Self-reported" : `Graded (stage ${live.index + 1})`}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Column
            label="CONFIDENCE"
            value={confidenceOf(current)}
            otherModeLabel={otherLabel}
            otherValue={confidenceOf(other)}
          />
          <Column
            label="PRICE CERTAINTY"
            value={widthOf(current)}
            otherModeLabel={otherLabel}
            otherValue={widthOf(other)}
          />
          <Column
            label="FLAWS DISCLOSED PRE-SALE"
            value={defectsOf(current)}
            otherModeLabel={otherLabel}
            otherValue={defectsOf(other)}
          />
        </Reveal>
      </div>
    </section>
  );
}
