import Reveal from "./Reveal";
import { PROOF_STATS, TESTIMONIALS, cx, EYEBROW, STAT, NUM } from "./data";

const GROTESK = { fontFamily: "var(--font-display-grotesk)" } as const;

/** Social proof — three headline figures and two buyer quotes, both anchored in the radar mechanic
 * the rest of the page runs on. */
export default function SocialProof() {
  return (
    <section aria-labelledby="proof-title" className="border-b border-white/10 bg-[#0B0B0F] py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <h2 id="proof-title" className="sr-only">
          What buyers say about matching on repick
        </h2>

        <Reveal>
          <dl className="grid grid-cols-1 gap-8 border-b border-white/10 pb-16 sm:grid-cols-3">
            {PROOF_STATS.map((s) => (
              <div key={s.label}>
                <dd style={GROTESK} className={cx(NUM, "text-4xl font-extrabold text-white sm:text-5xl")}>
                  {s.value}
                </dd>
                <dt className={cx(STAT, "mt-2 text-[#A1A1AA]")}>{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-10">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <figure className="max-w-[460px]">
                <p className={cx(EYEBROW, "text-[#fbbf24]")}>Verified buyer</p>
                <blockquote className="mt-4 text-base font-normal leading-[1.6] text-white">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-white">
                  {t.name}
                  <span className="ml-2 font-normal text-[#A1A1AA]">{t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
