"use client";

import { useId, useState } from "react";
import { Check, ChevronRight, RotateCcw, type LucideIcon } from "lucide-react";
import {
  BRAND_TIERS,
  BRAND_TIER_ORDER,
  CATEGORIES,
  CATEGORY_ORDER,
  CONDITIONS,
  CONDITION_ORDER,
  PHOTO_TIERS,
  PHOTO_TIER_ORDER,
  type Selections,
} from "./data";
import { ACCENT, ACCENT_SOFT_BG, FOCUS } from "./ui";

interface Option {
  id: string;
  label: string;
  subtitle?: string;
  icon: LucideIcon;
}

interface StepDef {
  step: 1 | 2 | 3 | 4;
  key: keyof Selections;
  title: string;
  hint: string;
  options: Option[];
}

const STEPS: StepDef[] = [
  {
    step: 1,
    key: "category",
    title: "Category",
    hint: "What are you listing?",
    options: CATEGORY_ORDER.map((id) => ({ id, label: CATEGORIES[id].label, icon: CATEGORIES[id].icon })),
  },
  {
    step: 2,
    key: "condition",
    title: "Condition",
    hint: "Grade it the way you'd grade it in hand.",
    options: CONDITION_ORDER.map((id) => ({ id, label: CONDITIONS[id].label, icon: CONDITIONS[id].icon })),
  },
  {
    step: 3,
    key: "brand",
    title: "Brand tier",
    hint: "Where the label sits in the market.",
    options: BRAND_TIER_ORDER.map((id) => ({
      id,
      label: BRAND_TIERS[id].label,
      subtitle: BRAND_TIERS[id].description,
      icon: BRAND_TIERS[id].icon,
    })),
  },
  {
    step: 4,
    key: "photos",
    title: "Photos",
    hint: "More photos, stronger buyer confidence.",
    options: PHOTO_TIER_ORDER.map((id) => ({
      id,
      label: PHOTO_TIERS[id].label,
      subtitle: PHOTO_TIERS[id].caption,
      icon: PHOTO_TIERS[id].icon,
    })),
  },
];

function labelFor(stepDef: StepDef, selections: Selections): string {
  const currentId = selections[stepDef.key];
  const match = stepDef.options.find((o) => o.id === currentId);
  return match ? match.label : "";
}

function iconFor(stepDef: StepDef, selections: Selections): LucideIcon {
  const currentId = selections[stepDef.key];
  const match = stepDef.options.find((o) => o.id === currentId);
  return match ? match.icon : stepDef.options[0].icon;
}

export function Wizard({
  selections,
  onSelect,
  onReset,
}: {
  selections: Selections;
  onSelect: (key: keyof Selections, value: string) => void;
  onReset: () => void;
}) {
  const [expanded, setExpanded] = useState<1 | 2 | 3 | 4>(1);
  const baseId = useId();
  const panelId = `${baseId}-panel`;

  const activeStep = STEPS[expanded - 1];

  const handlePick = (stepDef: StepDef, optionId: string) => {
    onSelect(stepDef.key, optionId);
    if (stepDef.step < 4) {
      setExpanded((stepDef.step + 1) as 1 | 2 | 3 | 4);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          Build your listing
        </p>
        <button
          type="button"
          onClick={onReset}
          className={`inline-flex items-center gap-1.5 rounded-sm text-[12px] font-semibold text-zinc-400 hover:text-zinc-200 ${FOCUS}`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset to defaults
        </button>
      </div>

      {/* Step tabs — always-visible step navigation. Each tab shows the step's
          current value even while collapsed, so the estimate below never
          goes stale relative to what's on screen. */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((stepDef) => {
          const isActive = stepDef.step === expanded;
          const Icon = iconFor(stepDef, selections);
          return (
            <button
              key={stepDef.key}
              type="button"
              aria-current={isActive ? "step" : undefined}
              aria-controls={panelId}
              onClick={() => setExpanded(stepDef.step)}
              className={`flex min-w-0 flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-colors ${FOCUS} ${
                isActive ? "border-2" : "border border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
              style={isActive ? { borderColor: ACCENT, backgroundColor: ACCENT_SOFT_BG } : undefined}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                Step {stepDef.step}
                {isActive ? <ChevronRight className="h-3 w-3" aria-hidden="true" /> : null}
              </span>
              <span className="flex min-w-0 items-center gap-1.5 text-sm font-bold text-white">
                <Icon className="h-4 w-4 shrink-0 text-[#AE9BFF]" aria-hidden="true" />
                <span className="truncate">{labelFor(stepDef, selections)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Active step panel */}
      <div id={panelId} className="mt-5">
        <p className="text-base font-bold text-white">
          Step {activeStep.step} of 4 — {activeStep.title}
        </p>
        <p className="mt-1 text-sm text-zinc-400">{activeStep.hint}</p>
        <div
          role="group"
          aria-label={`${activeStep.title} options`}
          className={`mt-4 grid gap-2.5 ${
            activeStep.options.length >= 6
              ? "grid-cols-2 sm:grid-cols-3"
              : activeStep.options.length === 4
                ? "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-3"
          }`}
        >
          {activeStep.options.map((option) => {
            const selected = selections[activeStep.key] === option.id;
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => handlePick(activeStep, option.id)}
                className={`flex min-w-0 flex-col items-start gap-2 rounded-xl border px-3 py-3 text-left transition-colors ${FOCUS} ${
                  selected
                    ? "border-2"
                    : "border border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
                style={selected ? { borderColor: ACCENT, backgroundColor: ACCENT_SOFT_BG } : undefined}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${selected ? "text-[#AE9BFF]" : "text-zinc-400"}`}
                    aria-hidden="true"
                  />
                  {selected ? (
                    <Check className="h-4 w-4 shrink-0 text-[#AE9BFF]" aria-hidden="true" />
                  ) : null}
                </span>
                <span className={`truncate text-sm ${selected ? "font-bold text-white" : "font-semibold text-zinc-200"}`}>
                  {option.label}
                </span>
                {option.subtitle ? (
                  <span className="text-[11px] leading-[1.4] text-zinc-400">{option.subtitle}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
