import { ArrowRight } from "lucide-react";
import PayoutRace from "./PayoutRace";
import ProductCard from "./ProductCard";
import { PRODUCTS, type Tier } from "./data";
import { ACCENT_BG, ACCENT_SMALL_TEXT, FOCUS, MUTED_TEXT } from "./tokens";

interface HeroProps {
  saleAmount: number;
  onSaleAmountChange: (amount: number) => void;
  selectedTier: Tier;
  onSelectTier: (tier: Tier) => void;
  onRaceComplete: (instantPayout: number) => void;
}

/**
 * Hero: headline, subhead, primary CTA, the payout-tier toggle, the live race
 * tracks, and the product preview cards — all inside this one component, visible
 * without scrolling to a separate section below. Asymmetric left-aligned headline,
 * clamp()-scaled, Pretendard-only (no --font-display-* class anywhere, including the
 * H1 — this candidate's deliberate "no display face" choice). Subhead container:
 * text-[18px] -> 0.44*18=7.92px/char -> max-w-[560px] -> 560/7.92 ≈ 70.7 chars/line.
 */
export default function Hero({
  saleAmount,
  onSaleAmountChange,
  selectedTier,
  onSelectTier,
  onRaceComplete,
}: HeroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:pb-24">
      <div className="max-w-[720px]">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${ACCENT_SMALL_TEXT}`}>
          Seller payouts
        </p>
        <h1 className="mt-4 text-[clamp(2.4rem,1.6rem+4vw,4.5rem)] font-extrabold leading-[1.03] tracking-[-0.015em] text-[#171717]">
          Get paid the moment it sells — not three days later.
        </h1>
        <p className={`mt-5 max-w-[560px] text-[18px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
          repick settles most sales instantly by default. Sellers who&apos;d rather wait for a
          standard bank transfer still can — here&apos;s what that choice actually costs in time.
        </p>
        <a
          href="#closing-cta"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white ${ACCENT_BG} ${FOCUS}`}
        >
          Start selling on repick
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div id="hero-race-panel" className="mt-10 min-w-0">
        <PayoutRace
          saleAmount={saleAmount}
          onSaleAmountChange={onSaleAmountChange}
          selectedTier={selectedTier}
          onSelectTier={onSelectTier}
          onRaceComplete={onRaceComplete}
        />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
          Just sold near you
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
