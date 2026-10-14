'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import ProductThumb from './ProductThumb';
import { COLORS, discountPercent, type Product } from './data';
import type { ChipId } from './reorder-math';

interface ProductCardProps {
  product: Product;
  match: number;
  rank: number;
  leadChipId: ChipId;
  /** 'compact' is the horizontal card used inside Hero (fits 3 above the fold).
   *  'expanded' is the fuller vertical card used in the Product Preview section. */
  variant: 'compact' | 'expanded';
}

/**
 * One card, two layouts, always the same live numbers. `rank`/`match` are
 * never read from a static field on `product` — both come from
 * `rankProducts()` in the parent, recomputed from the visitor's current
 * chip order on every render. `layout` + a shared `layoutId` is what makes
 * the grid visibly re-sort instead of silently jumping.
 */
export default function ProductCard({ product, match, rank, leadChipId, variant }: ProductCardProps) {
  const reduceMotion = useReducedMotion();
  const discount = discountPercent(product);
  const reasoning = product.reasoningByLeadChip[leadChipId];
  const isTop = rank === 1;

  const transition = reduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 38 };

  if (variant === 'compact') {
    return (
      <motion.article
        layout
        layoutId={`card-${product.id}`}
        transition={transition}
        className="flex flex-col gap-3 rounded-2xl p-3.5 sm:flex-row sm:items-center sm:gap-4"
        style={{
          backgroundColor: COLORS.surface,
          border: `1px solid ${isTop ? COLORS.accent : COLORS.surfaceLine}`,
        }}
      >
        <div className="w-16 shrink-0 sm:w-[72px]">
          <ProductThumb iconKey={product.iconKey} title={product.title} category={product.category} compact />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[14px] font-semibold leading-[1.3]" style={{ color: COLORS.fg }}>
              {product.title}
            </p>
            <span
              aria-hidden="true"
              className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ color: COLORS.accentTint, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              #{rank}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="tabular-nums rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
              style={{ backgroundColor: COLORS.accentFill }}
            >
              {match}% match
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ color: COLORS.fg, border: `1px solid ${COLORS.surfaceLine}` }}
            >
              Grade {product.conditionGrade}
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                color: product.verified ? COLORS.accentTint : COLORS.muted,
                border: `1px solid ${COLORS.surfaceLine}`,
              }}
            >
              {product.verified ? (
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ShieldOff className="h-3 w-3" aria-hidden="true" />
              )}
              {product.verified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <p className="tabular-nums text-[12px] font-normal" style={{ color: COLORS.muted }}>
            <span className="line-through">${product.priceBefore}</span>{' '}
            <span className="font-semibold" style={{ color: COLORS.fg }}>
              ${product.priceAfter}
            </span>{' '}
            ({discount}% off)
          </p>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      layoutId={`card-expanded-${product.id}`}
      transition={transition}
      className="flex h-full flex-col gap-4 rounded-2xl p-4"
      style={{
        backgroundColor: COLORS.surface,
        border: `1px solid ${isTop ? COLORS.accent : COLORS.surfaceLine}`,
      }}
    >
      <ProductThumb iconKey={product.iconKey} title={product.title} category={product.category} />

      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-[15px] font-semibold leading-[1.3]" style={{ color: COLORS.fg }}>
            {product.title}
          </p>
          <p className="text-[13px] font-normal" style={{ color: COLORS.muted }}>
            {product.category}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ color: COLORS.accentTint, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          Rank #{rank}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className="tabular-nums rounded-full px-2.5 py-1 text-[12px] font-semibold text-white"
          style={{ backgroundColor: COLORS.accentFill }}
        >
          {match}% match
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ color: COLORS.fg, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          Grade {product.conditionGrade}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{
            color: product.verified ? COLORS.accentTint : COLORS.muted,
            border: `1px solid ${COLORS.surfaceLine}`,
          }}
        >
          {product.verified ? (
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {product.verified ? 'Verified seller' : 'Unverified seller'}
        </span>
      </div>

      <p
        className="rounded-lg px-3 py-2 text-[12.5px] font-normal leading-[1.5]"
        style={{ color: COLORS.muted, backgroundColor: COLORS.bg, border: `1px solid ${COLORS.surfaceLine}` }}
      >
        <span className="font-semibold" style={{ color: COLORS.accentTint }}>
          Why it ranks here —
        </span>{' '}
        {reasoning}
      </p>

      <div className="mt-auto flex items-baseline gap-2 tabular-nums">
        <span className="text-[13px] font-normal line-through" style={{ color: COLORS.muted }}>
          ${product.priceBefore}
        </span>
        <span className="text-[18px] font-extrabold" style={{ color: COLORS.fg }}>
          ${product.priceAfter}
        </span>
        <span className="text-[13px] font-normal" style={{ color: COLORS.muted }}>
          ({discount}% off retail)
        </span>
      </div>
    </motion.article>
  );
}
