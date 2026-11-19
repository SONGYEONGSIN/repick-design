import { Quote } from "lucide-react";
import { STATS, TESTIMONIALS } from "./data";
import { ACCENT_BASE, BODY_14, DISPLAY, Eyebrow, Reveal, SectionFolio } from "./ui";

export default function SocialProof() {
  return (
    <section className="border-b border-zinc-800 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <Eyebrow>Across every persona</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-bold tracking-[-0.02em] text-zinc-50">
                Sellers who've watched their own bar move.
              </h2>
            </div>
            <SectionFolio n="04" />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid grid-cols-2 gap-6 border-y border-zinc-800 py-8 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-bold tabular-nums text-zinc-50" style={DISPLAY}>
                  {stat.value}
                </p>
                <p className="mt-1 text-[12px] font-normal leading-[1.5] text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="min-w-0">
              <figure className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-800 p-6">
                <Quote className="h-5 w-5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT_BASE }} />
                <blockquote className={`mt-4 flex-1 ${BODY_14}`}>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[12px] font-semibold"
                    style={{ backgroundColor: ACCENT_BASE, color: "#18181B" }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold text-zinc-100">{t.name}</span>
                    <span className="block truncate text-[12px] font-normal text-zinc-400">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
