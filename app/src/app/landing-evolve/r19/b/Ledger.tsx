"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Minus, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GradeBadge, LiveDot, MatchBadge, VerifiedBadge } from "./Badges";
import { flagship, offers, type Offer } from "./data";
import PhotoTile from "./PhotoTile";
import { rankOffers, type ScoredOffer, type Weights } from "./scoring";
import { ACCENT_TEXT, CARD, cx, FOCUS, MUTED, NUM, TRACK_CAPTION, TRACK_EYEBROW } from "./tokens";
import WeightControls from "./WeightControls";

const TH = "py-2 text-[10px] font-semibold uppercase text-zinc-600 whitespace-nowrap";

function DeltaChip({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
        <ArrowUp size={9} aria-hidden="true" />
        {`+${delta}`}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-700">
        <ArrowDown size={9} aria-hidden="true" />
        {delta}
      </span>
    );
  }
  return (
    <span className={cx("relative inline-flex items-center gap-0.5 text-[10px] font-semibold", MUTED)}>
      <Minus size={9} aria-hidden="true" />
      {"0"}
      {/* `relative` on this span, not the sr-only child, keeps the child's containing block right
          here — an absolutely-positioned sr-only node with no positioned ancestor of its own can
          otherwise escape to the document root and inflate scrollWidth at narrow viewports. */}
      <span className="sr-only">no change</span>
    </span>
  );
}

function LedgerRow({
  scored,
  delta,
  striped,
  expanded,
  onToggle,
  reduceMotion,
}: {
  scored: ScoredOffer;
  delta: number;
  striped: boolean;
  expanded: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
}) {
  const o: Offer = scored.offer;
  return (
    <>
      <motion.tr
        layout={!reduceMotion}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cx("border-b border-zinc-200", striped && "bg-zinc-50")}
      >
        <td className="py-3 pr-1 align-top">
          <div className="flex flex-col items-start gap-0.5">
            <span className={cx(NUM, "text-base font-extrabold text-zinc-900")}>{scored.rank}</span>
            <DeltaChip delta={delta} />
          </div>
        </td>
        <th scope="row" className="py-3 pr-1 align-top text-left font-semibold text-zinc-900">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                scored.rank === 1 ? "bg-[#92400E]" : "bg-zinc-600",
              )}
              aria-hidden="true"
            >
              {o.initials}
            </span>
            <span className="min-w-0 truncate text-xs sm:text-sm">{o.seller}</span>
          </div>
          {scored.rank === 1 && (
            <span
              className={cx(
                "mt-1 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                TRACK_CAPTION,
                ACCENT_TEXT,
              )}
            >
              Top match
            </span>
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`detail-${o.id}`}
            className={cx("mt-1 flex items-center gap-0.5 text-[10px] font-semibold text-zinc-600 hover:text-zinc-900", FOCUS)}
          >
            {expanded ? <ChevronDown size={11} aria-hidden="true" /> : <ChevronRight size={11} aria-hidden="true" />}
            {expanded ? "Hide reasoning" : "Why this rank"}
          </button>
        </th>
        <td className="py-3 pr-1 align-top">
          <span className={cx(NUM, "text-sm font-semibold text-zinc-900")}>${o.price.toLocaleString("en-US")}</span>
        </td>
        <td className="py-3 pr-1 align-top">
          <div className="flex flex-col gap-0.5 text-[10px] text-zinc-700 sm:text-[11px]">
            <span className="inline-flex items-center gap-1">
              <Truck size={11} className="shrink-0 text-zinc-500" aria-hidden="true" />
              <span className={NUM}>
                {o.shipDays}d ship
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={11} className="shrink-0 text-zinc-500" aria-hidden="true" />
              <span className={NUM}>{o.trust} trust</span>
            </span>
          </div>
        </td>
        <td className="py-3 pl-1 align-top text-right">
          <div className="flex flex-col items-end gap-0.5">
            <span className={cx(NUM, "text-sm font-extrabold text-zinc-900 sm:text-base")}>{scored.composite.toFixed(1)}</span>
            <span className="text-[10px] text-zinc-600">/ 100</span>
          </div>
        </td>
      </motion.tr>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.tr
            id={`detail-${o.id}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="border-b border-zinc-200 bg-zinc-50"
          >
            <td colSpan={5} className="px-1 py-3">
              <p className="text-[10px] font-semibold uppercase text-zinc-600 tracking-[0.16em]">AI match reasoning</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {o.reasoning.map((r) => (
                  <li key={r} className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-700">
                    {r}
                  </li>
                ))}
              </ul>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Ledger({ weights, onWeightsChange }: { weights: Weights; onWeightsChange: (w: Weights) => void }) {
  const reduceMotion = Boolean(useReducedMotion());
  const ranked = useMemo(() => rankOffers(offers, weights), [weights]);

  const prevOrderRef = useRef<string[]>(ranked.map((s) => s.offer.id));
  const deltas = useMemo(() => {
    const prev = prevOrderRef.current;
    const map: Record<string, number> = {};
    ranked.forEach((s) => {
      const prevIdx = prev.indexOf(s.offer.id);
      map[s.offer.id] = prevIdx === -1 ? 0 : prevIdx - (s.rank - 1);
    });
    return map;
  }, [ranked]);
  useEffect(() => {
    prevOrderRef.current = ranked.map((s) => s.offer.id);
  }, [ranked]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={cx(CARD, "min-w-0 p-5 sm:p-6")}>
      <div className="flex items-center gap-2">
        <LiveDot />
        <span className={cx("text-[11px] font-semibold uppercase text-zinc-600", TRACK_EYEBROW)}>Live order book</span>
      </div>

      <div className="mt-3 flex items-start gap-4">
        <PhotoTile icon={flagship.icon} className="h-16 w-16 sm:h-20 sm:w-20" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-xl">{flagship.title}</h2>
          <p className="mt-0.5 text-xs text-zinc-600 sm:text-sm">{flagship.spec}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <MatchBadge match={flagship.aiMatch} />
            <GradeBadge grade={flagship.grade} />
            <VerifiedBadge />
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600 sm:text-sm">
        Original retail <span className={cx(NUM, "text-zinc-500 line-through")}>${flagship.originalPrice.toLocaleString("en-US")}</span> ·{" "}
        {ranked.length} verified sellers hold an equivalent listing right now.
      </p>

      <div className="mt-5 border-t border-zinc-200 pt-5">
        <WeightControls weights={weights} onChange={onWeightsChange} />
      </div>

      <div className="mt-5 min-w-0 overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className={cx("mb-2 text-left text-[11px] font-normal uppercase text-zinc-600", TRACK_CAPTION)}>
            Fig. 01 — order book for {flagship.title}, ranked by composite score under the weights above
          </caption>
          <colgroup>
            <col style={{ width: "11%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "26%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className={TH}>
                Rank
              </th>
              <th scope="col" className={TH}>
                Seller
              </th>
              <th scope="col" className={TH}>
                Price
              </th>
              <th scope="col" className={TH}>
                Signals
              </th>
              <th scope="col" aria-sort="descending" className={cx(TH, "text-right")}>
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((s, i) => (
              <LedgerRow
                key={s.offer.id}
                scored={s}
                delta={deltas[s.offer.id] ?? 0}
                striped={i % 2 === 1}
                expanded={expandedId === s.offer.id}
                onToggle={() => setExpandedId((cur) => (cur === s.offer.id ? null : s.offer.id))}
                reduceMotion={reduceMotion}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
        Composite = (price weight × price score + speed weight × speed score + trust weight × trust score) ÷ total weight — recomputed on
        every change above, no page reload.
      </p>
    </div>
  );
}
