import { Zap, Clock3, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { VALUE_PROPS, BASE_WEEKLY_INSTANT_TOTAL } from "./data";
import { MUTED_TEXT, ACCENT_SMALL_TEXT } from "./tokens";

const ICONS = [Zap, Clock3, ShieldCheck];

/**
 * Three value props + a running tally the race above literally feeds: this is the
 * SAME state the Hero's race panel updates (passed down as `simulatedTotalAdded`),
 * not a separate static figure — and the Closing CTA below reads the identical total.
 * Body copy container width: text-[15px] -> 0.44*15=6.6px/char -> max-w-[460px] ->
 * 460 / 6.6 ≈ 69.7 chars/line (target ~70, under the 75 ceiling).
 */
export default function ValueSplit({ simulatedTotalAdded }: { simulatedTotalAdded: number }) {
  const total = BASE_WEEKLY_INSTANT_TOTAL + simulatedTotalAdded;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
      <Reveal>
        <h2 className="max-w-[460px] text-[28px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#171717] sm:text-[32px]">
          Why sellers choose instant
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {VALUE_PROPS.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <Reveal key={item.title} delay={i * 0.08} className="min-w-0">
              <div className="min-w-0 flex flex-col gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F5F5]">
                  <Icon className={`h-4 w-4 ${ACCENT_SMALL_TEXT}`} aria-hidden="true" />
                </span>
                <h3 className="text-[16px] font-semibold leading-snug text-[#171717]">
                  {item.title}
                </h3>
                <p className={`max-w-[460px] text-[15px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
                  {item.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2} className="mt-12">
        <div className="min-w-0 rounded-2xl border border-[#E8E5E4] bg-[#F7F5F5] p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
            Paid out instantly this week
          </p>
          <p className="tabular-nums mt-2 text-[34px] font-extrabold leading-none tracking-[-0.01em] text-[#171717] sm:text-[40px]">
            ${total.toLocaleString("en-US")}
          </p>
          <p className={`mt-2 max-w-[460px] text-[14px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
            {simulatedTotalAdded > 0
              ? `That includes $${simulatedTotalAdded.toLocaleString(
                  "en-US",
                )} from the sale(s) you simulated above — run it again and this number moves again.`
              : "This is this week's running total so far. Simulate a sale in the panel above and we'll add it to this number."}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
