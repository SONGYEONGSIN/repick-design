'use client';

import Reveal from './Reveal';
import { COLORS, type Product } from './data';
import { CHIP_MAP, RANK_WEIGHTS, type ChipId, type Ranked } from './reorder-math';

interface ValueSectionProps {
  order: ChipId[];
  ranked: Ranked<Product>[];
  leadChipId: ChipId;
}

/**
 * Three outcomes of the current chip order, all recomputed live from
 * `ranked`/`order` — none of the three is a static lookup. Go back to the
 * hero, reorder a chip, and all three numbers below will already have
 * changed by the time you scroll back down.
 */
export default function ValueSection({ order, ranked, leadChipId }: ValueSectionProps) {
  const leadChip = CHIP_MAP[leadChipId];
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];
  const spread = top.match - bottom.match;
  const strongMatches = ranked.filter((r) => r.match >= 75).length;

  return (
    <section id="value" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex flex-col gap-3 sm:max-w-[500px]">
          <h2
            className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
          >
            Reordering a chip is not cosmetic. It changes the math.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            These three numbers answer to the same four chips as the hero. Move one,
            come back, and they will have already changed.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Reveal delay={0}>
          <div
            className="flex h-full flex-col gap-3 rounded-2xl p-6"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
              Top match, right now
            </p>
            <p
              className="tabular-nums text-[44px] font-extrabold leading-none tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
            >
              {top.match}%
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
              {top.product.title}, led by{' '}
              <span className="font-semibold" style={{ color: COLORS.fg }}>
                {leadChip.label.toLowerCase()}
              </span>{' '}
              at {RANK_WEIGHTS[0]}% of the weight.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="flex h-full flex-col gap-3 rounded-2xl p-6"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
              Spread, top to bottom
            </p>
            <p
              className="tabular-nums text-[44px] font-extrabold leading-none tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
            >
              {spread}
              <span className="text-[20px] font-semibold" style={{ color: COLORS.muted }}> pts</span>
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
              Separates {top.product.title} from {bottom.product.title} at this exact
              order — {strongMatches} of 3 listings currently clear a 75% match.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            className="flex h-full flex-col gap-3 rounded-2xl p-6"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
              Your current order
            </p>
            <ul className="flex flex-col gap-2">
              {order.map((chipId, idx) => (
                <li key={chipId} className="flex items-center justify-between gap-3">
                  <span
                    className="text-[14px] font-semibold"
                    style={{ color: idx === 0 ? COLORS.fg : COLORS.muted }}
                  >
                    {idx + 1}. {CHIP_MAP[chipId].label}
                  </span>
                  <span
                    className="tabular-nums text-[14px] font-semibold"
                    style={{ color: idx === 0 ? COLORS.accentTint : COLORS.muted }}
                  >
                    {RANK_WEIGHTS[idx]}%
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
