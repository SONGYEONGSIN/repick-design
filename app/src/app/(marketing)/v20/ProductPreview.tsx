import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, SearchCheck } from "lucide-react";

import { type Active, CATEGORIES, LISTINGS, computeScore, discountPct, scoreLabel } from "./data";
import { FOCUS_RING, StatusIcon } from "./ui";

const monoFont = { fontFamily: "var(--font-display-mono)" };

interface ProductPreviewProps {
  active: Active;
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ProductPreview({ active, selectedId, onSelect }: ProductPreviewProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="preview" className="border-b border-zinc-800/80 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase text-amber-300" style={{ letterSpacing: "0.28em", ...monoFont }}>
              The feed
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-tight text-white sm:text-[34px]">
              Six listings, always fully tagged.
            </h2>
          </div>
          <p className="max-w-[420px] text-[14px] leading-[1.6] text-zinc-400">
            Every card below carries its checks on its sleeve — no tapping through to find out
            why a listing is priced the way it is.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LISTINGS.map((listing, i) => {
            const score = computeScore(listing, active);
            const label = scoreLabel(score, Object.values(active).filter(Boolean).length);
            const discount = discountPct(listing);
            const Icon = listing.icon;
            const isFocused = listing.id === selectedId;

            return (
              <motion.article
                key={listing.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : Math.min(i, 3) * 0.06 }}
                className={`flex flex-col rounded-2xl border bg-zinc-950/50 p-5 ${
                  isFocused ? "border-amber-700" : "border-zinc-800"
                }`}
              >
                {/* image slot: no photography — a reserved, fixed-ratio icon panel */}
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <Icon className="h-10 w-10 text-zinc-400" aria-hidden="true" strokeWidth={1.5} />
                </div>

                {isFocused && (
                  <p className="mt-4 flex items-center gap-1 text-[11px] font-semibold uppercase text-amber-300" style={{ letterSpacing: "0.1em" }}>
                    <SearchCheck className="h-3 w-3" aria-hidden="true" />
                    Inspecting now
                  </p>
                )}
                <p className={`text-[12px] font-semibold uppercase text-zinc-400 ${isFocused ? "mt-1" : "mt-4"}`} style={{ letterSpacing: "0.1em" }}>
                  {listing.categoryLabel}
                </p>
                <h3 className="mt-1 text-[17px] font-semibold text-white">{listing.name}</h3>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[18px] font-extrabold text-white" style={monoFont}>
                    ${listing.price.toLocaleString("en-US")}
                  </span>
                  <span className="flex items-center gap-0.5 text-[12px] text-zinc-400">
                    {discount >= 0 ? (
                      <ArrowDownRight className="h-3 w-3 text-amber-300" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3 text-zinc-400" aria-hidden="true" />
                    )}
                    {Math.abs(discount)}% {discount >= 0 ? "under" : "over"} market
                  </span>
                </div>

                <p className="mt-1 text-[13px] text-zinc-400">{listing.conditionGrade}</p>

                {/* Badges live in their own row below the image slot, never on top of it */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const on = active[cat.id];
                    const result = on ? listing.results[cat.id] : "skipped";
                    return (
                      <span
                        key={cat.id}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${
                          result === "pass"
                            ? "border-amber-700/60 bg-amber-700/10 text-zinc-100"
                            : result === "hold"
                              ? "border-zinc-600 text-zinc-300"
                              : "border-dashed border-zinc-800 text-zinc-400"
                        }`}
                      >
                        <StatusIcon status={result} size="sm" />
                        {cat.short}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                  <div>
                    <p className="text-[11px] uppercase text-zinc-400" style={{ letterSpacing: "0.12em" }}>
                      Trust score
                    </p>
                    <p className="text-[15px] font-semibold text-white" style={monoFont}>
                      {score}/100 · <span className={label === "Clear" ? "text-amber-300" : "text-zinc-300"}>{label}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(listing.id);
                      const target = document.getElementById("pipeline");
                      target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-2 text-[13px] font-semibold text-zinc-100 transition-colors hover:border-amber-700 hover:text-white ${FOCUS_RING}`}
                  >
                    <SearchCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Inspect
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
