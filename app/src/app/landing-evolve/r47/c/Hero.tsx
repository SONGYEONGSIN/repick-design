import { ArrowRight } from "lucide-react";
import AllocationFlow from "./AllocationFlow";
import type { StrictnessId } from "./data";
import { ACCENT_BG, ACCENT_SMALL_TEXT, FOCUS, HEADLINE_FONT, MUTED_TEXT } from "./tokens";

interface HeroProps {
  strictnessId: StrictnessId;
  onChangeStrictness: (id: StrictnessId) => void;
}

/**
 * Hero: eyebrow, H1, subhead, single CTA, and the Allocation Flow device — all in
 * this one component, so the device and its derived summary render inside the Hero
 * at scroll-0, not in a separate section below it. Asymmetric left-aligned, clamp()
 * headline. Font-size/width math for the subhead: 17px -> 0.44*17 = 7.48px/char ->
 * max-w-[520px] -> 520 / 7.48 ≈ 69.5 chars/line (target ~70, under the 75 ceiling).
 * The headline clamp is deliberately capped lower than this catalog's usual max
 * (3.75rem vs a more typical 4.5rem) specifically to budget vertical space so the
 * device + its summary still clear the fold at 1280/1440/1920.
 */
export default function Hero({ strictnessId, onChangeStrictness }: HeroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:pb-20">
      <div className="max-w-[720px]">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${ACCENT_SMALL_TEXT}`}>
          Inbound triage
        </p>
        <h1
          className="mt-3 text-[clamp(2.25rem,1.3rem+3.4vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#171717]"
          style={HEADLINE_FONT}
        >
          See where every item actually goes.
        </h1>
        <p className={`mt-4 max-w-[520px] text-[17px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
          Run it through the same inspection pipeline buyers trust, before you ever list it —
          and watch the expected payout move as you tighten or relax the bar.
        </p>
        <a
          href="#closing-cta"
          className={`mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white ${ACCENT_BG} ${FOCUS}`}
        >
          Start selling on repick
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div id="hero-allocation-flow" className="mt-8 min-w-0">
        <AllocationFlow strictnessId={strictnessId} onChangeStrictness={onChangeStrictness} />
      </div>
    </section>
  );
}
