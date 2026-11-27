"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  Camera,
  Check,
  ChevronDown,
  Gem,
  Landmark,
  Lock,
  Medal,
  RotateCcw,
  Truck,
  UserCheck,
  Undo2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import { FOCUS_RING } from "./styles";
import {
  CHECKLIST_ITEMS,
  DEFAULT_CHECKED,
  PERKS,
  type ChecklistItemId,
  daysToSellFor,
  nextTierInfo,
  scoreFor,
  tierFor,
  BASELINE_DAYS,
} from "./tier-logic";

const ICONS: Record<ChecklistItemId, typeof UserCheck> = {
  "id-verified": UserCheck,
  "photos-verified": Camera,
  "fast-ship": Truck,
  "return-policy": Undo2,
  "bank-linked": Landmark,
};

const TIER_ICONS: Record<string, typeof Medal> = {
  Bronze: Medal,
  Silver: Medal,
  Gold: Award,
  Platinum: Gem,
};

const PRESETS: { label: string; ids: ChecklistItemId[] }[] = [
  { label: "Just starting", ids: ["id-verified"] },
  { label: "Most sellers", ids: [...DEFAULT_CHECKED] },
  {
    label: "Power seller",
    ids: ["id-verified", "photos-verified", "fast-ship", "return-policy", "bank-linked"],
  },
];

function sameSet(a: ReadonlySet<ChecklistItemId>, b: ChecklistItemId[]): boolean {
  if (a.size !== b.length) return false;
  return b.every((id) => a.has(id));
}

