import { cx, EYEBROW, STAT, NUM, PROOF_STATS, TESTIMONIALS } from "./data";

/**
 * Static social proof — three stats and two testimonials. No motion, no interaction; this section
 * exists so the timeline's single traced example isn't the only evidence on the page.
 */
export default function SocialProof() {
  return (
    <section
      aria-labelledby="proof-title"
      className="border-b border-white/10 bg-[#0B0C10] py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <h2 id="proof-title" className="sr-only">
          Trusted by sellers
        </h2>

        <dl className="grid grid-cols-1 gap-8 border-b border-white/10 pb-16 sm:grid-cols-3">
          {PROOF_STATS.map((s) => (
            <div key={s.label}>
              <dd className={cx(NUM, "text-4xl font-extrabold text-white sm:text-5xl")}>
                {s.value}
              </dd>
              <dt className={cx(STAT, "mt-2 text-[#A1A1AA]")}>{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="max-w-[460px]">
              <p className={cx(EYEBROW, "text-[#fb7185]")}>Verified seller</p>
              <blockquote className="mt-4 text-base font-normal leading-[1.6] text-white">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-white">
                {t.name}
                <span className="ml-2 font-normal text-[#A1A1AA]">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
