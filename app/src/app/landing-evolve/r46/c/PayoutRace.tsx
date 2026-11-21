"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import { Zap, Clock3, Flag, RotateCcw, Package } from "lucide-react";
import {
  DURATION_MS,
  DEFAULT_PROGRESS,
  SALE_AMOUNTS,
  payoutFor,
  type Tier,
} from "./data";
import {
  instantEtaLabel,
  standardEtaLabel,
  instantOutcomeSentence,
  standardOutcomeSentence,
} from "./race-math";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { ACCENT_BG, ACCENT_SMALL_TEXT, MUTED_TEXT, TRACK_BG_CLASS, FOCUS } from "./tokens";

type RaceStatus = "idle" | "running" | "done";

interface PayoutRaceProps {
  saleAmount: number;
  onSaleAmountChange: (amount: number) => void;
  selectedTier: Tier;
  onSelectTier: (tier: Tier) => void;
  onRaceComplete: (instantPayout: number) => void;
}

/**
 * The core device: two horizontal tracks racing toward a finish line at genuinely
 * different, concurrent real-time speeds — Instant finishes in ~2.2s, Standard keeps
 * crawling for ~9.5s. Not a gauge, not a reorder, not a scroll-tied timeline: a
 * user-triggered, side-by-side completion race with a live per-track ETA readout.
 */
export default function PayoutRace({
  saleAmount,
  onSaleAmountChange,
  selectedTier,
  onSelectTier,
  onRaceComplete,
}: PayoutRaceProps) {
  const [status, setStatus] = useState<RaceStatus>("idle");
  const [progressInstant, setProgressInstant] = useState(DEFAULT_PROGRESS.instant);
  const [progressStandard, setProgressStandard] = useState(DEFAULT_PROGRESS.standard);
  const [resultText, setResultText] = useState<string>(
    "Default view: an instant payout that already arrived, next to a standard payout partway through its three-day wait.",
  );
  const reduceMotion = usePrefersReducedMotion();
  const instantControls = useRef<AnimationPlaybackControls | null>(null);
  const standardControls = useRef<AnimationPlaybackControls | null>(null);
  const liveRegionId = useId();

  useEffect(() => {
    return () => {
      instantControls.current?.stop();
      standardControls.current?.stop();
    };
  }, []);

  function finishRace() {
    setStatus("done");
    setResultText(`${instantOutcomeSentence()} ${standardOutcomeSentence()}`);
    onRaceComplete(payoutFor(saleAmount, "instant"));
  }

  function runRace() {
    if (status === "running") return;
    setStatus("running");
    setResultText("Simulating a sale now — both payout timers are running.");

    if (reduceMotion) {
      setProgressInstant(1);
      setProgressStandard(1);
      finishRace();
      return;
    }

    setProgressInstant(0);
    setProgressStandard(0);

    instantControls.current = animate(0, 1, {
      duration: DURATION_MS.instant / 1000,
      ease: "easeOut",
      onUpdate: (v) => setProgressInstant(v),
    });

    standardControls.current = animate(0, 1, {
      duration: DURATION_MS.standard / 1000,
      ease: "linear",
      onUpdate: (v) => setProgressStandard(v),
      onComplete: finishRace,
    });
  }

  const instantPayout = payoutFor(saleAmount, "instant");
  const standardPayout = payoutFor(saleAmount, "standard");
  const pickPayout = selectedTier === "instant" ? instantPayout : standardPayout;
  const pickWait = selectedTier === "instant" ? "45 seconds" : "3 business days";

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#E8E5E4] bg-[#F7F5F5] p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
          Live comparison
        </p>
        <p className={`text-[13px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
          Pick a sale amount and a payout tier, then simulate the sale to watch both
          tracks race to a finish line at their real relative speeds.
        </p>
      </div>

      {/* Sale amount selector */}
      <div role="group" aria-label="Choose a sale amount" className="flex flex-wrap gap-2">
        {SALE_AMOUNTS.map((amount) => {
          const active = amount === saleAmount;
          return (
            <button
              key={amount}
              type="button"
              aria-pressed={active}
              onClick={() => onSaleAmountChange(amount)}
              className={`tabular-nums rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${FOCUS} ${
                active
                  ? `${ACCENT_BG} border-transparent text-white`
                  : "border-[#D8D5D4] bg-white text-[#171717] hover:border-[#BE123C]"
              }`}
            >
              ${amount} sale
            </button>
          );
        })}
      </div>

      {/* Payout tier toggle */}
      <div role="group" aria-label="Choose your payout tier" className="flex gap-2">
        <TierButton
          tier="instant"
          icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />}
          label="Instant Payout"
          active={selectedTier === "instant"}
          onSelect={onSelectTier}
        />
        <TierButton
          tier="standard"
          icon={<Clock3 className="h-3.5 w-3.5" aria-hidden="true" />}
          label="Standard Payout"
          active={selectedTier === "standard"}
          onSelect={onSelectTier}
        />
      </div>

      <p className="tabular-nums text-[14px] font-normal leading-[1.5] text-[#171717]">
        At <span className="font-extrabold">${saleAmount}</span>, your pick (
        {selectedTier === "instant" ? "Instant" : "Standard"}) puts{" "}
        <span className="font-extrabold">${pickPayout}</span> in your account in{" "}
        <span className="font-semibold">{pickWait}</span>.
      </p>

      {/* The two race tracks */}
      <div className="flex flex-col gap-4">
        <Track
          tierLabel="Instant Payout"
          icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />}
          etaText={instantEtaLabel(progressInstant)}
          progress={progressInstant}
          variant="instant"
          payout={instantPayout}
        />
        <Track
          tierLabel="Standard Payout"
          icon={<Clock3 className="h-3.5 w-3.5" aria-hidden="true" />}
          etaText={standardEtaLabel(progressStandard)}
          progress={progressStandard}
          variant="standard"
          payout={standardPayout}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runRace}
          disabled={status === "running"}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity disabled:opacity-60 ${ACCENT_BG} ${FOCUS}`}
        >
          {status === "done" ? (
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Flag className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "running"
            ? "Simulating…"
            : status === "done"
              ? "Simulate another sale"
              : "Simulate a sale"}
        </button>
        <span className={`text-[12px] font-normal ${MUTED_TEXT}`}>
          Replays both tracks from the moment of sale.
        </span>
      </div>

      {/* Outcome announcement: visible text + aria-live, updated only on resolution. */}
      <p
        id={liveRegionId}
        role="status"
        aria-live="polite"
        className={`text-[12.5px] font-normal leading-[1.5] ${MUTED_TEXT}`}
      >
        {resultText}
      </p>
    </div>
  );
}