export function SellerTierLadder({
  checked,
  onToggle,
  onSetAll,
}: {
  checked: ReadonlySet<ChecklistItemId>;
  onToggle: (id: ChecklistItemId) => void;
  onSetAll: (ids: ChecklistItemId[]) => void;
}) {
  const [openInfo, setOpenInfo] = useState<ChecklistItemId | null>(null);
  const reduce = useReducedMotion() === true;

  const score = useMemo(() => scoreFor(checked), [checked]);
  const tier = useMemo(() => tierFor(score), [score]);
  const nextInfo = useMemo(() => nextTierInfo(checked), [checked]);
  const days = useMemo(() => daysToSellFor(score), [score]);
  const deltaDays = BASELINE_DAYS - days;
  const TierIcon = TIER_ICONS[tier.name] ?? Medal;

  const perkState = { checked, score };

  return (
    <section id="tier-ladder" className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-4 text-[72px] font-medium tracking-[0.12em] text-zinc-500 sm:right-10 sm:text-[96px]"
      >
        02
      </span>

      <Reveal>
        <p className="text-[11px] font-medium tracking-[0.28em] text-[#7C3AED] uppercase">
          Seller trust
        </p>
        <h2
          style={{ fontFamily: "var(--font-display-mono)" }}
          className="mt-3 max-w-2xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.02em] text-[#16151C]"
        >
          Your trust score moves everything.
        </h2>
        <p className="mt-4 max-w-[480px] text-base leading-[1.6] text-zinc-700">
          Toggle the seller steps below. The tier badge, the trust meter, the unlocked perks, and
          the days-to-sell estimate all recompute live from this exact combination — not just the
          count of what you checked, but which items they are.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Part 1 — the checklist + presets */}
        <Reveal delay={0.05} className="min-w-0 lg:col-span-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 rounded-full bg-zinc-100 p-1">
              {PRESETS.map((preset) => {
                const active = sameSet(checked, preset.ids);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onSetAll(preset.ids)}
                    aria-pressed={active}
                    className={`${FOCUS_RING} rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      active ? "bg-white text-[#16151C] shadow-sm" : "text-zinc-600 hover:text-[#16151C]"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {CHECKLIST_ITEMS.map((item) => {
                const isChecked = checked.has(item.id);
                const Icon = ICONS[item.id];
                const expanded = openInfo === item.id;
                const labelId = `label-${item.id}`;
                const descId = `desc-${item.id}`;
                return (
                  <li
                    key={item.id}
                    className={`rounded-xl border p-3 transition-colors ${
                      isChecked ? "border-[#7C3AED]/35 bg-[#7C3AED]/5" : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isChecked}
                        aria-labelledby={labelId}
                        onClick={() => onToggle(item.id)}
                        className={`${FOCUS_RING} flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                          isChecked ? "border-[#7C3AED] bg-[#7C3AED]" : "border-zinc-300 bg-white"
                        }`}
                      >
                        {isChecked ? <Check aria-hidden="true" className="h-4 w-4 text-white" /> : null}
                      </button>

                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-600" />

                      <span id={labelId} className="min-w-0 flex-1 truncate text-sm font-medium text-[#16151C]">
                        {item.label}
                      </span>

                      <span className="shrink-0 text-[11px] font-medium tracking-[0.12em] text-zinc-600 uppercase">
                        {item.weight} pts
                      </span>

                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={descId}
                        aria-label={`Why ${item.label.toLowerCase()} matters`}
                        onClick={() => setOpenInfo(expanded ? null : item.id)}
                        className={`${FOCUS_RING} flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100`}
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded ? (
                        <motion.div
                          id={descId}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: reduce ? 0 : 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2 pl-9 text-sm leading-[1.6] text-zinc-600">{item.description}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => onSetAll([...DEFAULT_CHECKED])}
              className={`${FOCUS_RING} mt-4 flex items-center gap-1.5 rounded-md text-xs font-medium text-zinc-600 underline underline-offset-2 hover:text-[#16151C]`}
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Reset to recommended
            </button>
          </div>
        </Reveal>

        {/* Part 2 — tier badge + trust meter */}
        <Reveal delay={0.1} className="min-w-0 lg:col-span-3">
          <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7C3AED]/10">
              <TierIcon aria-hidden="true" className="h-7 w-7 text-[#5B21B6]" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] text-zinc-600 uppercase">
                Current tier
              </p>
              <p className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#16151C]">{tier.name}</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-zinc-600">Trust score</span>
                <span className="font-bold text-[#16151C]">{score}/100</span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={score}
                aria-label="Seller trust score"
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100"
              >
                <div
                  className="motion-reduce:transition-none h-full rounded-full bg-[#7C3AED] transition-[width] duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            <p className="text-xs leading-[1.6] font-medium text-zinc-600">
              {nextInfo.reached
                ? "You've reached the top tier — every benefit is unlocked."
                : `${nextInfo.needed} more step${nextInfo.needed === 1 ? "" : "s"} to reach ${nextInfo.nextTier.name}.`}
            </p>
          </div>
        </Reveal>

        {/* Part 3 — unlocked perks + days-to-sell projection */}
        <Reveal delay={0.15} className="min-w-0 lg:col-span-3">
          <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] text-zinc-600 uppercase">
                Est. days to sell
              </p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-[-0.02em] text-[#16151C]">{days}</span>
                <span className="text-sm font-medium text-zinc-600">days</span>
              </p>
              <p className="mt-1 text-xs font-medium text-zinc-600">
                {deltaDays > 0
                  ? `${deltaDays} day${deltaDays === 1 ? "" : "s"} faster than the marketplace baseline`
                  : "At the marketplace baseline"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-600 uppercase">
                Unlocked for you
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {PERKS.map((perk) => {
                  const unlocked = perk.unlocked(perkState);
                  return (
                    <li key={perk.id} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          unlocked ? "bg-[#7C3AED]/15" : "bg-zinc-100"
                        }`}
                      >
                        {unlocked ? (
                          <Check aria-hidden="true" className="h-3 w-3 text-[#5B21B6]" />
                        ) : (
                          <Lock aria-hidden="true" className="h-3 w-3 text-zinc-500" />
                        )}
                      </span>
                      <span className={`min-w-0 ${unlocked ? "font-medium text-[#16151C]" : "text-zinc-600"}`}>
                        {perk.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
