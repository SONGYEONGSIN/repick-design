import { Star } from "lucide-react";
import { TESTIMONIALS, TRUST_STRIP } from "./data";
import { Reveal } from "./reveal";
import { EYEBROW, NUM } from "./tokens";

export function SocialProof() {
  return (
    <section id="reviews" className="border-b border-zinc-200">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className={`${EYEBROW} text-teal-700`}>Said by people who checked</p>
          <h2 className="mt-3 max-w-xl font-[var(--font-display-wide)] text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-zinc-950">
            The grade held up once money changed hands
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {TRUST_STRIP.map((stat) => (
            <div key={stat.label} className="min-w-0 rounded-2xl border border-zinc-200 p-5">
              <p className={`text-2xl font-extrabold text-zinc-950 ${NUM}`}>{stat.value}</p>
              <p className="mt-1 text-xs font-normal leading-[1.5] text-zinc-600">{stat.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06} className="min-w-0">
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6">
                <div>
                  <div role="img" aria-label={`Rated ${t.rating} out of 5`} className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                        strokeWidth={2}
                        fill={idx < t.rating ? "#0F766E" : "none"}
                        style={{ color: idx < t.rating ? "#0F766E" : "#D4D4D8" }}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm font-normal leading-[1.6] text-zinc-950">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="mt-6 border-t border-zinc-200 pt-4">
                  <span className="block truncate text-sm font-semibold text-zinc-950">{t.name}</span>
                  <span className="block truncate text-xs font-normal text-zinc-500">{t.context}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
