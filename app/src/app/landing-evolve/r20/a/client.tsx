"use client";

import { useState, useCallback } from "react";
import { MotionConfig } from "framer-motion";
import Nav from "./Nav";
import Hero from "./Hero";
import ProductGrid from "./ProductGrid";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import {
  computeEstimate,
  STEP_KEYS,
  type Answers,
  type StepKey,
  type CategoryId,
  type ConditionId,
  type TierId,
  type BandId,
} from "./data";

export default function LandingClient() {
  const [answers, setAnswers] = useState<Answers>({});
  const [activeStep, setActiveStep] = useState(0);

  const onSelect = useCallback((stepIndex: number, key: StepKey, value: string) => {
    setAnswers((prev) => {
      if (prev[key] === value) return prev;
      const next: Answers = { ...prev };
      if (key === "category") next.category = value as CategoryId;
      else if (key === "condition") next.condition = value as ConditionId;
      else if (key === "tier") next.tier = value as TierId;
      else next.band = value as BandId;
      for (let i = stepIndex + 1; i < STEP_KEYS.length; i++) {
        delete next[STEP_KEYS[i]];
      }
      return next;
    });
    setActiveStep(stepIndex + 1);
  }, []);

  const onBack = useCallback(() => {
    setActiveStep((s) => Math.max(0, s - 1));
  }, []);

  const onJump = useCallback((index: number) => {
    setActiveStep(Math.max(0, Math.min(index, STEP_KEYS.length)));
  }, []);

  const onReset = useCallback(() => {
    setAnswers({});
    setActiveStep(0);
  }, []);

  const estimate = computeEstimate(answers);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-[#FAFAF8]">
        <Nav />
        <main>
          <Hero
            answers={answers}
            estimate={estimate}
            activeStep={activeStep}
            onSelect={onSelect}
            onBack={onBack}
            onJump={onJump}
            onReset={onReset}
          />
          <ProductGrid answers={answers} />
          <SocialProof />
          <ClosingCTA estimate={estimate} />
        </main>
      </div>
    </MotionConfig>
  );
}
