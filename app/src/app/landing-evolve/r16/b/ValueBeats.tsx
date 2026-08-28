"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Tag, Target } from "lucide-react";
import { NEIGHBORHOOD, formatPrice, formatRadius, type Listing, type PriceBand } from "./data";

type ValueBeatsProps = {
  radiusKm: number;
  within: Listing[];
  top: Listing[];
  band: PriceBand | null;
};

export default function ValueBeats({ radiusKm, within, top, band }: ValueBeatsProps) {
  const reduce = useReducedMotion();

  const columns = [
    {
      icon: MapPin,
      value: `${within.length}`,
      label: "Comparables in range",
      description: `Verified sales within ${formatRadius(radiusKm)} km of ${NEIGHBORHOOD} right now.`,
    },
    {
      icon: Tag,
      value: band ? `${formatPrice(band.low)}–${formatPrice(band.high)}` : "—",
      label: "Price band",
      description: "The range real buyers paid for comparable condition at this distance.",
    },
    {
      icon: Target,
      value: `${top.length}`,
      label: "Top matches shown",
      description: "Ranked by fit first and proximity second, never the other way around.",
    },
  ];

  return (
    <section aria-labelledby="value-heading" className="border-b border-zinc-900 px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="value-heading" className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-white">
          Three numbers, one control.
        </h2>
        <p className="mt-3 max-w-[480px] text-[15px] leading-[1.6] text-zinc-300">
          Every card above is drawn from the radius you set. Nothing in this section is
          hardcoded &mdash; widen or narrow the search above and these figures move with it.
        </p>

        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
        >
          <dl className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-flow-col sm:grid-cols-3 sm:grid-rows-3 sm:gap-x-8 sm:gap-y-4">
            {columns.map((column) => {
              const Icon = column.icon;
              return (
                <Fragment key={column.label}>
                  <dt className="flex min-w-0 items-center gap-2 border-t border-zinc-800 pt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-lime-400" />
                    {column.label}
                  </dt>
                  <dd className="min-w-0 tabular-nums text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-none text-white">
                    {column.value}
                  </dd>
                  <dd className="min-w-0 text-[13px] leading-[1.6] text-zinc-400">{column.description}</dd>
                </Fragment>
              );
            })}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
