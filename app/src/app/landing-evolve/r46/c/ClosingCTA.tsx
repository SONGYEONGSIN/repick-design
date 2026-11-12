import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { BASE_WEEKLY_INSTANT_TOTAL } from "./data";
import { ACCENT_BG, FOCUS, MUTED_TEXT } from "./tokens";

/**
 * Single primary action. The dollar figure is the exact same
 * `BASE_WEEKLY_INSTANT_TOTAL + simulatedTotalAdded` state the race panel and
 * ValueSplit's tally use — not a separate static number — so this copy is never out
 * of sync with what the live device above actually showed. Lead line container:
 * text-[17px] -> 0.44*17=7.48px/char -> max-w-[520px] -> 520/7.48 ≈ 69.5 chars/line.
 */
export default function ClosingCTA({ simulatedTotalAdded }: { simulatedTotalAdded: number }) {
  const total = BASE_WEEKLY_INSTANT_TOTAL + simulatedTotalAdded;

  return (
    <section id="closing-cta" className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
      <Reveal>
        <div className="flex flex-col items-start gap-5 rounded-2xl border border-[#E8E5E4] bg-[#F7F5F5] p-8 sm:p-12">
          <h2 className="max-w-[600px] text-[26px] font-extrabold leading-[1.2] tracking-[-0.01em] text-[#171717] sm:text-[32px]">
            Join the sellers already paid{" "}
            <span className="tabular-nums">${total.toLocaleString("en-US")}</span> instantly this
            week.
          </h2>
          <p className={`max-w-[520px] text-[17px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
            That total updates live as you simulate a sale in the panel above. Create a listing
            and choose Instant Payout the moment it sells.
          </p>
          <a
            href="#hero-race-panel"
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
