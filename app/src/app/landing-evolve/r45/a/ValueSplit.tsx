import { Calculator, FileText, Receipt as ReceiptIcon } from "lucide-react";
import Reveal from "./Reveal";
import { PLATFORM_FEE_RATE, SHIPPING_CREDIT, formatPct, formatUsd } from "./data";
import { DISPLAY, EYEBROW, GHOST_TEXT, MUTED_TEXT } from "./tokens";

const FEATURES = [
  {
    icon: Calculator,
    title: "One formula, every time",
    body: `The condition deduction and the ${formatPct(
      PLATFORM_FEE_RATE
    )} platform fee are fixed rates, published above, not a number decided after you list.`,
  },
  {
    icon: ReceiptIcon,
    title: "Five lines, no hidden sixth",
    body: "Listed price, condition deduction, platform fee, shipping credit, net payout — the receipt you see is the whole calculation, start to finish.",
  },
  {
    icon: FileText,
    title: `A ${formatUsd(SHIPPING_CREDIT)} credit, always included`,
    body: "Every payout gets the same flat shipping subsidy credited back, regardless of price or condition grade — it never has to be asked for.",
  },
];

export function ValueSplit() {
  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className={`${EYEBROW} text-sky-400`}>How the receipt is built</p>
            <h2
              className={`${DISPLAY} mt-3 max-w-[480px] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#F5F5F7] sm:text-4xl`}
            >
              Three fixed rules, one live price.
            </h2>
            <p className={`mt-4 max-w-[480px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Only the price and the grade you pick move. The deduction rate, the fee, and the
              shipping credit all stay exactly where they started.
            </p>
          </Reveal>

          <div aria-hidden="true" className="pointer-events-none hidden select-none items-start justify-end lg:col-span-6 lg:flex">
            <span
              className={`${DISPLAY} font-extrabold leading-none tracking-[-0.02em] ${GHOST_TEXT}`}
              style={{ fontSize: "clamp(6rem,11vw,9rem)" }}
            >
              {formatPct(PLATFORM_FEE_RATE)}
            </span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08} className="h-full min-w-0">
                <div className="flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <Icon className="h-5 w-5 text-sky-400" aria-hidden="true" />
                  <h3 className="text-base font-extrabold leading-[1.2] text-[#F5F5F7]">{f.title}</h3>
                  <p className={`max-w-[300px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
