import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { STRICTNESS_PROFILES, type StrictnessId } from "./data";
import { expectedPayoutPerItem, sellThroughPercent } from "./flow-math";
import { ACCENT_BG, FOCUS, MUTED_TEXT } from "./tokens";

/**
 * Section 5: closing CTA. The dollar figure and strictness name are read live from
 * `strictnessId` via the same `expectedPayoutPerItem` function the hero device uses
 * — never a hardcoded literal — so this headline can never drift out of sync with
 * whatever the visitor last selected in the panel above. Lead line container: 17px
 * -> 0.44*17 = 7.48px/char -> max-w-[520px] -> 520 / 7.48 ≈ 69.5 chars/line.
 */
export default function ClosingCTA({ strictnessId }: { strictnessId: StrictnessId }) {
  const profile = STRICTNESS_PROFILES[strictnessId];
  const payout = expectedPayoutPerItem(profile.bands);
  const sellThrough = sellThroughPercent(profile.bands);

  return (
    <section id="closing-cta" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <div className="flex flex-col items-start gap-5 rounded-2xl border border-[#E7E4E3] bg-[#F6F4F4] p-8 sm:p-12">
          <h2 className="max-w-[600px] text-[26px] font-extrabold leading-[1.2] tracking-[-0.01em] text-[#171717] sm:text-[32px]">
            At {profile.label} strictness, that&apos;s{" "}
            <span className="tabular-nums">${payout}</span> expected per item at a{" "}
            <span className="tabular-nums">{sellThrough}%</span> sell-through rate.
          </h2>
          <p className={`max-w-[520px] text-[17px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
            That number updates live with the strictness panel above. Create a listing, pick your
            inspection depth, and get paid on the same terms you just saw.
          </p>
          <a
            href="#hero-allocation-flow"
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white ${ACCENT_BG} ${FOCUS}`}
          >
            Start selling on repick
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
