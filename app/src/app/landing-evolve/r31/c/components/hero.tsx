import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { computeEstimate, type Selections } from "./data";
import { DISPLAY_FONT, Eyebrow, FOCUS } from "./ui";
import { Wizard } from "./wizard";
import { PayoutPanel } from "./payout-panel";

export function Hero({
  selections,
  onSelect,
  onReset,
}: {
  selections: Selections;
  onSelect: (key: keyof Selections, value: string) => void;
  onReset: () => void;
}) {
  const estimate = computeEstimate(selections);

  return (
    <section id="hero" className="relative bg-[#0B0B0F] pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[640px]">
          <Eyebrow>SELL WITH REPICK</Eyebrow>
          <h1
            className="mt-5 text-[clamp(2.5rem,2.1rem+2.6vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.02em] text-white"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Price it, grade it, get paid — before you scroll again.
          </h1>
          <p className="mt-6 max-w-[520px] text-lg leading-[1.6] text-zinc-300">
            Pick a category, a condition and a brand tier below. Our pricing engine prices
            your item against real recent sales and shows exactly what lands in your
            account, line by line.
          </p>
        </div>

        <div
          id="estimate"
          className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-8"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
            <Wizard selections={selections} onSelect={onSelect} onReset={onReset} />
          </div>

          <div className="flex flex-col gap-5">
            <PayoutPanel selections={selections} estimate={estimate} />
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <Link
                href="/catalog"
                className={`inline-flex items-center justify-center rounded-full bg-[#6D4AE0] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5B3BC4] ${FOCUS}`}
              >
                List your first item
              </Link>
              <p className="flex items-start gap-2 text-sm text-zinc-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                Every grade is double-checked before a buyer ever sees it, so the payout
                above rarely moves once your item is in hand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
