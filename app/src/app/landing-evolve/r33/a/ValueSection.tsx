'use client';

import Reveal from './Reveal';
import { COLORS } from './data';
import { CRITERIA, catalogClears, scoreTier, TOTAL_CATALOG_SIZE } from './orbit-math';

interface ValueSectionProps {
  weights: number[];
  score: number;
  leading: number;
}

/**
 * Three outcomes of the same weighting, all recomputed live from the
 * orbit's current state — not static lookups. The ranked list in the
 * third card is the same ordering the orbit's rings are drawing right
 * now, just spelled out as numbers.
 */
export default function ValueSection({ weights, score, leading }: ValueSectionProps) {
  const clears = catalogClears(score);
  const leadingCriterion = CRITERIA[leading];
  const ranked = CRITERIA.map((c, i) => ({ ...c, weight: weights[i] })).sort((a, b) => b.weight - a.weight);

  return (
    <section id="value" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex flex-col gap-3 sm:max-w-[560px]">
          <h2
            className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            Moving a priority is not cosmetic. It changes the math.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            Everything below answers to the same five sliders in the hero. Go back up,
            move one, and come back — these three numbers will have already changed.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Reveal delay={0}>
          <div
            className="flex h-full flex-col gap-3 rounded-2xl p-6"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: COLORS.accentTint }}>
              Composite score
            </p>
            <p
              className="tabular-nums text-[44px] font-extrabold leading-none tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
            >
              {score}
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
              {scoreTier(score)}, led by {leadingCriterion.label.toLowerCase()} at{' '}
              <span className="tabular-nums font-semibold" style={{ color: COLORS.fg }}>
                {weights[leading]}%
              </span>{' '}
              of the weight budget.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="flex h-full flex-col gap-3 rounded-2xl p-6"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: COLORS.accentTint }}>
              Catalog that clears
            </p>
            <p
              className="tabular-nums text-[44px] font-extrabold leading-none tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
            >
              {clears}
              <span className="text-[20px] font-semibold" style={{ color: COLORS.muted }}>
                {' '}
                / {TOTAL_CATALOG_SIZE}
              </span>
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
              Listings in today&apos;s catalog that would clear a 90-and-above match at this
              exact weighting — computed from the score above, not a separate guess.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            className="flex h-full flex-col gap-3 rounded-2xl p-6"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: COLORS.accentTint }}>
              Current ranking
            </p>
            <ul className="flex flex-col gap-2">
              {ranked.map((c, idx) => (
                <li key={c.id} className="flex items-center justify-between gap-3">
                  <span
                    className="text-[14px] font-semibold"
                    style={{ color: idx === 0 ? COLORS.fg : COLORS.muted }}
                  >
                    {idx + 1}. {c.label}
                  </span>
                  <span
                    className="tabular-nums text-[14px] font-semibold"
                    style={{ color: idx === 0 ? COLORS.accentTint : COLORS.muted }}
                  >
                    {c.weight}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
