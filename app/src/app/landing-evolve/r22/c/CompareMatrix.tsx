"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Award, CheckCircle2, DollarSign, ShieldCheck, Sparkles, Truck, type LucideIcon } from "lucide-react";
import { CRITERIA, computeWinnerIds, orderCriteria, type Listing } from "./data";
import { ACCENT_BRIGHT_HEX, cx, NUM } from "./tokens";

const ROW_ICONS: Record<string, LucideIcon> = {
  price: DollarSign,
  grade: Award,
  verification: ShieldCheck,
  delivery: Truck,
  match: Sparkles,
};

const LABEL_COL_PCT = 30;

interface CompareMatrixProps {
  listings: Listing[];
  sortByGap: boolean;
}

/**
 * The hero's core proof device: one semantic table, columns = whichever 1-3 listings are currently
 * selected, rows = fixed comparison criteria. `table-fixed` + a `<colgroup>` computed from the live
 * column count keeps every width step (1, 2 or 3 columns) resolving to 100% with no `min-width`
 * anywhere — per the brief's width rule, if a min-width is ever needed it belongs on `<table>` itself,
 * never a cell; here the fixed layout makes one unnecessary at any of the required breakpoints,
 * including 390px (cells wrap their text rather than force horizontal scroll).
 */
export default function CompareMatrix({ listings, sortByGap }: CompareMatrixProps) {
  const reduceMotion = useReducedMotion();
  const rows = orderCriteria(CRITERIA, listings, sortByGap);
  const dataColPct = (100 - LABEL_COL_PCT) / Math.max(listings.length, 1);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only font-normal">
          Side-by-side comparison of the {listings.length} listing
          {listings.length === 1 ? "" : "s"} currently selected. Select or clear a listing above to
          add or remove its column; the most favorable value in each row is marked Best.
        </caption>
        <colgroup>
          <col style={{ width: `${LABEL_COL_PCT}%` }} />
          {listings.map((l) => (
            <col key={l.id} style={{ width: `${dataColPct}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-[#1C1C22]">
            <th scope="col" className="py-2.5 pr-2 align-bottom text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              Criteria
            </th>
            {listings.map((l) => (
              <th
                key={l.id}
                scope="col"
                className="min-w-0 px-2 py-2.5 align-bottom text-[11px] font-semibold leading-[1.3] text-white"
              >
                <span className="block truncate">{l.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((criterion) => {
            const winners = computeWinnerIds(criterion, listings);
            const Icon = ROW_ICONS[criterion.id];
            return (
              <tr key={criterion.id} className="border-b border-[#1C1C22]">
                <th
                  scope="row"
                  className="py-3 pr-2 align-top text-[11.5px] font-semibold leading-[1.3] text-zinc-300"
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_BRIGHT_HEX }} aria-hidden="true" />
                    <span>{criterion.label}</span>
                  </span>
                  <span className="sr-only font-normal"> — {criterion.helper}</span>
                </th>
                {listings.map((l) => {
                  const isWinner = listings.length > 1 && winners.includes(l.id);
                  return (
                    <td
                      key={l.id}
                      className={cx("min-w-0 px-2 py-3 align-top", isWinner && "rounded-lg")}
                      style={isWinner ? { backgroundColor: "rgba(204,22,65,0.16)" } : undefined}
                    >
                      <motion.div
                        key={`${l.id}-${criterion.id}-${listings.length}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className={cx(NUM, "break-words text-[12.5px] font-semibold text-white")}>
                          {criterion.format(l)}
                        </p>
                        <p className="mt-0.5 break-words text-[10px] font-normal leading-[1.4] text-zinc-400">
                          {criterion.sub(l)}
                        </p>
                        {isWinner && (
                          <span
                            className="mt-1.5 inline-flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.06em]"
                            style={{ color: ACCENT_BRIGHT_HEX }}
                          >
                            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                            Best
                          </span>
                        )}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
