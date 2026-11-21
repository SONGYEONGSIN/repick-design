'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
import ProofCard from './ProofCard';
import { COLORS, PREVIEW_ITEMS } from './data';
import { TIERS } from './ladder-math';
import { useMounted } from './useMounted';

type SortKey = 'speed' | 'match';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'speed', label: 'Fastest to sell' },
  { key: 'match', label: 'Highest AI match' },
];

/**
 * The expanded view of three example listings. A second, independent
 * interaction lives here — a two-option sort toggle, distinct from the
 * ladder's radiogroup both in role (plain buttons with `aria-pressed`,
 * not `role="radio"`) and in what it controls (display order of a fixed
 * set, not a tier selection that recomputes the hero's numbers).
 */
export default function ProductPreview() {
  const [sortKey, setSortKey] = useState<SortKey>('speed');
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = mounted && !reduceMotion;

  const sorted = useMemo(() => {
    const items = [...PREVIEW_ITEMS];
    if (sortKey === 'speed') {
      items.sort((a, b) => TIERS[a.tierIndex].daysToSell - TIERS[b.tierIndex].daysToSell);
    } else {
      items.sort((a, b) => b.matchPercent - a.matchPercent);
    }
    return items;
  }, [sortKey]);

  return (
    <section id="preview" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-8 flex flex-col gap-3 sm:max-w-[500px]">
          <h2
            className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[30px]"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
          >
            What a verified listing actually shows a buyer.
          </h2>
          <p className="max-w-[490px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnBg }}>
            Three real example listings, graded the way every item on Repick
            is checked before it is allowed to go live.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.04}>
        <div role="group" aria-label="Sort example listings" className="mb-6 flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => {
            const pressed = sortKey === option.key;
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={pressed}
                onClick={() => setSortKey(option.key)}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: pressed ? COLORS.fg : COLORS.surface,
                  color: pressed ? '#FFFFFF' : COLORS.mutedOnSurface,
                  outlineColor: COLORS.accent,
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {sorted.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.08}>
            <motion.div
              className="h-full"
              whileHover={shouldAnimate ? { y: -4 } : undefined}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <ProofCard item={item} variant="expanded" />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
