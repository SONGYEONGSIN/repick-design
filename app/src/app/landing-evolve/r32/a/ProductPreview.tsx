'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronDown, ShoppingBag, Gem, Tag } from 'lucide-react';
import Reveal from './Reveal';
import { PREVIEW_ITEMS, GRADE_LABELS, discountPercent, type PreviewItem } from './data';

const TONE_STYLES: Record<PreviewItem['tone'], { bg: string; icon: string }> = {
  ink: { bg: 'bg-zinc-100', icon: 'text-zinc-500' },
  sky: { bg: 'bg-sky-50', icon: 'text-sky-600' },
  stone: { bg: 'bg-zinc-50', icon: 'text-zinc-400' },
};

const TONE_ICON: Record<PreviewItem['tone'], typeof ShoppingBag> = {
  ink: ShoppingBag,
  sky: Gem,
  stone: Tag,
};

function PreviewCard({ item, index }: { item: PreviewItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const discount = discountPercent(item.retailPrice, item.price);
  const tone = TONE_STYLES[item.tone];
  const Icon = TONE_ICON[item.tone];
  const panelId = `match-breakdown-${item.id}`;

  return (
    <Reveal delay={index * 0.07} className="min-w-0">
      <article className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white">
        <div
          className={`flex aspect-[4/3] w-full items-center justify-center rounded-t-2xl ${tone.bg}`}
        >
          <Icon className={`h-10 w-10 ${tone.icon}`} aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-[15px] font-semibold text-zinc-900">{item.name}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
              {GRADE_LABELS[item.grade]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
              <ShieldCheck className="h-3 w-3 text-sky-600" aria-hidden="true" />
              {item.sellerLabel}
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-[1.5] text-zinc-600">{item.matchTag}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[12px] tabular-nums text-zinc-500 line-through">
              ${item.retailPrice}
            </span>
            <span className="text-[16px] font-extrabold tabular-nums text-zinc-900">
              ${item.price}
            </span>
            <span className="text-[11px] font-semibold tabular-nums text-sky-700">
              {discount}% off
            </span>
          </div>

          <div className="mt-auto pt-3">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 transition-colors hover:border-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Match breakdown
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              </motion.span>
            </button>
            <div id={panelId} hidden={!expanded} className="mt-2 rounded-lg bg-zinc-50 p-3">
              <ul className="space-y-1.5 text-[12px] leading-[1.5] text-zinc-600">
                {item.matchReasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-sky-600" aria-hidden="true" />
                    {reason}
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-[11px] font-semibold tabular-nums text-sky-700">
                {item.matchPercent}% overall match
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function ProductPreview() {
  return (
    <section id="listings" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <div className="max-w-[640px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            Live comparables
          </div>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.02em] text-zinc-900"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            Each card carries its own evidence.
          </h2>
          <p className="mt-3 max-w-[520px] text-[17px] leading-[1.6] text-zinc-600">
            Grade, verification, and the retail-to-resale gap sit next to the match
            score — expand any card to see the signals behind that score.
          </p>
        </div>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PREVIEW_ITEMS.map((item, index) => (
          <PreviewCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
