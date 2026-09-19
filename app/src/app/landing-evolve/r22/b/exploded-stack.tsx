"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ClipboardCheck,
  Fingerprint,
  Gauge,
  Scale,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import {
  computePrice,
  computeTrust,
  discountPct,
  ITEM,
  LAYERS,
  money,
  trustTier,
  type Layer,
  type LayerId,
} from "./data";

const LAYER_ICON: Record<LayerId, LucideIcon> = {
  photos: Camera,
  inspection: ClipboardCheck,
  authenticity: Fingerprint,
  benchmark: Scale,
  seller: UserCheck,
};

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDA4AF]";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-zinc-400";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-zinc-400";

/** Deterministic, non-trig fan offset for the index-th active layer card. */
function fanStyle(index: number, reduce: boolean) {
  if (reduce) return {};
  const tx = Math.min(index, 3) * 10;
  const ty = index * 6;
  const rot = index % 2 === 0 ? -1.5 : 1.5;
  return { transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, zIndex: index + 1 };
}

interface ExplodedStackProps {
  active: Set<LayerId>;
  previewId: LayerId | null;
  onToggle: (id: LayerId) => void;
  onPreviewStart: (id: LayerId) => void;
  onPreviewEnd: () => void;
  reduce: boolean;
}

export default function ExplodedStack({
  active,
  previewId,
  onToggle,
  onPreviewStart,
  onPreviewEnd,
  reduce,
}: ExplodedStackProps) {
  const trust = computeTrust(active);
  const price = computePrice(trust);
  const discount = discountPct(price);
  const tier = trustTier(trust);

  const previewActive = previewId !== null && !active.has(previewId);
  const previewSet = previewActive ? new Set([...active, previewId as LayerId]) : null;
  const previewTrust = previewSet ? computeTrust(previewSet) : null;
  const previewPrice = previewTrust !== null ? computePrice(previewTrust) : null;

  const activeLayersOrdered: Layer[] = LAYERS.filter((l) => active.has(l.id));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className={CAPTION}>Fig. 01 — Toggle any combination, in any order</p>
        <p className={STAT_LABEL}>
          <span className="tabular-nums">{active.size} OF {LAYERS.length}</span> LAYERS ON
        </p>
      </div>

      {/* -------------------------------------------------------------- toggles */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Inspection layers">
        {LAYERS.map((layer) => {
          const Icon = LAYER_ICON[layer.id];
          const on = active.has(layer.id);
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(layer.id)}
              onMouseEnter={() => onPreviewStart(layer.id)}
              onMouseLeave={onPreviewEnd}
              onFocus={() => onPreviewStart(layer.id)}
              onBlur={onPreviewEnd}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-semibold transition-colors ${FOCUS} ${
                on
                  ? "border-[#E11D48] bg-[#E11D48] text-white"
                  : "border-white/15 bg-white/[0.02] text-white hover:border-[#FDA4AF]/60 hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {layer.label}
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------- photo + stack */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-800">
            <Image
              src={`https://images.unsplash.com/photo-${ITEM.photoId}?auto=format&fit=crop&w=700&q=70`}
              alt={ITEM.alt}
              fill
              preload
              sizes="(min-width: 640px) 360px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-white">{ITEM.name}</p>
              <p className="text-[12px] font-normal text-zinc-400">{ITEM.detail}</p>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-white">
              Grade {ITEM.conditionGrade}
            </span>
          </div>
        </div>

        <div className="min-w-0 pr-8">
          <p className={STAT_LABEL}>EXPLODED EVIDENCE STACK</p>
          <div className="mt-2 flex flex-col">
            {active.size === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-4">
                <p className="text-[13px] font-semibold text-white">Baseline listing, no layers on</p>
                <p className="mt-1 text-[12px] font-normal leading-[1.6] text-zinc-400">
                  This is what an unverified listing looks like: {money(ITEM.floorPrice)} and a Trust Score of{" "}
                  {ITEM.baseTrust}/100. Switch on a layer above to build the case.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {activeLayersOrdered.map((layer, i) => {
                  const Icon = LAYER_ICON[layer.id];
                  return (
                    <motion.div
                      key={layer.id}
                      initial={reduce ? false : { opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      style={{ ...fanStyle(i, !!reduce), marginTop: i === 0 ? 0 : -10 }}
                      className="rounded-2xl border border-white/12 bg-[#0B0B0F] px-4 py-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-[#FDA4AF]" aria-hidden="true" />
                          {layer.label}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-[#FDA4AF]">
                          +{layer.weight} pts
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12px] font-normal leading-[1.55] text-zinc-400">
                        {layer.evidence}
                      </p>
                      <p className="mt-1.5 text-[11px] font-semibold tabular-nums text-white">{layer.stat}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          <p className="mt-3 min-h-[2.5rem] text-[12px] font-normal leading-[1.55] text-zinc-400" aria-live="polite">
            {previewActive && previewTrust !== null && previewPrice !== null
              ? `Preview: turning on ${LAYERS.find((l) => l.id === previewId)?.label} would move this to ${previewTrust}/100 and ${money(
                  previewPrice,
                )}. Click it to keep the change.`
              : `${tier.hint}`}
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------------- live stats */}
      <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 tabular-nums sm:grid-cols-3" aria-live="polite">
        <div>
          <dt className={STAT_LABEL}>
            <span className="inline-flex items-center gap-1">
              <Gauge className="h-3 w-3 text-[#FDA4AF]" aria-hidden="true" />
              TRUST SCORE
            </span>
          </dt>
          <dd
            className="mt-1 text-[clamp(1.6rem,4vw,2.1rem)] font-extrabold leading-none tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            {trust}
            <span className="text-[14px] font-normal text-zinc-400">/100</span>
          </dd>
          <dd className="mt-1 text-[12px] font-semibold text-[#FDA4AF]">{tier.label}</dd>
        </div>
        <div>
          <dt className={STAT_LABEL}>RESALE PRICE</dt>
          <dd
            className="mt-1 text-[clamp(1.6rem,4vw,2.1rem)] font-extrabold leading-none tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            {money(price)}
          </dd>
          <dd className="mt-1 text-[12px] font-normal text-zinc-400">retail {money(ITEM.retail)}</dd>
        </div>
        <div>
          <dt className={STAT_LABEL}>DISCOUNT VS RETAIL</dt>
          <dd
            className="mt-1 text-[clamp(1.6rem,4vw,2.1rem)] font-extrabold leading-none tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            {discount}%
          </dd>
          <dd className="mt-1 text-[12px] font-normal text-zinc-400">off original retail</dd>
        </div>
      </dl>
    </div>
  );
}
