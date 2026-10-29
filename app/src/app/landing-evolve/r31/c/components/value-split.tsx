import { Calculator, ReceiptText, Truck } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionIntro } from "./ui";

const COLUMNS = [
  {
    icon: Calculator,
    title: "How we price it",
    body:
      "Your category sets a baseline from recent comparable sales. Condition and brand tier scale it up or down, and a fuller photo set nudges it higher — buyers pay more for listings they can actually inspect.",
  },
  {
    icon: ReceiptText,
    title: "How the fee works",
    body:
      "Our fee is a percentage of the suggested price, and that percentage drops as brand tier rises — a Luxury item carries a smaller cut than a Standard one. Well-documented condition shaves a little more off.",
  },
  {
    icon: Truck,
    title: "How your payout lands",
    body:
      "Once a buyer's order is confirmed and the item passes grading, your payout clears to your linked account within two business days — no separate request needed.",
  },
] as const;

export function ValueSplit() {
  return (
    <section id="how" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="NO HIDDEN MATH"
          heading="The same formula, every time."
          body="There is no negotiation and no mystery deduction. The fee you see above is built from exactly these two rules, applied to your exact choices."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {COLUMNS.map((column, i) => {
            const Icon = column.icon;
            return (
              <Reveal key={column.title} delay={i * 0.08} className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 shrink-0 text-[#AE9BFF]" aria-hidden="true" />
                  <h3 className="text-base font-bold text-white">{column.title}</h3>
                </div>
                <p className="mt-3 max-w-[400px] text-sm leading-[1.6] text-zinc-400">{column.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
