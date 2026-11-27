import { ArrowRight } from "lucide-react";
import AllocationFlow from "./AllocationFlow";
import type { StrictnessId } from "./data";
import { ACCENT_BG, ACCENT_TINT_TEXT, FOCUS, HEADLINE_FONT, MUTED_TEXT } from "./tokens";

interface HeroProps {
  strictnessId: StrictnessId;
  onChangeStrictness: (id: StrictnessId) => void;
}

/**
 * Hero: eyebrow, single H1, subhead, one CTA, and the Sorting Yield device — all in
 * this one component, so the device and its live summary render inside the Hero at
 * scroll position zero rather than in a section below it.
 *
 * Headline sizing is split by breakpoint on purpose rather than one unified
 * `clamp()`: below `lg` it's a fixed, conservative size (`text-[2.5rem] sm:text-
 * [3rem]`) that can never grow past what 375px comfortably wraps; at `lg` and up it
 * switches to a fluid `clamp()` for the larger desktop scale the brief wants. This
 * keeps the two concerns — "never overflow a narrow phone" and "look oversized on
 * desktop" — governed by two different rules instead of one curve tuned to satisfy
 * both at once.
 *
 * Subhead container width: 16px body text -> 0.44 * 16 = 7.04px/char -> max-w-[500px]
 * -> 500 / 7.04 ≈ 71.0 chars/line (target ~70, under the 75 ceiling).
 */
export default function Hero({ strictnessId, onChangeStrictness }: HeroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:pb-20">
      <div className="max-w-[720px]">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${ACCENT_TINT_TEXT}`}>
          Inbound triage
        </p>
        <h1
          className="mt-3 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#171717] sm:text-[3rem] lg:text-[clamp(3.25rem,2.75rem+2vw,4.5rem)]"
          style={HEADLINE_FONT}
        >
          See where every item actually lands.
        </h1>
        <p className={`mt-4 max-w-[500px] text-[16px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
          Run your batch through the same inspection pipeline buyers trust, before you
          ever list it — then watch the expected payout move as you tighten or relax
          the bar.
        </p>
        <a
          href="#closing-cta"
          className={`mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white ${ACCENT_BG} ${FOCUS}`}
        >
          List your batch today
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div id="hero-allocation-flow" className="mt-8 min-w-0">
        <AllocationFlow strictnessId={strictnessId} onChangeStrictness={onChangeStrictness} />
      </div>
    </section>
  );
}
