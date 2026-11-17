import { Quote, ShieldCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "I picked Harbor Row on the grid, saw the 2–4 PM window, and had the sneakers in hand before dinner.",
    name: "D. Okafor",
    detail: "4 trades · Harbor Row",
  },
  {
    quote:
      "The grade and match tags matched the shoe exactly. No surprises when I showed up to pick it up.",
    name: "R. Ibarra",
    detail: "11 trades · Midtown Exchange",
  },
  {
    quote:
      "Fee went up when I picked a farther zone, which made sense once I saw the distance on the map.",
    name: "S. Novak",
    detail: "2 trades · Old Mill Quarter",
  },
];

export default function SocialProof() {
  return (
    <section id="social-proof" aria-labelledby="social-proof-heading" className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="social-proof-heading"
            className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl"
          >
            Trusted by local traders
          </h2>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            04
          </span>
        </div>
        <p className="mt-2 max-w-[500px] text-xs text-zinc-500">
          A fixed set of past-trade quotes — this panel is a static snapshot
          and does not change when you pick a different zone above.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <Quote className="h-6 w-6 text-zinc-400" aria-hidden="true" />
              <blockquote className="mt-3 text-sm leading-[1.6] text-zinc-200">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                <span className="font-semibold text-zinc-300">{t.name}</span>
                <span aria-hidden="true">·</span>
                <span>{t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
