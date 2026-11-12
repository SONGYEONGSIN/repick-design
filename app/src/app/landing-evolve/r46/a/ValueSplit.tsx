import { Clock3, ShieldCheck, Wallet } from "lucide-react";
import { Reveal } from "./Reveal";
import { formatPct, formatUsd } from "./data";
import { CAPTION, DISPLAY, MUTED_TEXT, PROSE_WIDTH_16 } from "./tokens";

interface ValueSplitProps {
  price: number;
  credit: number;
  conditionLabel: string;
  multiplier: number;
}

export function ValueSplit({ price, credit, conditionLabel, multiplier }: ValueSplitProps) {
  return (
    <section className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-10" aria-labelledby="value-heading">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="value-heading" className="sr-only">
          Why trade in through repick
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Reveal className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-[#15151C] p-6">
              <Clock3 className="h-5 w-5 text-sky-500" aria-hidden="true" />
              <p className={`${DISPLAY} text-lg font-extrabold text-[#F5F5F7]`}>Instant, not eventual</p>
              <p className={`${PROSE_WIDTH_16} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
                No photos to shoot, no listing to babysit. The number repick quotes is the number
                you can spend today, the moment you accept it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-sky-500/30 bg-[#12161A] p-6">
              <Wallet className="h-5 w-5 text-sky-500" aria-hidden="true" />
              <p className={`${DISPLAY} text-lg font-extrabold text-[#F5F5F7]`}>Priced for the real condition</p>
              <p className={`${PROSE_WIDTH_16} tabular-nums text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
                A {conditionLabel.toLowerCase()}-condition item that cost {formatUsd(price)} earns{" "}
                {formatPct(multiplier)} back right now — that&apos;s{" "}
                <span className="tabular-nums font-semibold text-sky-300">{formatUsd(credit)}</span> in
                credit, live from the calculator above.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-[#15151C] p-6">
              <ShieldCheck className="h-5 w-5 text-sky-500" aria-hidden="true" />
              <p className={`${DISPLAY} text-lg font-extrabold text-[#F5F5F7]`}>Verified on both sides</p>
              <p className={`${PROSE_WIDTH_16} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
                Every seller on repick is identity-verified and every grade is checked against
                reference photos before a listing goes live.
              </p>
            </div>
          </Reveal>
        </div>
        <p className={`${CAPTION} ${MUTED_TEXT} mt-3`}>Figures shown mirror the calculator in the hero above — they move together.</p>
      </div>
    </section>
  );
}
