import { motion, useReducedMotion } from "framer-motion";
import { Gauge, ListChecks, ShieldHalf } from "lucide-react";

import { type Active, CATEGORIES, LISTINGS, PASS_THRESHOLD, activeCount, computeScore, median } from "./data";

const monoFont = { fontFamily: "var(--font-display-mono)" };

interface ValueSplitProps {
  active: Active;
}

export default function ValueSplit({ active }: ValueSplitProps) {
  const prefersReducedMotion = useReducedMotion();
  const scores = LISTINGS.map((l) => computeScore(l, active));
  const passCount = scores.filter((s) => s >= PASS_THRESHOLD).length;
  const med = median(scores);
  const nActive = activeCount(active);
  const offCategories = CATEGORIES.filter((c) => !active[c.id]);

  const panels = [
    {
      icon: ShieldHalf,
      label: "Pass rate",
      value: `${passCount}/6`,
      body: `${passCount} of 6 catalog listings clear every check you currently have switched on. The other ${
        6 - passCount
      } sit in review, waiting on a human to look at what the pipeline flagged.`,
    },
    {
      icon: Gauge,
      label: "Median trust score",
      value: `${med}`,
      body: "The midpoint across the whole catalog under your current settings — half the listings score above this line, half below it.",
    },
    {
      icon: ListChecks,
      label: "Checks running",
      value: `${nActive}/4`,
      body:
        offCategories.length === 0
          ? "All four checks are active. This is the pipeline at full strength."
          : `${offCategories.map((c) => c.label).join(" and ")} ${offCategories.length > 1 ? "are" : "is"} switched off — those listings clear on fewer signals.`,
    },
  ];

  return (
    <section className="border-b border-zinc-800/80 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[12px] font-semibold uppercase text-amber-300" style={{ letterSpacing: "0.28em", ...monoFont }}>
          Live from your settings
        </p>
        <h2 className="mt-3 max-w-[560px] text-[28px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[34px]">
          The toggles above aren&apos;t decoration — this is what they change.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {panels.map((panel, i) => {
            const Icon = panel.icon;
            return (
              <motion.div
                key={panel.label}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : i * 0.08 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6"
              >
                <Icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                <p className="mt-4 text-[13px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.1em" }}>
                  {panel.label}
                </p>
                <p className="mt-1 text-[40px] font-extrabold leading-none text-white" style={monoFont}>
                  {panel.value}
                </p>
                <p className="mt-3 max-w-[380px] text-[13.5px] leading-[1.6] text-zinc-400">{panel.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
