import { COLOR, TESTIMONIALS, TRUST_STATS } from "./data";
import Reveal from "./Reveal";

export default function SocialProof() {
  return (
    <section id="proof" className="border-b border-zinc-200" style={{ backgroundColor: COLOR.bg }}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-[31rem]">
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: COLOR.accentDark }}
          >
            Social proof
          </p>
          <h2
            className="mt-3 text-zinc-900"
            style={{
              fontFamily: "var(--font-display-wide)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
            }}
          >
            Buyers who flip every switch they can
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06} className="min-w-0 lg:col-span-6">
              <figure className="relative min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-4 select-none text-5xl leading-none"
                  style={{ color: COLOR.muted, fontWeight: 800 }}
                >
                  &rdquo;
                </span>
                <blockquote className="relative max-w-[31rem] pr-10 text-lg leading-relaxed text-zinc-800">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm" style={{ color: COLOR.muted }}>
                  <span className="font-semibold text-zinc-900">{t.name}</span>
                  {" · "}
                  {t.location}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={0.2}
          className="mt-10 grid grid-cols-1 gap-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:grid-cols-3"
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <p
                className="text-3xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: COLOR.muted }}>
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
