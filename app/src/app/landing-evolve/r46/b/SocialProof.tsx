import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "I rewrote the same jacket listing three times by hand and still hated it. The storytelling tone nailed it on the first try.",
    name: "Jin P.",
    detail: "Sold 14 items",
  },
  {
    quote:
      "The keyword chips are the part I didn't expect to use — I just copy the phrases into other marketplaces too.",
    name: "Ana R.",
    detail: "Sold 6 items",
  },
  {
    quote:
      "Concise mode reads like I actually wrote it. Detailed mode reads like I actually measured it.",
    name: "Theo M.",
    detail: "Sold 22 items",
  },
];

export function SocialProof() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-24 sm:px-6 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-display-mono)] text-[clamp(1.6rem,3vw,2.1rem)] font-semibold text-zinc-950">
          Sellers who stopped staring at a blank field
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} className="min-w-0" delay={i * 0.08}>
              <figure className="min-w-0 h-full rounded-2xl border border-zinc-200 bg-white p-6">
                <Quote className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                <blockquote className="mt-3 text-[14px] leading-[1.6] text-zinc-700">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 text-[13px] font-semibold text-zinc-900">
                  {t.name}
                  <span className="ml-1.5 font-medium text-zinc-500">· {t.detail}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
