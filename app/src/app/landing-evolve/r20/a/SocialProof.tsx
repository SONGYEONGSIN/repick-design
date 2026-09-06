import { Quote } from "lucide-react";
import Reveal from "./Reveal";

const STATS = [
  { value: "128,400+", label: "Items resold to date" },
  { value: "4.8 / 5", label: "Average seller rating" },
  { value: "92%", label: "Estimates within 10% of final sale" },
  { value: "38,000+", label: "Verified sellers" },
];

const TESTIMONIALS = [
  {
    quote:
      "repick's estimate landed within $12 of what my jacket actually sold for. I didn't have to guess at a price.",
    name: "Priya N.",
    role: "Seller since 2024",
  },
  {
    quote: "The condition grade matched exactly what the buyer saw on arrival. No disputes, no reships.",
    name: "Marcus T.",
    role: "Verified seller",
  },
  {
    quote: "I compared a few categories before listing — the range narrowed every time I answered a question.",
    name: "Elena R.",
    role: "Repeat seller",
  },
];

export default function SocialProof() {
  return (
    <section className="bg-[#FAFAF8] px-6 py-24 lg:px-10 lg:py-32 xl:px-16">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#1F7A5C]">Trusted by sellers</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 border-b border-zinc-200 pb-16 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold tabular-nums tracking-[-0.02em] text-[#121214]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-zinc-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="min-w-0">
              <figure className="h-full min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
                <Quote className="h-5 w-5 text-[#1F7A5C]" aria-hidden="true" />
                <blockquote className="mt-3 text-[15px] font-normal leading-[1.6] text-[#121214]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 text-[13px] font-medium text-zinc-600">
                  {t.name} <span className="font-normal text-zinc-600">— {t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
