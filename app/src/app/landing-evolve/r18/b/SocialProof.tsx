"use client";

import { TESTIMONIALS, PROOF_STATS } from "./data";
import { COLOR } from "./theme";
import { Eyebrow, Folio, Reveal } from "./ui";

export default function SocialProof() {
  return (
    <section className="border-b px-6 py-16 md:px-12 md:py-24" style={{ borderColor: COLOR.border }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between">
          <Eyebrow>Social proof</Eyebrow>
          <Folio index={4} total={5} label="Fig. 04" />
        </div>

        <h2
          className="mt-3 max-w-[24ch] font-extrabold"
          style={{
            fontFamily: "var(--font-display-mono)",
            color: COLOR.fg,
            letterSpacing: "-0.02em",
            fontSize: "clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem)",
          }}
        >
          What matched users say.
        </h2>

        <Reveal>
          <dl className="mt-10 grid grid-cols-1 gap-5 border-y py-8 sm:grid-cols-3" style={{ borderColor: COLOR.border }}>
            {PROOF_STATS.map((stat) => (
              <div key={stat.label}>
                <dt
                  className="font-extrabold"
                  style={{ fontFamily: "var(--font-display-mono)", color: COLOR.accentBright, fontSize: "2rem", letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </dt>
                <dd className="mt-1 text-[13px] font-normal" style={{ color: COLOR.muted, lineHeight: 1.5 }}>
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="rounded-lg border p-5" style={{ borderColor: COLOR.border, background: COLOR.bgCard }}>
                <blockquote>
                  <p className="text-[14px] font-normal" style={{ color: COLOR.fg, lineHeight: 1.6 }}>
                    <span aria-hidden="true" style={{ color: COLOR.accentBright }}>&ldquo;</span>
                    {t.quote}
                    <span aria-hidden="true" style={{ color: COLOR.accentBright }}>&rdquo;</span>
                  </p>
                </blockquote>
                <figcaption className="mt-4 text-[12px] font-semibold" style={{ color: COLOR.muted }}>
                  {t.name}
                  <span className="block font-normal" style={{ color: COLOR.mutedDim }}>
                    {t.role}
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
