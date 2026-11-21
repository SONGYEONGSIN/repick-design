import { CalendarRange, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { MUTED_TEXT } from "./tokens";

const COLUMNS = [
  {
    icon: CalendarRange,
    title: "Plan without surprises",
    body: "Fund a slow month and a busy one differently — there's no single number repick expects from you, only the curve you set.",
  },
  {
    icon: ShieldCheck,
    title: "Built for secondhand, not sticker price",
    body: "Every listing you can reach carries a condition grade and a seller verification check, before you ever open its photos.",
  },
  {
    icon: Sparkles,
    title: "Smarter matches the more you commit",
    body: "AI matching reads your budget shape alongside your saved preferences, so the pieces it surfaces stay inside what you've actually planned.",
  },
];

export default function ValueSplit() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <Reveal>
        <h2 className="max-w-[492px] text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em] text-white">
          One curve, three ways it pays off
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {COLUMNS.map((col, i) => {
          const Icon = col.icon;
          return (
            <Reveal key={col.title} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#23232C] bg-[#13131A] p-5">
                <Icon className="h-5 w-5 text-[#22D3EE]" aria-hidden="true" />
                <h3 className="text-base font-semibold text-white">{col.title}</h3>
                <p className={`text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>{col.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