function TierButton({
  tier,
  icon,
  label,
  active,
  onSelect,
}: {
  tier: Tier;
  icon: ReactNode;
  label: string;
  active: boolean;
  onSelect: (tier: Tier) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(tier)}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${FOCUS} ${
        active
          ? `${ACCENT_BG} border-transparent text-white`
          : "border-[#D8D5D4] bg-white text-[#171717] hover:border-[#BE123C]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Track({
  tierLabel,
  icon,
  etaText,
  progress,
  variant,
  payout,
}: {
  tierLabel: string;
  icon: ReactNode;
  etaText: string;
  progress: number;
  variant: "instant" | "standard";
  payout: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 1000) / 10));
  const arrived = progress >= 1;

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#171717]">
          {icon}
          {tierLabel}
        </span>
        <span
          className={`tabular-nums text-[12px] font-semibold ${
            variant === "instant" ? ACCENT_SMALL_TEXT : MUTED_TEXT
          }`}
        >
          {arrived ? `$${payout} available` : etaText}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${tierLabel} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className={`relative h-3.5 w-full overflow-hidden rounded-full ${TRACK_BG_CLASS}`}
      >
        <div
          className={`h-full rounded-full ${variant === "instant" ? ACCENT_BG : "bg-[#171717]"}`}
          style={{
            width: `${pct}%`,
            backgroundImage:
              variant === "standard"
                ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 4px, transparent 4px, transparent 9px)"
                : undefined,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-1 flex items-center text-[#171717]/35"
        >
          <Flag className="h-3 w-3" aria-hidden="true" />
        </span>
        {variant === "standard" && !arrived && (
          <span
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 text-white"
            style={{ left: `calc(${pct}% - 8px)` }}
          >
            <Package className="h-2.5 w-2.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </div>
  );
}
