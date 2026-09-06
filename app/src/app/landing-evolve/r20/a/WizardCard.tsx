"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Check, BadgeCheck } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import {
  STEP_KEYS,
  STEP_QUESTIONS,
  CATEGORIES,
  CONDITIONS,
  TIERS,
  BANDS,
  type Answers,
  type Estimate,
  type StepKey,
  type CategoryDef,
} from "./data";

const FOCUS_LIGHT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A5C]";

interface Option {
  id: string;
  label: string;
  icon?: CategoryDef["icon"];
}

function getOptions(key: StepKey): Option[] {
  if (key === "category") return CATEGORIES.map((c) => ({ id: c.id, label: c.label, icon: c.icon }));
  if (key === "condition") return CONDITIONS.map((c) => ({ id: c.id, label: c.label }));
  if (key === "tier") return TIERS.map((t) => ({ id: t.id, label: t.label }));
  return BANDS.map((b) => ({ id: b.id, label: b.label }));
}

function labelFor(key: StepKey, id?: string): string | undefined {
  if (!id) return undefined;
  const opt = getOptions(key).find((o) => o.id === id);
  return opt?.label;
}

export interface WizardCardProps {
  answers: Answers;
  estimate: Estimate;
  activeStep: number;
  onSelect: (stepIndex: number, key: StepKey, value: string) => void;
  onBack: () => void;
  onJump: (stepIndex: number) => void;
  onReset: () => void;
}

export default function WizardCard({ answers, estimate, activeStep, onSelect, onBack, onJump, onReset }: WizardCardProps) {
  const isComplete = activeStep >= STEP_KEYS.length;
  const currentKey = !isComplete ? STEP_KEYS[activeStep] : undefined;
  const question = currentKey ? STEP_QUESTIONS[currentKey] : undefined;
  const options = currentKey ? getOptions(currentKey) : [];
  const currentValue = currentKey ? answers[currentKey] : undefined;
  const titleId = `wizard-step-title-${activeStep}`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
      <div role="group" aria-label="Estimate wizard progress" className="flex flex-wrap items-center gap-2">
        {STEP_KEYS.map((key, i) => {
          const answered = Boolean(answers[key]);
          const isActive = activeStep === i;
          const reachable = i <= estimate.answeredCount;
          return (
            <button
              key={key}
              type="button"
              disabled={!reachable}
              onClick={() => onJump(i)}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Step ${i + 1} of 4: ${STEP_QUESTIONS[key].title}${answered ? " — answered" : ""}`}
              className={`flex h-7 w-7 items-center justify-center rounded-full disabled:cursor-not-allowed ${FOCUS_LIGHT}`}
            >
              <span
                aria-hidden="true"
                className={`block h-2.5 w-2.5 rounded-full transition-transform duration-200 ${
                  answered ? "bg-[#1F7A5C]" : "bg-zinc-300"
                } ${isActive ? "scale-125" : ""}`}
              />
            </button>
          );
        })}
        <span className="ml-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600 tabular-nums">
          Step {Math.min(activeStep + 1, 4)} of 4
        </span>
      </div>

      {!isComplete && question && currentKey ? (
        <div className="mt-5">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={onBack}
              className={`mb-3 inline-flex items-center gap-1 rounded text-[13px] font-medium text-zinc-600 hover:text-[#121214] ${FOCUS_LIGHT}`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
          )}
          <h2 id={titleId} className="text-[19px] font-bold leading-tight tracking-[-0.02em] text-[#121214]">
            {question.title}
          </h2>
          <p className="mt-1 text-[13px] leading-[1.6] text-zinc-600">{question.subtitle}</p>
          <div
            role="group"
            aria-labelledby={titleId}
            className={`mt-4 grid gap-2.5 ${currentKey === "category" ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {options.map((opt) => {
              const selected = currentValue === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelect(activeStep, currentKey, opt.id)}
                  aria-pressed={selected}
                  className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[14px] font-medium transition-colors ${FOCUS_LIGHT} ${
                    selected
                      ? "border-[#1F7A5C] bg-[#1F7A5C]/[0.07] text-[#121214]"
                      : "border-zinc-200 bg-white text-[#121214] hover:border-zinc-300"
                  }`}
                >
                  {opt.icon && (
                    <CategoryIcon
                      icon={opt.icon}
                      className={`h-4 w-4 shrink-0 ${selected ? "text-[#1F7A5C]" : "text-zinc-500"}`}
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                  {selected && <Check className="h-4 w-4 shrink-0 text-[#1F7A5C]" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1F7A5C]">
            <Check className="h-4 w-4" aria-hidden="true" />
            All four answers in
          </p>
          <h2 className="mt-1 text-[19px] font-bold tracking-[-0.02em] text-[#121214]">Here&apos;s your estimate</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {STEP_KEYS.map((key) => {
              const text = labelFor(key, answers[key]);
              if (!text) return null;
              return (
                <span
                  key={key}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[12px] font-medium text-zinc-600"
                >
                  {text}
                </span>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onJump(0)}
              className={`rounded text-[13px] font-medium text-zinc-600 underline underline-offset-4 hover:text-[#121214] ${FOCUS_LIGHT}`}
            >
              Edit answers
            </button>
            <button
              type="button"
              onClick={onReset}
              className={`rounded text-[13px] font-medium text-zinc-600 underline underline-offset-4 hover:text-[#121214] ${FOCUS_LIGHT}`}
            >
              Start over
            </button>
          </div>
        </div>
      )}

      <div aria-live="polite" className="mt-6 border-t border-zinc-200 pt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-600">Live estimate</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${estimate.low}-${estimate.high}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            className="mt-2 text-[34px] font-bold leading-none tracking-[-0.02em] text-[#121214] tabular-nums"
          >
            ${estimate.low.toLocaleString("en-US")}–${estimate.high.toLocaleString("en-US")}
          </motion.p>
        </AnimatePresence>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-zinc-600">
          <span className="font-medium tabular-nums text-[#121214]">{estimate.comps.toLocaleString("en-US")}</span>
          <span>comparable sales</span>
          <span aria-hidden="true" className="text-zinc-300">
            ·
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-[#1F7A5C]">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {estimate.confidence}
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={estimate.reasoning}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.32 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="mt-3 text-[13px] leading-[1.6] text-zinc-600"
          >
            {estimate.reasoning}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
